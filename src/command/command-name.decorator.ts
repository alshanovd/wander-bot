import type { BaseCommand } from "./command-base";
import { CommandStore } from "./command-store";

export function CommandName(name: string) {
  return (commandConstructor: new () => BaseCommand) => {
    console.log("commandConstructor", commandConstructor, name);

    Reflect.defineProperty(commandConstructor.prototype, "commandName", {
      value: name.toLocaleUpperCase() as Uppercase<string>,
      writable: false,
      enumerable: true,
    });

    const commandStore = CommandStore.getInstance();
    commandStore.addCommand(name, commandConstructor);
  };
}
