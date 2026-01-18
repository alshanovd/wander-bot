import type { BaseCommand } from "../command/command-base";

export interface CommandAdapter {
  read(text: string): BaseCommand;
}
