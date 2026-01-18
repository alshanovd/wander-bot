import type { Board } from "@board/board.model";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import type { Robot } from "@robot/robot.model";

@CommandName("fallback")
export class CommandFallback extends BaseCommand {
  override helpText: string = "Called when Command is not found";
  override execOnBoard(board: Board): void {}
  override execOnRobot(board: Board, robot: Robot): void {}
}
