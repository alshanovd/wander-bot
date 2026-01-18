import type { BaseCommand, BaseCommandType } from "./command-base";

export class CommandStore {
  private static instance: CommandStore;
  private commands: Map<string, new () => BaseCommand>;

  constructor() {
    this.commands = new Map<string, new () => BaseCommand>();
  }

  static getInstance(): CommandStore {
    if (!CommandStore.instance) {
      CommandStore.instance = new CommandStore();
    }
    return CommandStore.instance;
  }

  addCommand(name: string, command: new () => BaseCommand) {
    this.commands.set(name, command);
  }

  getCommand(name: string): BaseCommandType | null {
    if (this.commands.has(name)) {
      return this.commands.get(name) as BaseCommandType;
    }
    return null;
  }
}

export const commandStore = new CommandStore();

// or simply "export const commandStore = new CommandStore()" as it is Singleton anyway
