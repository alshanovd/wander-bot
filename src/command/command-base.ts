import type { BaseBoard } from "../board/board-base";
import type { Robot } from "../robot/robot-model";

export abstract class BaseCommand {
  payload?: string = "";
  declare readonly commandName: Uppercase<string>; // gets value in the command-name.decorator.ts

  abstract description: string;

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: BaseBoard): boolean;
  abstract execOnRobot(board: BaseBoard, robot: Robot): void;
}

export type BaseCommandType = new (payload?: string) => BaseCommand;
