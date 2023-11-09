export function jsonParse<T = Record<string, any>>(str: string = ""): T | undefined {
  if (str === "") {
    return undefined;
  }

  try {
    return JSON.parse(str);
  } catch (err) {
    return undefined;
  }
}
