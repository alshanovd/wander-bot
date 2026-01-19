import { AlertService } from "@alert/alert-service";
import type { BaseCommand, BaseCommandType } from "./command-base";

export class CommandStore {
  private static instance: CommandStore;
  private commands: Map<string, new () => BaseCommand>;
  private alertService = AlertService.getInstance();

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
    if (this.commands.has(name)) {
      this.alertService.error(
        `Command with name "${name}" has already been added.\nCommand names must be unuique!\nCommand "${name}" has been overwritten.`,
      );
    }
    this.commands.set(name, command);
  }

  getCommand(name: string): BaseCommandType | null {
    if (this.commands.has(name)) {
      return this.commands.get(name) as BaseCommandType;
    }
    return null;
  }
}

// or simply "export const commandStore = new CommandStore()" as it is Singleton anyway
