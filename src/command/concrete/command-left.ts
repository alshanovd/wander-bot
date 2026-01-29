import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { RobotDirection } from "@robot/robot-model";

const ROTATION = {
  [RobotDirection.North]: RobotDirection.West,
  [RobotDirection.West]: RobotDirection.South,
  [RobotDirection.South]: RobotDirection.East,
  [RobotDirection.East]: RobotDirection.North,
};

@CommandName("LEFT")
export class CommandLeft extends BaseCommand {
  override description: string = "Makes the bot turn left.";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertRobotOnBoard(board);
    } catch {
      return false;
    }

    board.currentRobot.direction = ROTATION[board.currentRobot.direction];

    this.alertService.info("Bot turned left.");
    return true;
  }

  payloadValidator(_: string): boolean {
    return true;
  }
}
