import type { BaseCommand } from "../command/command-base";

export interface CommandAdapter {
  convertToCommand(input: unknown): BaseCommand | null;
}
