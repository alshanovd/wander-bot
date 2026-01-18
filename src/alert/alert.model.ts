export interface Alert {
  notifyInfo(text: string): void;
  notifyError(text: string): void;
}
