import type { BaseCommand } from "@command/command-base";
import { CommandStore } from "@command/command-store";
import type { CommandAdapter } from "./command-adapter.model";

export class CommandAdapterText implements CommandAdapter {
  read(text: string): BaseCommand | null {
    if (!text) {
      console.error("No text provided");
    }

    // TODO: parse string the right way

    let name: string = "";
    let payload: string | undefined;

    if (text.includes(" ")) {
      // payload
      name = text.split(" ")[0] || "";
      payload = text.slice(text.indexOf(" ")).trim();
      console.log("name", name, "payload", payload);
    } else {
      name = text;
      // no payload
      console.log("asdf");
    }

    name = name.toUpperCase();

    console.log(CommandStore);

    const commandStore = CommandStore.getInstance();

    const Command = commandStore.getCommand(name);

    if (!Command) {
      return null;
    }

    const command = new Command(payload);

    return command;
  }
}
