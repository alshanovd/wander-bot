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
    console.log("Hello via Bun!");
    let answer = "";
    while (answer !== "exit") {
      answer = await rl.question("Next command?\n");
      console.log(answer);
      const command = formatter.read(answer);
      this.emitCommand(command);
    }
    rl.close();
  }
}
