import type { BaseCommand } from "@command/command-base";
import { CommandStore } from "@command/command-store";
import type { CommandAdapter } from "../command-adapter.model";

export class CommandAdapterText implements CommandAdapter {
  convertToCommand(text: string): BaseCommand | null {
    let name: string = "";
    let payload: string | undefined;

    // TODO: parse string the right way
    // payload
    if (text.includes(" ")) {
      name = text.split(" ")[0] || "";
      payload = text.slice(text.indexOf(" ")).trim();
    } else {
      // no payload
      name = text;
    }
    console.log("name", name, "payload", payload);

    const commandStore = CommandStore.getInstance();
    const commandClass = commandStore.getCommand(name);

    if (!commandClass) {
      return null;
    }

    const command = new commandClass(payload);

    return command;
  }
}
