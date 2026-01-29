import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";

@CommandName("BLOCK")
export class CommandBlock extends BaseCommand {
  description: string =
    "This command is currently blocked and cannot be executed.";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertPayload(this.payload);
      this.verifyCoordinates(this.payload, board);
    } catch (e: unknown) {
      const error = e as Error;
      this.alertService.info(error.message);

      return false;
    }

    const [x, y] = this.payload.split(",").map(Number);
    board.blocked.push([x, y]);
    this.alertService.info(`Cell at ${x},${y} is now blocked.`);

    return true;
  }

  override payloadValidator(payload: string): boolean {
    const pattern = /^\d+,\d+$/;
    return Boolean(pattern.exec(payload));
  }
}
