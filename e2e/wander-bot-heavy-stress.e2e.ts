import { spawn } from "node:child_process";
import path from "node:path";
import { expect, test } from "@playwright/test";

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
type Command = "PLACE" | "MOVE" | "LEFT" | "RIGHT" | "REPORT";

interface RobotState {
  x: number;
  y: number;
  direction: Direction;
  placed: boolean;
}

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];
const BOARD_SIZE = 10;

function rotateRight(dir: Direction): Direction {
  const idx = DIRECTIONS.indexOf(dir);
  return DIRECTIONS[(idx + 1) % 4];
}

function rotateLeft(dir: Direction): Direction {
  const idx = DIRECTIONS.indexOf(dir);
  return DIRECTIONS[(idx - 1 + 4) % 4];
}

function moveForward(state: RobotState): RobotState {
  if (!state.placed) return state;

  const movements: Record<Direction, [number, number]> = {
    NORTH: [0, 1],
    EAST: [1, 0],
    SOUTH: [0, -1],
    WEST: [-1, 0],
  };

  const [dx, dy] = movements[state.direction];
  const newX = state.x + dx;
  const newY = state.y + dy;

  // Check bounds
  if (newX < 0 || newX >= BOARD_SIZE || newY < 0 || newY >= BOARD_SIZE) {
    return state; // Don't move out of bounds
  }

  return { ...state, x: newX, y: newY };
}

function generateHeavyStressTestCommands(): {
  commands: string[];
  reportExpectations: {
    beforePlace: number; // should be 0
    afterPlace: number; // should be > 0
  };
} {
  const commands: string[] = [];
  let state: RobotState = { x: 0, y: 0, direction: "NORTH", placed: false };

  // Phase 1: Commands before PLACE - should not produce output
  for (let i = 0; i < 20; i++) {
    const rand = Math.random();
    if (rand < 0.5) {
      commands.push("MOVE"); // Should be ignored
    } else if (rand < 0.75) {
      commands.push("LEFT");
      // We still rotate even if not placed for testing
      state.direction = rotateLeft(state.direction);
    } else {
      commands.push("RIGHT");
      state.direction = rotateRight(state.direction);
    }
  }

  // Report before place - should produce no output (or be ignored)
  commands.push("REPORT");

  // Phase 2: PLACE at specific position
  state = { x: 2, y: 3, direction: "NORTH", placed: true };
  commands.push(`PLACE ${state.x},${state.y},${state.direction}`);

  // Report immediately after place - should show 2,3,NORTH
  commands.push("REPORT");

  // Phase 3: ~450 random commands with edge cases
  for (let i = 0; i < 450; i++) {
    const rand = Math.random();

    if (rand < 0.35) {
      // MOVE 35%
      state = moveForward(state);
      commands.push("MOVE");
    } else if (rand < 0.55) {
      // RIGHT 20%
      state.direction = rotateRight(state.direction);
      commands.push("RIGHT");
    } else if (rand < 0.75) {
      // LEFT 20%
      state.direction = rotateLeft(state.direction);
      commands.push("LEFT");
    } else if (rand < 0.9) {
      // REPORT 15%
      commands.push("REPORT");
    } else {
      // PLACE at new random position 10%
      const newX = Math.floor(Math.random() * BOARD_SIZE);
      const newY = Math.floor(Math.random() * BOARD_SIZE);
      const newDir = DIRECTIONS[Math.floor(Math.random() * 4)];
      state = { x: newX, y: newY, direction: newDir, placed: true };
      commands.push(`PLACE ${newX},${newY},${newDir}`);
    }
  }

  // Final sequence: Try to move out of bounds and report
  // Move to corner
  state = { x: 0, y: 0, direction: "WEST", placed: true };
  commands.push("PLACE 0,0,WEST");
  commands.push("REPORT");

  // Try to move out of bounds (west from 0)
  commands.push("MOVE");
  commands.push("MOVE");
  commands.push("MOVE");

  // Should still be at 0,0
  commands.push("REPORT");

  // Move to another corner and try bounds
  state = { x: 9, y: 9, direction: "EAST", placed: true };
  commands.push("PLACE 9,9,EAST");
  commands.push("REPORT");

  // Try to move out of bounds
  commands.push("MOVE");
  commands.push("MOVE");

  // Final report
  commands.push("REPORT");

  return {
    commands,
    reportExpectations: {
      beforePlace: 1, // Only the one before place
      afterPlace: 5, // All others after place
    },
  };
}

test.describe("Robot CLI E2E Heavy Stress Test", () => {
  test("500+ commands with PLACE/REPORT edge cases and boundary testing", async () => {
    const appPath = path.join(process.cwd(), "dist/app.js");
    const { commands, reportExpectations } = generateHeavyStressTestCommands();

    const proc = spawn("node", [appPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let error = "";

    proc.stdout?.on("data", (chunk) => {
      output += chunk.toString();
    });
    proc.stderr?.on("data", (chunk) => {
      error += chunk.toString();
    });

    const inputs = commands.join("\n") + "\n";
    proc.stdin?.write(inputs);
    proc.stdin?.end();

    await new Promise((resolve, reject) => {
      proc.on("close", (code) => {
        if (code === 0) resolve(void 0);
        else
          reject(
            new Error(
              `Exited with ${code}. Output:\n${output}\nError: ${error}`,
            ),
          );
      });

      setTimeout(() => reject(new Error("Timeout after 15s")), 15000);
    });

    // Verify output
    const outputLines = output
      .split("\n")
      .filter((line) => line.includes("Output:"));

    expect(outputLines.length).toBeGreaterThan(5);

    // Check that reports contain valid coordinates
    for (const line of outputLines) {
      const match = line.match(/Output: (\d+),(\d+),(\w+)/);
      expect(match).not.toBeNull();

      if (match) {
        const [, x, y, direction] = match;
        const xNum = parseInt(x);
        const yNum = parseInt(y);

        // All coordinates should be within bounds
        expect(xNum).toBeGreaterThanOrEqual(0);
        expect(xNum).toBeLessThan(BOARD_SIZE);
        expect(yNum).toBeGreaterThanOrEqual(0);
        expect(yNum).toBeLessThan(BOARD_SIZE);
        expect(["NORTH", "EAST", "SOUTH", "WEST"]).toContain(direction);
      }
    }

    // Verify specific known positions
    const reportStrings = outputLines.map(
      (line) => line.match(/Output: (.+)/)?.[1],
    );

    // Should have 2,3,NORTH early on (right after first PLACE)
    const hasTwoThreeNorth = reportStrings.some((r) => r === "2,3,NORTH");
    expect(hasTwoThreeNorth).toBe(true);

    // Should have 0,0,WEST and 9,9,EAST from boundary tests
    const hasCornerTests =
      reportStrings.some((r) => r === "0,0,WEST") ||
      reportStrings.some((r) => r === "9,9,EAST");
    expect(hasCornerTests).toBe(true);

    expect(error).toBe("");
  });
});
