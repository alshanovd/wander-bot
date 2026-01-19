import { BoardSingleBot } from "@board/concrete/board-single-bot";
import { SourceTerminal } from "@source/concrete/source-terminal";
import { CommandAdapterText } from "./command-adapter/concrete/command-adapter-text";

// init commands, better load them lazily
await import("./command/concrete");

export async function bootstrap(): Promise<void> {
  const commandAdapter = new CommandAdapterText();
  const board = new BoardSingleBot(5, 5);
  const source = new SourceTerminal();
  board.attachSource(source);
  await source.startStream(commandAdapter);
}
