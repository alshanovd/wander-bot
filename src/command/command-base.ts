import { AlertService } from "@alert/alert-service";
import type { BaseBoard } from "../board/board-base";
import type { Robot } from "../robot/robot-model";

export abstract class BaseCommand {
  payload?: string = "";
  protected alertService = AlertService.getInstance();
  declare readonly commandName: Uppercase<string>; // gets value in the command-name.decorator.ts

  abstract description: string;

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: BaseBoard): boolean;
  abstract execOnRobot(board: BaseBoard, robot: Robot): void;

  assertBotOnBoard(
    board: BaseBoard,
  ): asserts board is BaseBoard & { currentRobot: Robot } {
    if (!board.currentRobot) {
      this.alertService.warning(
        'No Robots on Board. Add a robot with "PLACE" command.',
      );
      throw Error();
    }
  }
}

export type BaseCommandType = new (payload?: string) => BaseCommand;
