import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import type { Robot } from "@robot/robot-model";

@CommandName("MOVE")
export class CommandMove extends BaseCommand {
  override description: string = "Makes the bot move forward.";
  override execOnBoard(board: BaseBoard): boolean {
    throw new Error("Method not implemented.");
  }
  override execOnRobot(_: BaseBoard, __: Robot): void {}
}
