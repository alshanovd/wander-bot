import type { Robot } from "@robot/robot.model";
import type { Board } from "./board.model";

export class BoardSingleBot implements Board {
  width: number;
  height: number;

  currentRobot: Robot | null = null;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  addRobot(): void {
    throw new Error("Method not implemented.");
  }
}
