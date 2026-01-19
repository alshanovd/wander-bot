import type { BaseCommand } from "@command/command-base";
import type { CommandAdapter } from "@format/command-adapter.model";

type CallbackType = (command: BaseCommand) => void;

export abstract class BaseSource {
  private readonly subscribers: CallbackType[] = [];

  subscribe(callback: CallbackType) {
    this.subscribers.push(callback);
  }

  emitCommand(command: BaseCommand) {
    for (const callback of this.subscribers) {
      callback(command);
    }
  }

  abstract startStream(commandAdapter: CommandAdapter): Promise<void>;
}
