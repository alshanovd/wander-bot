import type { Alert } from "./alert-model";
import { AlertSilent } from "./concrete/alert-silent";
// import { AlertColor } from "./concrete/alert-color";

// in getInstance() we can change alert provider that implements Alert
export class AlertService {
  private static instance: Alert;

  static getInstance(): Alert {
    if (!AlertService.instance) {
      AlertService.instance = new AlertSilent();
      // AlertService.instance = new AlertColor();
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
