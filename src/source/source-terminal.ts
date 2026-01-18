import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import type { CommandAdapter } from "../command-adapter/command-adapter.model";
import { BaseSource } from "./base-source";

const rl = readline.createInterface({
  input,
  output,
});

export class SourceTerminal extends BaseSource {
  override async startStream(formatter: CommandAdapter): Promise<void> {
    console.log('Welcome to Wander Bot! Type "F1" to see available commands.');
    let answer = "";
    while (answer !== "exit") {
      answer = await rl.question("\nWhat is the next command?\n");
      console.log(answer);
      const command = formatter.read(answer);
      if (command) {
        this.emitCommand(command);
      } else {
        console.warn("Command is not found");
      }
    }
    rl.close();
  }
}
