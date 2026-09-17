/**
 * @file packages/cli/src/tools/case.ts
 * @description Universal text case converter for SopKit CLI.
 */

export function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-./\\]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function toCamelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
  );
}

export function toPascalCase(text: string): string {
  const words = splitWords(text);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export function toSnakeCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("_");
}

export function toKebabCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join("-");
}

export function toConstantCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toUpperCase())
    .join("_");
}

export function toTitleCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function toDotCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join(".");
}

export function convertAllCases(text: string) {
  return {
    camelCase: toCamelCase(text),
    pascalCase: toPascalCase(text),
    snakeCase: toSnakeCase(text),
    kebabCase: toKebabCase(text),
    constantCase: toConstantCase(text),
    titleCase: toTitleCase(text),
    dotCase: toDotCase(text),
  };
}
