import { AlertService } from "@alert/alert-service";
import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { type Robot, RobotDirection } from "@robot/robot-model";

const ROTATION = {
  [RobotDirection.North]: RobotDirection.West,
  [RobotDirection.West]: RobotDirection.South,
  [RobotDirection.South]: RobotDirection.East,
  [RobotDirection.East]: RobotDirection.North,
};

export class CommandLeft extends BaseCommand {
  private alertService = AlertService.getInstance();
  override description: string = "Make the bot turn left.";
  override execOnBoard(board: BaseBoard): boolean {
    if (!board.currentRobot) {
      this.alertService.error("No bots on Board");
      return false;
    }

    board.currentRobot.direction = ROTATION[board.currentRobot.direction];
    return true;
  }
  override execOnRobot(board: BaseBoard, robot: Robot): void {}
}
