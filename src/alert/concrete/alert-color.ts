import { styleText } from "node:util";
import type { Alert } from "../alert-model";

const log = {
  info: (msg: string) => console.log(styleText("blue", msg)),
  warn: (msg: string) => console.warn(styleText("yellow", msg)),
  error: (msg: string) => console.error(styleText("red", msg)),
  success: (msg: string) =>
    console.log(styleText(["bold", "green"], `✓ ${msg}`)),
};

export class AlertColor implements Alert {
  error(message: string): void {
    log.error(message);
  }

  info(message: string): void {
    log.info(message);
  }

  warning(message: string): void {
    log.warn(message);
  }

  report(msg: string): void {
    log.success(msg);
  }
}
