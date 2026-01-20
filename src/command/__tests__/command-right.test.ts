import { BaseBoard } from "@board/board-base";
import { RobotDirection } from "@robot/robot-model";
import { describe, expect, it } from "vitest";
import { CommandRight } from "../concrete/command-right";
import { createRobot } from "./create-robot";

class TestBoard extends BaseBoard {}

describe("CommandRight", () => {
  const commandRight = new CommandRight();
  const board = new TestBoard(5, 5);

  it("rotates the robot right through all directions", () => {
    board.currentRobot = createRobot(2, 2, RobotDirection.North);

    // Test full rotation cycle
    commandRight.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.East);

    commandRight.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.South);

    commandRight.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.West);

    commandRight.execOnBoard(board);
    expect(board.currentRobot.direction).toBe(RobotDirection.North);
  });
});
