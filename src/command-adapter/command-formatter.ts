// could be a class
export function formatCommand(text: string): string;
export function formatCommand(text: string): Uppercase<string> {
  if (!text) return "";
  return text.toLocaleUpperCase(text) as Uppercase<string>;
}
