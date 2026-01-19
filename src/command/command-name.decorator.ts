import { formatCommand } from "@format/command-formatter";
import type { BaseCommand } from "./command-base";
import { CommandStore } from "./command-store";

export function CommandName(name: string) {
  return (commandConstructor: new () => BaseCommand) => {
    const formattedName = formatCommand(name);

    Reflect.defineProperty(commandConstructor.prototype, "commandName", {
      value: formattedName,
      writable: false,
      enumerable: true,
    });

    const commandStore = CommandStore.getInstance();
    commandStore.addCommandClass(formattedName, commandConstructor);
  };
}
