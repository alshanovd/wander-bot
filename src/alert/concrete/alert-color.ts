import chalk from "chalk";
import type { Alert } from "../alert-model";

const log = {
  info: (msg: string) => console.log(chalk.blue(msg)),
  warn: (msg: string) => console.warn(chalk.yellow(msg)),
  error: (msg: string) => console.error(chalk.red(msg)),
  success: (msg: string) => console.log(chalk.green(msg)),
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
