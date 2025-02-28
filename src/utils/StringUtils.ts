
/**
 * Trim all white spaces from a string i.e. "squash" the string
 * E.g. squashString("  hello world  ") => "helloworld"
 * @param input the string to squash
 * @returns the squashed string 
 */
export function squashString(input: string): string {
  return input.replace(/\s/g, "");
}