import { AlertService } from "@alert/alert-service";
import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import type { Robot } from "@robot/robot-model";

type PlacePayload = `${number} ${number} ${number}`;

@CommandName("PLACE")
export class CommandPlace extends BaseCommand {
  private alertService = AlertService.getInstance();
  override description: string =
    "First call adds a bot to the board. Second call places the existing bot.";

  override execOnBoard(board: BaseBoard): boolean {
    console.log("execOnBoard", this.commandName);

    try {
      this.assertPayload(this.payload);
    } catch (e: unknown) {
      const error = e as Error;
      this.alertService.info(error.message);
      return false;
    }

    console.log("EXEC ON BOARD HOORAY", this.payload, board);
    return true;
  }

  override execOnRobot(board: BaseBoard, robot: Robot): void {
    console.log("execOnRobot");
  }

  assertPayload(payload?: string): asserts payload is PlacePayload {
    if (!this.payload) {
      throw new Error(`The command "${this.commandName}" must have payload.`);
    }

    if (!this.payloadValidator(this.payload)) {
      throw new Error("Payload validation failed.");
    }
  }

  private payloadValidator(payload: string): boolean {
    const pattern = /^\d+ \d+ \d+$/;
    return Boolean(pattern.exec(payload));
  }
}
