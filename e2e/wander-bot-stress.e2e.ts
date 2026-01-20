import { spawn } from "node:child_process";
import path from "node:path";
import { expect, test } from "@playwright/test";

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

interface RobotState {
  x: number;
  y: number;
  direction: Direction;
}

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];
const BOARD_SIZE = 10;

function rotateRight(dir: Direction): Direction {
  const dirs = DIRECTIONS;
  const idx = dirs.indexOf(dir);
  return dirs[(idx + 1) % 4];
}

function rotateLeft(dir: Direction): Direction {
  const dirs = DIRECTIONS;
  const idx = dirs.indexOf(dir);
  return dirs[(idx - 1 + 4) % 4];
}

function moveForward(state: RobotState): RobotState {
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

function generateStressTestCommands(): {
  commands: string[];
  expectedFinalState: RobotState;
} {
  const commands: string[] = [];
  let state: RobotState = { x: 5, y: 5, direction: "NORTH" };

  // Start with PLACE
  commands.push(`PLACE ${state.x},${state.y},${state.direction}`);

  // Generate ~100 random commands
  for (let i = 0; i < 96; i++) {
    const rand = Math.random();

    if (rand < 0.4) {
      // MOVE 40%
      state = moveForward(state);
      commands.push("MOVE");
    } else if (rand < 0.6) {
      // RIGHT 20%
      state.direction = rotateRight(state.direction);
      commands.push("RIGHT");
    } else if (rand < 0.8) {
      // LEFT 20%
      state.direction = rotateLeft(state.direction);
      commands.push("LEFT");
    } else {
      // REPORT 20%
      commands.push("REPORT");
    }
  }

  // Final REPORT to verify end state
  commands.push("REPORT");

  return {
    commands,
    expectedFinalState: state,
  };
}

test.describe("Robot CLI E2E Stress Test", () => {
  test("Stress test: 100 commands on 10x10 board", async () => {
    const appPath = path.join(process.cwd(), "dist/app.js");
    const { commands } = generateStressTestCommands();

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

    // Pipe all commands
    const inputs = `${commands.join("\n")}\n`;
    proc.stdin?.write(inputs);
    proc.stdin?.end();

    // Wait for completion with longer timeout for stress test
    await new Promise((resolve, reject) => {
      proc.on("close", (code) => {
        if (code === 0) resolve(void 0);
        else
          reject(
            new Error(
              `Exited with ${code}. Output: ${output}. Error: ${error}`,
            ),
          );
      });

      // Longer timeout for stress test
      setTimeout(() => reject(new Error("Timeout after 10s")), 10000);
    });

    // Assert output contains reports (at least 2: from loop and final)
    const reportCount = (output.match(/Output:/g) || []).length;
    expect(reportCount).toBeGreaterThanOrEqual(2);

    // Assert final state is within bounds
    const lastReport = output
      .split("\n")
      .reverse()
      .find((line) => line.includes("Output:"));
    expect(lastReport).toBeDefined();

    if (lastReport) {
      const match = lastReport.match(/Output: (\d+),(\d+),(\w+)/);
      expect(match).not.toBeNull();

      if (match) {
        const [, x, y, direction] = match;
        expect(Number(x)).toBeGreaterThanOrEqual(0);
        expect(Number(x)).toBeLessThan(BOARD_SIZE);
        expect(Number(y)).toBeGreaterThanOrEqual(0);
        expect(Number(y)).toBeLessThan(BOARD_SIZE);
        expect(["NORTH", "EAST", "SOUTH", "WEST"]).toContain(direction);
      }
    }

    expect(error).toBe(""); // No errors
  });
});
