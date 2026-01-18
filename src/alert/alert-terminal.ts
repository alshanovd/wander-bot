import type { Alert } from "./alert.model";

export class AlertTerminal implements Alert {
  notifyError(text: string): void {
    console.error(text);
  }

  notifyInfo(text: string): void {
    console.log(text);
  }
}
