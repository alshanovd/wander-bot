import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";

@CommandName("PATH")
export class CommandPath extends BaseCommand {
  override description: string = "Calculates path to target position.";
  override execOnBoard(board: BaseBoard): boolean {
    try {
      this.assertPayload(this.payload);
      this.verifyCoordinates(this.payload, board);
    } catch (e: unknown) {
      const error = e as Error;
      this.alertService.info(error.message);

      return false;
    }

    if (!board.currentRobot) {
      this.alertService.info("No robot on board to calculate path for.");
      return false;
    }

    const [endx, endy] = this.payload.split(",").map(Number);

    const [startx, starty] = [board.currentRobot.x, board.currentRobot.y];

    const canReach = this.walkPath(startx, starty, endx, endy, [], [], board);

    if (!canReach) {
      this.alertService.warning(
        `No path found from ${startx},${starty} to ${endx},${endy}`,
      );
    }

    return canReach;
  }

  private directions: [number, number][] = [
    [0, 1], // up
    [1, 0], // right
    [0, -1], // down
    [-1, 0], // left
  ];

  private walkPath(
    startx: number,
    starty: number,
    endx: number,
    endy: number,
    seen: boolean[][],
    path: [number, number][],
    board: BaseBoard,
  ): boolean {
    // Reject positions outside the board bounds to avoid infinite exploration
    if (
      startx < 0 ||
      starty < 0 ||
      startx >= board.width ||
      starty >= board.height
    ) {
      return false;
    }

    if (startx === endx && starty === endy) {
      this.alertService.info(`Reached target at ${endx},${endy}`);

      for (const [px, py] of path) {
        this.alertService.info(`Path step: ${px},${py}`);
      }

      return true;
    }

    // If current cell is blocked, stop exploring this branch
    if (board.blocked.some(([bx, by]) => bx === startx && by === starty)) {
      this.alertService.info(`Path blocked at ${startx},${starty}`);
      return false;
    }

    if (seen[startx]?.[starty]) {
      return false;
    }

    if (!seen[startx]) {
      seen[startx] = [];
    }

    seen[startx][starty] = true;
    path.push([startx, starty]);

    // take start x,y and end x,y and make a direction array in the direction of the end, add all directions that go closer to the end first

    const preferredDirections: [number, number][] = [];

    if (endx > startx) preferredDirections.push([1, 0]); // right
    if (endx < startx) preferredDirections.push([-1, 0]); // left
    if (endy > starty) preferredDirections.push([0, 1]); // up
    if (endy < starty) preferredDirections.push([0, -1]); // down

    // add the other directions
    for (const dir of this.directions) {
      if (
        !preferredDirections.some(([dx, dy]) => dx === dir[0] && dy === dir[1])
      ) {
        preferredDirections.push(dir);
      }
    }

    for (const [dx, dy] of preferredDirections) {
      const [nextx, nexty] = [startx + dx, starty + dy];

      if (this.walkPath(nextx, nexty, endx, endy, seen, path, board)) {
        return true;
      }
    }

    return false;
  }

  override payloadValidator(_: string): boolean {
    return true;
  }
}
