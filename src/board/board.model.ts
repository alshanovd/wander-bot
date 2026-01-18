import type { Alert } from "../alert/alert.model";
import type { Robot } from "../robot/robot.model";

export interface Board {
  width: number;
  height: number;
  addRobot(): void;
  //   robots: IRobot[];
  robot: Robot;
  alert: Alert;
}
