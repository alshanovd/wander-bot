import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { RobotDirection } from "@robot/robot-model";

const ROTATION = {
  [RobotDirection.North]: RobotDirection.East,
  [RobotDirection.East]: RobotDirection.South,
  [RobotDirection.South]: RobotDirection.West,
  [RobotDirection.West]: RobotDirection.North,
};

@CommandName("RIGHT")
export class CommandRight extends BaseCommand {
  override description: string = "";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertRobotOnBoard(board);
    } catch {
      return false;
    }

    board.currentRobot.direction = ROTATION[board.currentRobot.direction];
    this.alertService.info("Bot turned right.");
    return true;
  }

  payloadValidator(_: string): boolean {
    return true;
  }
}
