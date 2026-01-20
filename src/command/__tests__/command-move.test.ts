import { BaseBoard } from "@board/board-base";
import { RobotDirection } from "@robot/robot-model";
import { describe, expect, it } from "vitest";
import { CommandMove } from "../concrete/command-move";
import { createRobot } from "./create-robot";

class TestBoard extends BaseBoard {}

describe("CommandMove - Forward Movement", () => {
  const commandMove = new CommandMove();
  const BOARD_SIZE = 3;

  // Helper function to execute moves and assert positions
  const executeMovesAndAssert = (
    board: TestBoard,
    expectedPositions: number[][],
  ) => {
    expectedPositions.forEach(([expectedX, expectedY]) => {
      commandMove.execOnBoard(board);
      expect([board.currentRobot?.x, board.currentRobot?.y]).toStrictEqual([
        expectedX,
        expectedY,
      ]);
    });
  };

  // Test cases for each direction
  const testCases = [
    {
      direction: RobotDirection.North,
      startX: 0,
      startY: 0,
      expectedPositions: [
        [0, 1],
        [0, 2],
        [0, 2], // Should stop at edge
      ],
    },
    {
      direction: RobotDirection.East,
      startX: 0,
      startY: 0,
      expectedPositions: [
        [1, 0],
        [2, 0],
        [2, 0], // Should stop at edge
      ],
    },
    {
      direction: RobotDirection.West,
      startX: 2,
      startY: 0,
      expectedPositions: [
        [1, 0],
        [0, 0],
        [0, 0], // Should stop at edge
      ],
    },
    {
      direction: RobotDirection.South,
      startX: 2,
      startY: 2,
      expectedPositions: [
        [2, 1],
        [2, 0],
        [2, 0], // Should stop at edge
      ],
    },
  ];

  describe.each(testCases)("Moving $direction from ($startX, $startY)", ({
    direction,
    startX,
    startY,
    expectedPositions,
  }) => {
    it(`should move correctly and stop at board boundaries`, () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      board.currentRobot = createRobot(startX, startY, direction);

      executeMovesAndAssert(board, expectedPositions);
    });
  });

  // Optional: Add edge case tests
  describe("Edge Cases", () => {
    it("should not move when robot is not placed on board", () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      board.currentRobot = null;

      expect(() => commandMove.execOnBoard(board)).not.toThrow();
      expect(board.currentRobot).toBeNull();
    });
  });
});
