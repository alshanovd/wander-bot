import type { BaseBoard } from "@board/board-base";
import { BaseCommand, type PlacePayload } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { DIRECTIONS, type DirectionName } from "@command/directions";
import type { Robot } from "@robot/robot-model";

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
    this.payload = undefined; // command instance can be used many times

    return true;
  }

  private parsePayload(payload: PlacePayload): [number, number, DirectionName] {
    const [x, y, face] = payload.split(",");
    return [Number(x), Number(y), face as DirectionName];
  }

  override payloadValidator(payload: string): boolean {
    const pattern = /^\d+,\d+,(\w+)$/;
    const [_, dir] = pattern.exec(payload) || [];

    if (dir) return dir in DIRECTIONS;

    return false;
  }
}
