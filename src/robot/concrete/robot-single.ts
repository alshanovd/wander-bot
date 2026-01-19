import type { Robot, RobotDirection } from "../robot-model";

export class RobotSingle implements Robot {
  x: number;
  y: number;
  direction: RobotDirection;

  constructor(x: number, y: number, dir: RobotDirection) {
    this.x = x;
    this.y = y;
    this.direction = dir;
  }
}
