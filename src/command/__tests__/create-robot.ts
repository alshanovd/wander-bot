import type { Robot, RobotDirection } from "@robot/robot-model";

export const createRobot = (
  x: number,
  y: number,
  direction: RobotDirection,
): Robot => ({
  x,
  y,
  direction,
});
