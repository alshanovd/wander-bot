import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { getDirectionName } from "@command/directions";

@CommandName("REPORT")
export class CommandReport extends BaseCommand {
  override description: string = "Reports about current robot position.";

  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertRobotOnBoard(board);
    } catch {
      return false;
    }

    const { currentRobot: robot } = board;
    const dirName = getDirectionName(robot.direction);
    const output = `${robot.x},${robot.y},${dirName}`;
    this.alertService.report(`Output: ${output}`);

    return true;
  }
}
