import { BaseBoard } from "@board/board-base";
import { BaseCommand } from "@command/command-base";
import { CommandName } from "@command/command-name.decorator";
import { CommandStore } from "@command/command-store";
import { expect, it, vi } from "vitest";
import { CommandF1 } from "../concrete/command-f1";

const test1name = "TEST1";
@CommandName(test1name)
class CommandTest1 extends BaseCommand {
  description: string = "Some description";
  execOnBoard(_: BaseBoard): boolean {
    return true;
  }
}

const test2name = "TEST2";
@CommandName(test2name)
class CommandTest2 extends BaseCommand {
  description: string = "Some description";
  execOnBoard(_: BaseBoard): boolean {
    return true;
  }
}

class TestBoard extends BaseBoard {}

it("Runs Command F1 and show available commands", () => {
  const spy = vi.spyOn(console, "log");
  const commandStore = CommandStore.getInstance();
  commandStore.addCommandClass(test1name, CommandTest1);
  commandStore.addCommandClass(test2name, CommandTest2);

  const board = new TestBoard(5, 5);
  const f1command = new CommandF1();
  f1command.execOnBoard(board);

  expect(spy).toHaveBeenCalledWith("Commands available:");
  expect(spy).toHaveBeenCalledTimes(4);
});
