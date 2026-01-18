import type { Board } from "@board/board.model";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name";
import type { Robot } from "@robot/robot.model";

@CommandName("PLACE")
export class CommandPlace extends BaseCommand {
  override execOnBoard(board: Board): void {
    console.log("execOnBoard");
  }
  override execOnRobot(board: Board, robot: Robot): void {
    console.log("execOnRobot");
  }
}
