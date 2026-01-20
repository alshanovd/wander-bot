import { spawn } from "node:child_process";
import path from "node:path";
import { expect, test } from "@playwright/test";

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

interface RobotState {
  x: number;
  y: number;
  direction: Direction;
  isPlaced: boolean;
}

interface TestCommand {
  input: string;
  expectedState?: RobotState; // Only populated for REPORT commands
  commandIndex: number;
  shouldIgnore: boolean; // Whether this command should be ignored (before first PLACE or invalid PLACE)
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
  if (!state.isPlaced) return state;

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

function generateStressTestCommands(): TestCommand[] {
  const commands: TestCommand[] = [];
  let state: RobotState = {
    x: 0,
    y: 0,
    direction: "NORTH",
    isPlaced: false,
  };

  // Keep track of first valid PLACE command index
  let firstValidPlaceIndex = -1;

  // Generate 1000 commands with various scenarios
  for (let i = 0; i < 1000; i++) {
    const rand = Math.random();
    let commandInput = "";
    let shouldIgnore = false;
    let isInvalidPlace = false;

    if (rand < 0.05) {
      // 5% chance: Commands before any PLACE (or invalid PLACE commands)
      if (Math.random() < 0.5) {
        // Generate invalid PLACE commands (out of bounds)
        const invalidX = Math.random() < 0.5 ? -1 : BOARD_SIZE;
        const invalidY = Math.random() < 0.5 ? -1 : BOARD_SIZE;
        const direction = DIRECTIONS[Math.floor(Math.random() * 4)];
        commandInput = `PLACE ${invalidX},${invalidY},${direction}`;
        isInvalidPlace = true;
        shouldIgnore = true;
      } else {
        // Generate other commands before robot is placed
        const prePlaceCommands = ["MOVE", "LEFT", "RIGHT", "REPORT"];
        commandInput =
          prePlaceCommands[Math.floor(Math.random() * prePlaceCommands.length)];
        shouldIgnore = !state.isPlaced;
      }
    } else if (rand < 0.3) {
      // 25% chance: PLACE commands (valid)
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      const direction = DIRECTIONS[Math.floor(Math.random() * 4)];
      commandInput = `PLACE ${x},${y},${direction}`;

      // Update state with new placement
      state = { x, y, direction, isPlaced: true };

      // Track first valid PLACE
      if (firstValidPlaceIndex === -1) {
        firstValidPlaceIndex = i;
      }
    } else if (rand < 0.55) {
      // 25% chance: MOVE
      commandInput = "MOVE";
      if (state.isPlaced) {
        state = moveForward(state);
      } else {
        shouldIgnore = true;
      }
    } else if (rand < 0.7) {
      // 15% chance: RIGHT
      commandInput = "RIGHT";
      if (state.isPlaced) {
        state.direction = rotateRight(state.direction);
      } else {
        shouldIgnore = true;
      }
    } else if (rand < 0.85) {
      // 15% chance: LEFT
      commandInput = "LEFT";
      if (state.isPlaced) {
        state.direction = rotateLeft(state.direction);
      } else {
        shouldIgnore = true;
      }
    } else {
      // 15% chance: REPORT
      commandInput = "REPORT";
      if (state.isPlaced) {
        commands.push({
          input: commandInput,
          expectedState: { ...state },
          commandIndex: i,
          shouldIgnore: false,
        });
        continue;
      } else {
        shouldIgnore = true;
      }
    }

    commands.push({
      input: commandInput,
      commandIndex: i,
      shouldIgnore: isInvalidPlace || shouldIgnore,
    });
  }

  // Always end with a REPORT to verify final state
  if (state.isPlaced) {
    commands.push({
      input: "REPORT",
      expectedState: { ...state },
      commandIndex: commands.length,
      shouldIgnore: false,
    });
  }

  console.log(`Total commands: ${commands.length}`);
  console.log(
    `First valid PLACE at command #${firstValidPlaceIndex >= 0 ? firstValidPlaceIndex : "never"}`,
  );

  // Count how many commands are ignored (before first PLACE)
  const ignoredBeforePlace = commands.filter(
    (c) =>
      c.commandIndex < firstValidPlaceIndex && !c.input.startsWith("PLACE"),
  ).length;
  console.log(`Commands ignored before first PLACE: ${ignoredBeforePlace}`);

  return commands;
}

function simulateCommands(commands: TestCommand[]): RobotState[] {
  let state: RobotState = { x: 0, y: 0, direction: "NORTH", isPlaced: false };
  const simulationStates: RobotState[] = [];

  for (const cmd of commands) {
    if (cmd.input.startsWith("PLACE")) {
      // Parse PLACE command
      const match = cmd.input.match(/PLACE (\d+),(\d+),(\w+)/);
      if (match) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        const direction = match[3] as Direction;

        // Check if valid PLACE (within bounds)
        if (
          x >= 0 &&
          x < BOARD_SIZE &&
          y >= 0 &&
          y < BOARD_SIZE &&
          DIRECTIONS.includes(direction)
        ) {
          state = { x, y, direction, isPlaced: true };
        }
      }
    } else if (state.isPlaced) {
      // Process other commands only if robot is placed
      switch (cmd.input) {
        case "MOVE":
          state = moveForward(state);
          break;
        case "LEFT":
          state.direction = rotateLeft(state.direction);
          break;
        case "RIGHT":
          state.direction = rotateRight(state.direction);
          break;
        // REPORT doesn't change state
      }
    }

    // Record state for REPORT commands
    if (cmd.input === "REPORT" && state.isPlaced) {
      simulationStates.push({ ...state });
    }
  }

