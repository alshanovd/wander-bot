import type { Board } from "@board/board.model";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name";
import type { Robot } from "@robot/robot.model";

@CommandName("fallback")
export class CommandFallback extends BaseCommand {
  override execOnBoard(board: Board): void {}
  override execOnRobot(board: Board, robot: Robot): void {}
}
