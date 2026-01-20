import type { Alert } from "../alert-model";

const log = {
  info: (msg: string) => console.log("\x1b[36m%s\x1b[0m", msg, "\x1b[0m"),
  warn: (msg: string) => console.log("\x1b[33m%s\x1b[0m", msg, "\x1b[0m"),
  error: (msg: string) => console.log("\x1b[31m%s\x1b[0m", msg, "\x1b[0m"),
  success: (msg: string) => console.log("\x1b[32m%s\x1b[0m", msg, "\x1b[0m"),
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
