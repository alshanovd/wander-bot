import type { Board } from "@board/board.model";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import type { Robot } from "@robot/robot.model";

@CommandName("PLACE")
export class CommandPlace extends BaseCommand {
  override helpText: string =
    "First call adds a bot to the board. Second call places the existing bot.";

  override execOnBoard(board: Board): void {
    console.log("execOnBoard");
  }

  override execOnRobot(board: Board, robot: Robot): void {
    console.log("execOnRobot");
  }
}
