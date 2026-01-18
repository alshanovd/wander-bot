import type { BaseCommand } from "@command/command-base";
import { SourceTerminal } from "@source/source-terminal";
import { CommandAdapterText } from "./command-adapter/command-adapter-text";

// init commands
await import("./command/commands");

export async function bootstrap(): Promise<void> {
  const commandAdapter = new CommandAdapterText();
  const source = new SourceTerminal(commandAdapter);

  source.subscribe((command: BaseCommand) => {
    console.log("command emitted");
    console.log(command);
  });
}
