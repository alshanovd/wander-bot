import type { BaseCommand } from "../command/command-base";
import type { CommandAdapter } from "../command-adapter/command-adapter.model";

type CallbackType = (command: BaseCommand) => void;

export abstract class BaseSource {
  private readonly subscribers: CallbackType[] = [];

  constructor(formatter: CommandAdapter) {
    this.startStream(formatter);
  }

  subscribe(callback: CallbackType) {
    this.subscribers.push(callback);
  }

  emitCommand(command: BaseCommand) {
    for (const callback of this.subscribers) {
      callback(command);
    }
  }

  abstract startStream(formatter: CommandAdapter): Promise<void>;
}
