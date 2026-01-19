import type { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { CommandStore } from "@command/command-store";

@CommandName("F1")
export class CommandF1 extends BaseCommand {
  override description: string = "Shows available commands.";

  override execOnBoard(_: BaseBoard): boolean {
    const commandStore = CommandStore.getInstance();

    this.alertService.info("Commands available:");
    for (const name of commandStore.getCommands()) {
      this.alertService.info(name);
    }

    return true;
  }
}
