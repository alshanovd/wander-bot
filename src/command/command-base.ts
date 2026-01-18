import type { Board } from "../board/board.model";
import type { Robot } from "../robot/robot.model";

export abstract class BaseCommand {
  readonly commandName: Uppercase<string> = ""; // defined in the decorator @CommandName('name')
  payload?: string = "";

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: Board): void;
  abstract execOnRobot(board: Board, robot: Robot): void;
}

export type BaseCommandType = new () => BaseCommand;
