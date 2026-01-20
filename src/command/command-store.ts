import { AlertService } from "@alert/alert-service";
import type { BaseCommand, BaseCommandType } from "./command-base";

export class CommandStore {
  private static instance: CommandStore;
  private alertService = AlertService.getInstance();

  private commandClasses: Map<string, BaseCommandType>;
  private commandInstances = new Map<string, BaseCommand>();

  constructor() {
    this.commandClasses = new Map<string, BaseCommandType>();
  }

  static getInstance(): CommandStore {
    if (!CommandStore.instance) {
      CommandStore.instance = new CommandStore();
    }
    return CommandStore.instance;
  }

  addCommandClass(name: string, command: BaseCommandType) {
    if (this.commandClasses.has(name)) {
      this.alertService.error(
        `Command with name "${name}" has already been added.\nCommand names must be unuique!\nCommand "${name}" will be overwritten.`,
      );
    }
    this.commandClasses.set(name, command);
  }

  private getCommandClass(name: string): BaseCommandType | null {
    if (this.commandClasses.has(name)) {
      return this.commandClasses.get(name) as BaseCommandType;
    }
    return null;
  }

  *getCommandNames(): Generator<string, void, unknown> {
    for (const command of this.commandClasses.keys()) {
      yield command;
    }
  }

  getCommandInstance(name: string, payload?: string): BaseCommand | null {
    const CommandClass = this.getCommandClass(name);

    if (!CommandClass) {
      return null;
    }

    let command: BaseCommand | undefined = this.commandInstances.get(name);
    if (command) {
      if (command.payload !== payload) {
        command = new CommandClass(payload);
      }
    } else {
      command = new CommandClass(payload);
      this.commandInstances.set(name, command);
    }

    return command;
  }
}

// or simply "export const commandStore = new CommandStore()" as it is Singleton anyway
