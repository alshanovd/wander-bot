import { BaseBoard } from "@board/board-base";
import { RobotDirection } from "@robot/robot-model";
import { describe, expect, it } from "vitest";
import { CommandPlace } from "../concrete/command-place";

class TestBoard extends BaseBoard {}

describe("CommandPlace", () => {
  const BOARD_SIZE = 5;

  describe("Basic placement", () => {
    it("places robot when no robot exists", () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      const command = new CommandPlace("2,2,NORTH");

      const result = command.execOnBoard(board);

      expect(result).toBe(true);
      expect(board.currentRobot).toEqual({
        x: 2,
        y: 2,
        direction: RobotDirection.North,
      });
    });

    it("replaces existing robot when placing again", () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      board.currentRobot = { x: 0, y: 0, direction: RobotDirection.South };

      const command = new CommandPlace("3,3,EAST");
      const result = command.execOnBoard(board);

      expect(result).toBe(true);
      expect(board.currentRobot).toEqual({
        x: 3,
        y: 3,
        direction: RobotDirection.East,
      });
    });
  });

  describe("Valid placements", () => {
    const validCases = [
      { payload: "0,0,NORTH", x: 0, y: 0, direction: RobotDirection.North },
      { payload: "2,2,EAST", x: 2, y: 2, direction: RobotDirection.East },
      { payload: "4,4,SOUTH", x: 4, y: 4, direction: RobotDirection.South },
      { payload: "1,3,WEST", x: 1, y: 3, direction: RobotDirection.West },
      { payload: "0,4,NORTH", x: 0, y: 4, direction: RobotDirection.North },
      { payload: "4,0,EAST", x: 4, y: 0, direction: RobotDirection.East },
    ];

    it.each(validCases)("places robot at $payload", ({
      payload,
      x,
      y,
      direction,
    }) => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      const command = new CommandPlace(payload);

      const result = command.execOnBoard(board);

      expect(result).toBe(true);
      expect(board.currentRobot).toEqual({ x, y, direction });
    });
  });

  describe("Invalid payloads", () => {
    const invalidCases = [
      { payload: undefined, description: "no payload" },
      { payload: "", description: "empty payload" },
      { payload: "2,2", description: "missing direction" },
      { payload: "a,2,NORTH", description: "non-numeric X" },
      { payload: "2,b,SOUTH", description: "non-numeric Y" },
      { payload: "2,2,UP", description: "invalid direction" },
      { payload: "5,0,NORTH", description: "X out of bounds" },
      { payload: "0,5,EAST", description: "Y out of bounds" },
      { payload: "2,2,NORTH,EXTRA", description: "extra fields" },
      { payload: "-1,2,NORTH", description: "negative X" },
      { payload: "2.5,2,NORTH", description: "decimal X" },
    ];

    it.each(invalidCases)("fails with $description", ({ payload }) => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      const command = new CommandPlace(payload);

      const result = command.execOnBoard(board);

      expect(result).toBe(false);
      expect(board.currentRobot).toBeNull();
    });
  });

  describe("Multiple placements", () => {
    it("can place robot multiple times with different valid positions", () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);

      // First placement
      const command1 = new CommandPlace("1,1,NORTH");
      expect(command1.execOnBoard(board)).toBe(true);
      expect(board.currentRobot).toEqual({
        x: 1,
        y: 1,
        direction: RobotDirection.North,
      });

      // Second placement
      const command2 = new CommandPlace("3,3,EAST");
      expect(command2.execOnBoard(board)).toBe(true);
      expect(board.currentRobot).toEqual({
        x: 3,
        y: 3,
        direction: RobotDirection.East,
      });
    });

    it("handles invalid placement between valid placements", () => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);

      // First valid placement
      const command1 = new CommandPlace("2,2,NORTH");
      expect(command1.execOnBoard(board)).toBe(true);

      // Invalid placement
      const command2 = new CommandPlace("5,5,NORTH");
      expect(command2.execOnBoard(board)).toBe(false);
      // Should keep previous valid placement
      expect(board.currentRobot).toEqual({
        x: 2,
        y: 2,
        direction: RobotDirection.North,
      });

      // Second valid placement
      const command3 = new CommandPlace("0,0,SOUTH");
      expect(command3.execOnBoard(board)).toBe(true);
      expect(board.currentRobot).toEqual({
        x: 0,
        y: 0,
        direction: RobotDirection.South,
      });
    });
  });

  describe("All direction validations", () => {
    const directions = [
      { input: "NORTH", expected: RobotDirection.North, isValid: true },
      { input: "SOUTH", expected: RobotDirection.South, isValid: true },
      { input: "EAST", expected: RobotDirection.East, isValid: true },
      { input: "WEST", expected: RobotDirection.West, isValid: true },
      { input: "north", expected: null, isValid: false },
      { input: "North", expected: null, isValid: false },
      { input: "NORTHWEST", expected: null, isValid: false },
      { input: "LEFT", expected: null, isValid: false },
      { input: "RIGHT", expected: null, isValid: false },
    ];

    it.each(directions)("direction $input should be $isValid", ({
      input,
      expected,
      isValid,
    }) => {
      const board = new TestBoard(BOARD_SIZE, BOARD_SIZE);
      const command = new CommandPlace(`2,2,${input}`);

      const result = command.execOnBoard(board);

      expect(result).toBe(isValid);
      if (isValid) {
        expect(board.currentRobot?.direction).toBe(expected);
      } else {
        expect(board.currentRobot).toBeNull();
      }
    });
  });
});
