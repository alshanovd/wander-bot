import type { Alert } from "@alert/alert-model";

export class AlertSilent implements Alert {
  info(_: string): void {}
  error(_: string): void {}
  warning(_: string): void {}
  report(msg: string): void {
    console.log(msg);
  }
}
