import type { Robot } from "../robot/robot.model";

export interface Board {
  width: number;
  height: number;
  addRobot(): void;
  currentRobot: Robot | null;
}
