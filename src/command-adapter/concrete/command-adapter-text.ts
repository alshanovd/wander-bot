import type { BaseCommand } from "@command/command-base";
import { CommandStore } from "@command/command-store";
import type { CommandAdapter } from "../command-adapter.model";

export class CommandAdapterText implements CommandAdapter {
  convertToCommand(text: string): BaseCommand | null {
    const regEx = /^(\w+) (.+)$/g;
    let [_, name, payload] = regEx.exec(text) || [];

    if (!name) {
      name = text;
    }

    const commandStore = CommandStore.getInstance();
    const CommandClass = commandStore.getCommand(name);

    if (!CommandClass) {
      return null;
    }

    const command = new CommandClass(payload);

    return command;
  }
}
