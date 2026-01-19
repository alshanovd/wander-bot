import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { type Robot, RobotDirection } from "@robot/robot-model";

const DIRECTIONS = {
  north: RobotDirection.North,
  east: RobotDirection.East,
  south: RobotDirection.South,
  west: RobotDirection.West,
} as const;

// const DIRECTIONS = {
//   NORTH: RobotDirection.North,
//   EAST: RobotDirection.East,
//   SOUTH: RobotDirection.South,
//   WEST: RobotDirection.West,
// } as const;

type DirectionAlias = keyof typeof DIRECTIONS;
type PlacePayload = `${number},${number},${DirectionAlias}`;

@CommandName("PLACE")
export class CommandPlace extends BaseCommand {
  override description: string =
    "The first call adds a bot to the board. The second call places the existing bot.";

  override execOnBoard(board: BaseBoard): boolean {
    console.log("execOnBoard", this.commandName);

    // verify payload string
    try {
      this.assertPayload(this.payload);
      this.verifyCoordinates(this.payload, board);
    } catch (e: unknown) {
      const error = e as Error;
      this.alertService.info(error.message);
      return false;
    }

    const [x, y, face] = this.parsePayload(this.payload);

    const direction = DIRECTIONS[face];
    const robot: Robot = {
      x,
      y,
      direction,
    };

    board.currentRobot = { ...robot };

    console.log("EXEC ON BOARD HOORAY", this.payload, board);
    return true;
  }

  override execOnRobot(_: BaseBoard, __: Robot): void {
    console.log("execOnRobot");
  }

  private parsePayload(
    payload: PlacePayload,
  ): [number, number, DirectionAlias] {
    const [x, y, face] = payload.split(",");
    return [Number(x), Number(y), face as DirectionAlias];
  }

  private assertPayload(payload?: string): asserts payload is PlacePayload {
    if (!this.payload) {
      throw new Error(`The command "${this.commandName}" must have payload.`);
    }

    if (!this.payloadValidator(this.payload)) {
      throw new Error("Payload validation failed.");
    }
  }

  private payloadValidator(payload: string): boolean {
    const pattern = /^\d+,\d+,(\w+)$/;
    const [_, dir] = pattern.exec(payload) || [];

    if (dir) return dir in DIRECTIONS;

    return false;
  }

  private verifyCoordinates(payload: PlacePayload, board: BaseBoard): void {
    const [x, y] = payload.split(",");

    if (Number(x) >= board.width || Number(y) >= board.height) {
      throw new Error("Place coordinates are out of Board range.");
    }
  }
}
