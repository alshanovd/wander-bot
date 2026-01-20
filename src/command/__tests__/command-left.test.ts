import { BaseBoard } from "@board/board-base";
import { RobotDirection } from "@robot/robot-model";
import { describe, expect, it } from "vitest";
import { CommandLeft } from "../concrete/command-left";

class TestBoard extends BaseBoard {}

describe("CommandLeft", () => {
  const commandLeft = new CommandLeft();

  it("rotates the robot left through all directions", () => {
    const board = new TestBoard(5, 5);
    board.currentRobot = { x: 2, y: 2, direction: RobotDirection.North };

    // Test full rotation cycle
    commandLeft.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.West);

    commandLeft.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.South);

    commandLeft.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.East);

    commandLeft.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.North);
  });
});