  return simulationStates;
}

test.describe("Robot CLI E2E Stress Test - 1000 Commands with PLACE verification", () => {
  test("Stress test: 1000 commands with correct PLACE behavior", async () => {
    const appPath = path.join(process.cwd(), "dist/app.js");
    const commands = generateStressTestCommands();

    // First simulate locally to get expected states
    const simulatedStates = simulateCommands(commands);

    // Get actual REPORT commands from our test data
    const expectedReports = commands.filter(
      (cmd) => cmd.input === "REPORT" && !cmd.shouldIgnore,
    );

    console.log(`Expected REPORT outputs: ${expectedReports.length}`);
    console.log(`Simulated REPORT states: ${simulatedStates.length}`);

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
    const inputs = commands.map((cmd) => cmd.input).join("\n") + "\n";
    proc.stdin?.write(inputs);
    proc.stdin?.end();

    // Wait for completion with longer timeout for stress test
    await new Promise<void>((resolve, reject) => {
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else
          reject(
            new Error(
              `Process exited with code ${code}. Output: ${output}. Error: ${error}`,
            ),
          );
      });

      // Longer timeout for 1000 commands
      setTimeout(() => reject(new Error("Timeout after 30s")), 30000);
    });

    // Extract all REPORT outputs
    const outputLines = output.split("\n");
    const reportOutputs = outputLines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.includes("Output:"));

    // Verify we have the expected number of REPORT outputs
    expect(
      reportOutputs.length,
      `Expected ${simulatedStates.length} REPORT outputs, got ${reportOutputs.length}`,
    ).toBe(simulatedStates.length);

    // Verify each REPORT output matches simulation
    for (let i = 0; i < simulatedStates.length; i++) {
      const expectedState = simulatedStates[i];
      const actualLine = reportOutputs[i].line;

      // Extract coordinates and direction from output
      const match = actualLine.match(/Output: (\d+),(\d+),(\w+)/);

      if (!match) {
        throw new Error(`Invalid REPORT format: "${actualLine}"`);
      }

      const [, actualX, actualY, actualDir] = match;
      const actualXNum = parseInt(actualX, 10);
      const actualYNum = parseInt(actualY, 10);

      // Verify format and bounds
      expect(
        actualXNum,
        `X coordinate out of bounds: ${actualXNum}`,
      ).toBeGreaterThanOrEqual(0);
      expect(
        actualXNum,
        `X coordinate out of bounds: ${actualXNum}`,
      ).toBeLessThan(BOARD_SIZE);
      expect(
        actualYNum,
        `Y coordinate out of bounds: ${actualYNum}`,
      ).toBeGreaterThanOrEqual(0);
      expect(
        actualYNum,
        `Y coordinate out of bounds: ${actualYNum}`,
      ).toBeLessThan(BOARD_SIZE);
      expect(["NORTH", "EAST", "SOUTH", "WEST"]).toContain(actualDir);

      // Verify the state matches expected state from simulation
      const errorMessage =
        `REPORT mismatch at output #${i + 1}:\n` +
        `  Expected: ${expectedState.x},${expectedState.y},${expectedState.direction}\n` +
        `  Actual: ${actualX},${actualY},${actualDir}\n` +
        `  Full line: "${actualLine}"`;

      expect(actualXNum, errorMessage).toBe(expectedState.x);
      expect(actualYNum, errorMessage).toBe(expectedState.y);
      expect(actualDir, errorMessage).toBe(expectedState.direction);
    }

    // Verify no errors in stderr
    expect(error, `Unexpected stderr output: ${error}`).toBe("");
  });

  // Test specific PLACE scenarios
  test("PLACE command edge cases", async () => {
    const appPath = path.join(process.cwd(), "dist/app.js");

    const testCases = [
      {
        name: "Commands before first PLACE are ignored",
        commands: [
          "MOVE",
          "LEFT",
          "RIGHT",
          "REPORT", // Should not output anything
          "PLACE 3,3,NORTH",
          "REPORT", // Should output: Output: 3,3,NORTH
        ],
        expectedReports: ["Output: 3,3,NORTH"],
      },
      {
        name: "Multiple PLACE commands replace position",
        commands: [
          "PLACE 1,1,NORTH",
          "MOVE",
          "REPORT", // Output: 1,2,NORTH
          "PLACE 4,4,EAST", // Replaces robot
          "REPORT", // Output: 4,4,EAST
          "MOVE",
          "REPORT", // Output: 5,4,EAST
        ],
        expectedReports: [
          "Output: 1,2,NORTH",
          "Output: 4,4,EAST",
          "Output: 5,4,EAST",
        ],
      },
      {
        name: "Invalid PLACE commands are ignored",
        commands: [
          "PLACE -1,0,NORTH", // Invalid X
          "REPORT", // No output - robot not placed yet
          "PLACE 0,10,NORTH", // Invalid Y
          "REPORT", // No output - robot not placed yet
          "PLACE 0,0,NORTH", // Valid
          "MOVE",
          "REPORT", // Output: 0,1,NORTH
          "PLACE 5,5,INVALID", // Invalid direction - robot stays at 0,1,NORTH
          "REPORT", // Output: 0,1,NORTH (robot unchanged)
        ],
        expectedReports: ["Output: 0,1,NORTH", "Output: 0,1,NORTH"],
      },
      {
        name: "Complex PLACE sequence",
        commands: [
          "MOVE", // Ignored
          "LEFT", // Ignored
          "PLACE 0,0,NORTH",
          "MOVE",
          "REPORT", // Output: 0,1,NORTH
          "PLACE 9,9,SOUTH", // Replace
          "REPORT", // Output: 9,9,SOUTH
          "MOVE",
          "MOVE",
          "REPORT", // Output: 9,7,SOUTH
          "PLACE 5,5,WEST",
          "RIGHT",
          "REPORT", // Output: 5,5,NORTH
        ],
        expectedReports: [
          "Output: 0,1,NORTH",
          "Output: 9,9,SOUTH",
          "Output: 9,7,SOUTH",
          "Output: 5,5,NORTH",
        ],
      },
    ];

    for (const testCase of testCases) {
      console.log(`\nTesting: ${testCase.name}`);

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

      const inputs = testCase.commands.join("\n") + "\n";
      proc.stdin?.write(inputs);
      proc.stdin?.end();

      await new Promise<void>((resolve, reject) => {
        proc.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Process exited with code ${code}`));
        });
        setTimeout(() => reject(new Error("Timeout")), 5000);
      });

      // Extract REPORT outputs
      const reportOutputs = output
        .split("\n")
        .filter((line) => line.includes("Output:"))
        .map((line) => line.trim());

      // Verify expected outputs
      expect(
        reportOutputs,
        `${testCase.name} - REPORT outputs mismatch`,
      ).toEqual(testCase.expectedReports);

      // Verify no errors
      expect(error, `${testCase.name} - Unexpected stderr: ${error}`).toBe("");
    }
  });
});
