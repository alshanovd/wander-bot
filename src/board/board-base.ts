import { AlertService } from "@alert/alert-service";
import type { BaseSource } from "@source/source-base";
import type { Robot } from "../robot/robot-model";

export abstract class BaseBoard {
  private alertService = AlertService.getInstance();
  width: number;
  height: number;
  currentRobot: Robot | null;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.currentRobot = null;
  }

  attachSource(source: BaseSource): void {
    source.subscribe((command) => {
      const executedSuccessfully = command.execOnBoard(this);

      if (!executedSuccessfully) {
        this.alertService.warning(
          `Command "${command.commandName}" was not executed!`,
        );
      }
    });
  }
}
