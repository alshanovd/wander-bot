import type { Alert } from "./alert-model";
import { AlertColor } from "./concrete/alert-color";

export class AlertService {
  private static instance: Alert;

  static getInstance(): Alert {
    if (!AlertService.instance) {
      // here we can change alert provider that implements Alert
      AlertService.instance = new AlertColor();
    }
    return AlertService.instance;
  }

  info(text: string): void {
    AlertService.instance.info(text);
  }

  error(text: string): void {
    AlertService.instance.error(text);
  }

  warning(text: string): void {
    AlertService.instance.warning(text);
  }
}
