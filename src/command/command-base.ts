import type { Board } from "../board/board.model";
import type { Robot } from "../robot/robot.model";

export abstract class BaseCommand {
  payload?: string = "";
  declare readonly commandName: Uppercase<string>; // gets value in the command-name.decorator.ts

  abstract helpText: string;

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: Board): void;
  abstract execOnRobot(board: Board, robot: Robot): void;
}

export type BaseCommandType = new (payload?: string) => BaseCommand;
