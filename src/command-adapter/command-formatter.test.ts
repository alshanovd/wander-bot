import { expect, it } from "vitest";
import { formatCommand } from "./command-formatter";

it("format command", () => {
  const commands = ["place", "move", "left", "right"];
  const expected = commands.map((c) => c.toUpperCase());

  const applied = commands.map((c) => formatCommand(c));

  expect(applied).toEqual(expected);
});
