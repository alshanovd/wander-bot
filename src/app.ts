import { BoardSingleBot } from "@board/concrete/board-single-bot";
import { CommandAdapterText } from "@format/concrete/command-adapter-text";
import { SourceTerminal } from "@source/concrete/source-terminal";

// init commands, better load them lazily
await import("./command/concrete/index");

export async function bootstrap(): Promise<void> {
  const commandAdapter = new CommandAdapterText();
  const board = new BoardSingleBot(5, 5);
  const source = new SourceTerminal();

  board.attachSource(source);
  await source.startStream(commandAdapter);
}

await bootstrap();
