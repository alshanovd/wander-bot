import { AlertService } from "@alert/alert-service";
import type { BaseBoard } from "../board/board-base";
import type { Robot } from "../robot/robot-model";

export abstract class BaseCommand {
  declare readonly commandName: Uppercase<string>; // set value in the command-name.decorator.ts

  payload?: string = "";
  protected alertService = AlertService.getInstance();

  abstract description: string;

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: BaseBoard): boolean;

  protected assertRobotOnBoard(
    board: BaseBoard,
  ): asserts board is BaseBoard & { currentRobot: Robot } {
    if (!board.currentRobot) {
      const message = 'No Robots on Board. Add a robot with "PLACE" command.';
      this.alertService.warning(message);
      throw Error(message);
    }
  }
}

export type BaseCommandType = new (payload?: string) => BaseCommand;
