import type { BaseCommand } from "./command-base";
import { CommandStore } from "./command-store";

export function CommandName(name: string) {
  return (commandConstructor: new () => BaseCommand) => {
    console.log("commandConstructor", commandConstructor);

    Object.defineProperty(commandConstructor, "commandName", {
      value: name.toLocaleUpperCase() as Uppercase<string>,
      writable: false,
    });

    const commandStore = CommandStore.getInstance();
    commandStore.addCommand(name, commandConstructor);
  };
}
