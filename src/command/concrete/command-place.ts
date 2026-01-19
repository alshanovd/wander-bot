import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { DIRECTIONS, type DirectionName } from "@command/directions";
import type { Robot } from "@robot/robot-model";

type PlacePayload = `${number},${number},${DirectionName}`;

@CommandName("PLACE")
export class CommandPlace extends BaseCommand {
  override description: string =
    "The first call adds a bot to the board. The second call places the existing bot.";

  override execOnBoard(board: BaseBoard): boolean {
    // verify payload
    try {
      this.assertPayload(this.payload);
      this.verifyCoordinates(this.payload, board);
    } catch (e: unknown) {
      const error = e as Error;
      this.alertService.info(error.message);

      return false;
    }

    const [x, y, face] = this.parsePayload(this.payload);

    const direction = DIRECTIONS[face];
    const robot: Robot = { x, y, direction };

    board.currentRobot = { ...robot };
    this.alertService.info(`Bot placed on ${x},${y},${face}`);

    return true;
  }

  private parsePayload(payload: PlacePayload): [number, number, DirectionName] {
    const [x, y, face] = payload.split(",");
    return [Number(x), Number(y), face as DirectionName];
  }

  private assertPayload(payload?: string): asserts payload is PlacePayload {
    if (!payload) {
      throw new Error(`The command "${this.commandName}" must have payload.`);
    }

    if (!this.payloadValidator(payload)) {
      throw new Error("Payload validation failed.");
    }
  }

  private payloadValidator(payload: string): boolean {
    const pattern = /^\d+,\d+,(\w+)$/;
    const [_, dir] = pattern.exec(payload) || [];

    if (dir) return dir in DIRECTIONS;

    return false;
  }

  private verifyCoordinates(payload: PlacePayload, board: BaseBoard): void {
    const [x, y] = payload.split(",");

    if (Number(x) >= board.width || Number(y) >= board.height) {
      throw new Error("Place coordinates are out of Board range.");
    }
  }
}
