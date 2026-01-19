import type { Robot, RobotDirection } from "./robot.model";

export class RobotSingle implements Robot {
  positionX: number;
  positionY: number;
  direction: RobotDirection;

  constructor(x: number, y: number, dir: RobotDirection) {
    this.positionX = x;
    this.positionY = y;
    this.direction = dir;
  }
}
