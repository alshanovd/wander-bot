export function formatCommand(text: string): string;
export function formatCommand(text: string): Uppercase<string> {
  if (!text) return "";
  return text.toLocaleUpperCase() as Uppercase<string>;
}

// could be a class
