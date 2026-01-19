// could be a class
export function formatCommand(text: string): string;
export function formatCommand(text: string): Lowercase<string> {
  return text.toLocaleLowerCase() as Lowercase<string>;
}
// export function formatCommand(text: string): Uppercase<string> {
//   if (!text) return "";
//   return text.toLocaleUpperCase() as Uppercase<string>;
// }
