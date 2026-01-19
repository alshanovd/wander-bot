import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { RobotDirection } from "@robot/robot-model";

const MOVEMENT: Record<RobotDirection, [number, number]> = {
  [RobotDirection.North]: [0, 1],
  [RobotDirection.East]: [1, 0],
  [RobotDirection.South]: [0, -1],
  [RobotDirection.West]: [-1, 0],
};

@CommandName("MOVE")
export class CommandMove extends BaseCommand {
  override description: string = "Makes the bot move forward.";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertRobotOnBoard(board);
    } catch {
      return false;
    }

    const { currentRobot } = board;
    const move = MOVEMENT[currentRobot.direction];
    const [newX, newY] = [currentRobot.x + move[0], currentRobot.y + move[1]];

    const canMove = this.calcCanMove(newX, newY, board);
    if (!canMove) {
      this.alertService.warning("The move out of Board.");
      return false;
    }

    currentRobot.x = newX;
    currentRobot.y = newY;
    this.alertService.info("Bot moved forward.");

    return true;
  }

  private calcCanMove(
    newX: number,
    newY: number,
    { width, height }: BaseBoard,
  ): boolean {
    if (newX < 0 || newY < 0 || newX >= width || newY >= height) {
      return false;
    }
    return true;
  }
}
