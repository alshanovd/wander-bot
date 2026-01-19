import type { BaseCommand } from "@command/command-base";
import { CommandStore } from "@command/command-store";
import type { CommandAdapter } from "./command-adapter.model";

export class CommandAdapterText implements CommandAdapter {
  read(text: string): BaseCommand | null {
    // TODO: parse string the right way

    let name: string = "";
    let payload: string | undefined;

    // payload
    if (text.includes(" ")) {
      name = text.split(" ")[0] || "";
      payload = text.slice(text.indexOf(" ")).trim();
    } else {
      // no payload
      name = text;
    }
    console.log("name", name, "payload", payload);

    name = name.toUpperCase();

    const commandStore = CommandStore.getInstance();
    const Command = commandStore.getCommand(name);

    if (!Command) {
      return null;
    }

    const command = new Command(payload);

    return command;
  }
}
