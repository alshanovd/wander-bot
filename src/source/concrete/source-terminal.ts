import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import { AlertService } from "@alert/alert-service";
import type { CommandAdapter } from "@format/command-adapter.model";
import { BaseSource } from "../source-base";

const rl = readline.createInterface({
  input,
  output,
});

export class SourceTerminal extends BaseSource {
  readonly alertService = AlertService.getInstance();
  private readonly exitCommand = "exit";
  private readonly message = {
    welcome: 'Welcome to Wander Bot! Type "F1" to see available commands.',
    nextCommand: "\nWhat is the next command?\n",
    commNotFound: "Command is not found.",
  };

  override async startStream(commandAdapter: CommandAdapter): Promise<void> {
    this.alertService.info(this.message.welcome);

    while (true) {
      const answer = await rl.question(this.message.nextCommand);

      if (answer === this.exitCommand) break;

      const command = commandAdapter.convertToCommand(answer);
      if (command) {
        this.emitCommand(command);
      } else {
        this.alertService.warning(this.message.commNotFound);
      }
    }

    rl.close();
  }
}
