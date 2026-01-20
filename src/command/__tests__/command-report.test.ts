import { BaseBoard } from "@board/board-base";
import { RobotDirection } from "@robot/robot-model";
import { describe, expect, it, vi } from "vitest";
import { CommandReport } from "../concrete/command-report";

class TestBoard extends BaseBoard {}

describe("CommandReport", () => {
  const commandReport = new CommandReport();

  // Test cases for robot reporting
  const robotTestCases = [
    {
      x: 2,
      y: 2,
      direction: RobotDirection.North,
      expected: "Output: 2,2,NORTH",
    },
    {
      x: 0,
      y: 0,
      direction: RobotDirection.South,
      expected: "Output: 0,0,SOUTH",
    },
    {
      x: 4,
      y: 4,
      direction: RobotDirection.East,
      expected: "Output: 4,4,EAST",
    },
    {
      x: 1,
      y: 3,
      direction: RobotDirection.West,
      expected: "Output: 1,3,WEST",
    },
    {
      x: 0,
      y: 4,
      direction: RobotDirection.North,
      expected: "Output: 0,4,NORTH",
    },
    {
      x: 4,
      y: 0,
      direction: RobotDirection.South,
      expected: "Output: 4,0,SOUTH",
    },
    {
      x: 2,
      y: 2,
      direction: RobotDirection.East,
      expected: "Output: 2,2,EAST",
    },
    {
      x: 2,
      y: 2,
      direction: RobotDirection.West,
      expected: "Output: 2,2,WEST",
    },
    {
      x: 1,
      y: 1,
      direction: RobotDirection.North,
      expected: "Output: 1,1,NORTH",
    },
    {
      x: 3,
      y: 3,
      direction: RobotDirection.South,
      expected: "Output: 3,3,SOUTH",
    },
    {
      x: 0,
      y: 0,
      direction: RobotDirection.North,
      expected: "Output: 0,0,NORTH",
    },
    {
      x: 4,
      y: 4,
      direction: RobotDirection.West,
      expected: "Output: 4,4,WEST",
    },
    {
      x: 0,
      y: 4,
      direction: RobotDirection.East,
      expected: "Output: 0,4,EAST",
    },
    {
      x: 4,
      y: 0,
      direction: RobotDirection.North,
      expected: "Output: 4,0,NORTH",
    },
    {
      x: 2,
      y: 0,
      direction: RobotDirection.South,
      expected: "Output: 2,0,SOUTH",
    },
    {
      x: 0,
      y: 2,
      direction: RobotDirection.East,
      expected: "Output: 0,2,EAST",
    },
    {
      x: 4,
      y: 2,
      direction: RobotDirection.West,
      expected: "Output: 4,2,WEST",
    },
    {
      x: 2,
      y: 4,
      direction: RobotDirection.North,
      expected: "Output: 2,4,NORTH",
    },
    {
      x: 1,
      y: 0,
      direction: RobotDirection.South,
      expected: "Output: 1,0,SOUTH",
    },
    {
      x: 0,
      y: 1,
      direction: RobotDirection.East,
      expected: "Output: 0,1,EAST",
    },
    {
      x: 3,
      y: 1,
      direction: RobotDirection.North,
      expected: "Output: 3,1,NORTH",
    },
  ];

  it.each(
    robotTestCases,
  )("reports position for robot at ($x,$y) facing $direction", ({
    x,
    y,
    direction,
    expected,
  }) => {
    const spy = vi.spyOn(console, "log");
    const board = new TestBoard(10, 10);
    board.currentRobot = { x, y, direction };

    commandReport.execOnBoard(board);
    expect(spy).toHaveBeenCalledWith(expected);

    spy.mockRestore();
  });

  it("does nothing when robot is not placed", () => {
    const spy = vi.spyOn(console, "log");
    const board = new TestBoard(10, 10);
    board.currentRobot = null;

    commandReport.execOnBoard(board);
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
