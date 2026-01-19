import { BaseAlert } from "./alert-base";
import { AlertTerminal } from "./concrete/alert-terminal";

export class AlertService extends BaseAlert {
  private static instance: AlertService;

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      // here we can change alert provider
      AlertService.instance = new AlertTerminal();
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
