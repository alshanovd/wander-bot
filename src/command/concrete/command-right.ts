import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { type Robot, RobotDirection } from "@robot/robot-model";

const ROTATION = {
  [RobotDirection.North]: RobotDirection.East,
  [RobotDirection.West]: RobotDirection.South,
  [RobotDirection.South]: RobotDirection.West,
  [RobotDirection.East]: RobotDirection.North,
};

@CommandName("RIGHT")
export class CommandRight extends BaseCommand {
  override description: string = "";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertBotOnBoard(board);
    } catch {
      return false;
    }

    board.currentRobot.direction = ROTATION[board.currentRobot.direction];
    this.alertService.info("Bot has turned right.");
    return true;
  }

  override execOnRobot(_: BaseBoard, __: Robot): void {}
}
