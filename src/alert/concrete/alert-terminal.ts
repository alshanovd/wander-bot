import { BaseAlert } from "../alert-base";

export class AlertTerminal extends BaseAlert {
  error(text: string): void {
    console.error(text);
  }

  info(text: string): void {
    console.log(text);
  }

  warning(text: string): void {
    console.warn(text);
  }
}
