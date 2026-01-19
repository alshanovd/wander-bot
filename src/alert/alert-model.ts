export interface Alert {
  info(msg: string): void;
  error(msg: string): void;
  warning(msg: string): void;
  report(msg: string): void;
}
