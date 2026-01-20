import { spawn } from "node:child_process";
import path from "node:path";
import { expect, test } from "@playwright/test";

test.describe("Robot CLI E2E", () => {
  test("PLACE → MOVE ×2 → REPORT → 1,3,NORTH", async () => {
    const appPath = path.join(process.cwd(), "dist/app.js");

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

    // Pipe exact inputs
    const inputs = "PLACE 1,1,NORTH\nMOVE\nMOVE\nREPORT\n";
    proc.stdin?.write(inputs);
    proc.stdin?.end();

    // Wait for completion
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

      // Timeout
      setTimeout(() => reject(new Error("Timeout")), 5000);
    });

    // Assert output - verify exact position and direction
    const reportMatch = output.match(/Output: (\d+),(\d+),(\w+)/);
    expect(reportMatch).not.toBeNull();

    if (reportMatch) {
      const [, x, y, direction] = reportMatch;
      expect(x).toBe("1");
      expect(y).toBe("3");
      expect(direction).toBe("NORTH");
    }

    expect(error).toBe(""); // No errors
  });
});
