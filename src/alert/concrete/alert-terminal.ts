import type { Alert } from "../alert-model";

export class AlertTerminal implements Alert {
  error(message: string): void {
    console.error(message);
  }

  info(message: string): void {
    console.log(message);
  }

  warning(message: string): void {
    console.warn(message);
  }

  report(message: string): void {
    console.log(message);
  }
}
