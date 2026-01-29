import { AlertService } from "@alert/alert-service";
import type { BaseBoard } from "../board/board-base";
import type { Robot } from "../robot/robot-model";
import type { DirectionName } from "./directions";

export abstract class BaseCommand {
  declare readonly commandName: Uppercase<string>; // set value in the command-name.decorator.ts

  payload?: string = "";
  protected alertService = AlertService.getInstance();

  abstract description: string;

  constructor(payload?: string) {
    this.payload = payload;
  }

  abstract execOnBoard(board: BaseBoard): boolean;

  abstract payloadValidator(payload: string): boolean;

  protected assertRobotOnBoard(
    board: BaseBoard,
  ): asserts board is BaseBoard & { currentRobot: Robot } {
    if (!board.currentRobot) {
      const message = 'No Robots on Board. Add a robot with "PLACE" command.';
      this.alertService.warning(message);
      throw Error(message);
    }
  }

  protected assertPayload(payload?: string): asserts payload is PlacePayload {
    if (!payload) {
      throw new Error(`The command "${this.commandName}" must have payload.`);
    }

    if (!this.payloadValidator(payload)) {
      throw new Error("Payload validation failed.");
    }
  }

  public verifyCoordinates(payload: string, board: BaseBoard): void {
    const [x, y] = payload.split(",");

    if (Number(x) >= board.width || Number(y) >= board.height) {
      throw new Error("Place coordinates are out of Board range.");
    }

    if (this.verifyBlockedCells(payload, board)) {
      throw new Error("Place coordinates are blocked on the Board.");
    }
  }

  private verifyBlockedCells(payload: string, board: BaseBoard): boolean {
    const [x, y] = payload.split(",");

    const isBlocked = board.blocked.some(
      ([bx, by]) => bx === Number(x) && by === Number(y),
    );

    return isBlocked;
  }
}

export type PlacePayload = `${number},${number},${DirectionName}`;
export type BaseCommandType = new (payload?: string) => BaseCommand;
