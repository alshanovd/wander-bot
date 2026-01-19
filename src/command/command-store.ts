import { AlertService } from "@alert/alert-service";
import type { BaseCommandType } from "./command-base";

export class CommandStore {
  private static instance: CommandStore;
  private commands: Map<string, BaseCommandType>;
  private alertService = AlertService.getInstance();

  constructor() {
    this.commands = new Map<string, BaseCommandType>();
  }

  static getInstance(): CommandStore {
    if (!CommandStore.instance) {
      CommandStore.instance = new CommandStore();
    }
    return CommandStore.instance;
  }

  addCommand(name: string, command: BaseCommandType) {
    if (this.commands.has(name)) {
      this.alertService.error(
        `Command with name "${name}" has already been added.\nCommand names must be unuique!\nCommand "${name}" will be overwritten.`,
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

  *getCommands(): Generator<string, void, unknown> {
    for (const command of this.commands.keys()) {
      yield command;
    }
  }
}

// or simply "export const commandStore = new CommandStore()" as it is Singleton anyway
