/**
 * @file packages/cli/src/tools/json/index.ts
 * @description JSON formatter with TrueColor terminal syntax highlighting, minifier,
 * validator with precise line pointers, TypeScript generator, and dot-notation query.
 */

import { c } from "../../ui/theme.js";

/**
 * Validates a JSON string and returns error location details if invalid.
 */
export function validateJson(raw: string): { valid: boolean; error?: string; line?: number; column?: number; snippet?: string } {
  try {
    JSON.parse(raw);
    return { valid: true };
  } catch (err: any) {
    const msg = err.message || "Invalid JSON";
    const posMatch = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+line\s+(\d+)\s+column\s+(\d+)/i);

    let line = 1;
    let column = 1;

    if (posMatch && posMatch.length === 2) {
      const pos = parseInt(posMatch[1], 10);
      const lines = raw.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else if (posMatch && posMatch.length === 3) {
      line = parseInt(posMatch[1], 10);
      column = parseInt(posMatch[2], 10);
    }

    const allLines = raw.split("\n");
    const targetLine = allLines[line - 1] || "";
    const pointer = " ".repeat(Math.max(0, column - 1)) + "^";
    const snippet = `${targetLine}\n${c.red}${pointer}${c.reset}`;

    return {
      valid: false,
      error: msg,
      line,
      column,
      snippet,
    };
  }
}

/**
 * Minifies JSON string into ultra-compact representation.
 */
export function minifyJson(raw: string): string {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed);
}

/**
 * Formats JSON with customizable indent and ANSI TrueColor syntax highlighting.
 */
export function formatJsonHighlighted(raw: string, indent = 2): string {
  const parsed = JSON.parse(raw);
  const pretty = JSON.stringify(parsed, null, indent);

  // Apply TrueColor syntax highlighting for terminal output
  return pretty.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      // Key
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `${c.bold}${c.cyan}${match.slice(0, -1)}${c.reset}:`;
        }
        // String value
        return `${c.emerald}${match}${c.reset}`;
      }
      // Boolean
      if (/true|false/.test(match)) {
        return `${c.violet}${match}${c.reset}`;
      }
      // Null
      if (/null/.test(match)) {
        return `${c.dim}${match}${c.reset}`;
      }
      // Number
      return `${c.amber}${match}${c.reset}`;
    }
  );
}

/**
 * Converts a JSON string or object to a clean TypeScript interface definition.
 */
export function jsonToTypeScript(raw: string, interfaceName = "RootObject"): string {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const interfaces: string[] = [];

  function getType(val: any, key: string): string {
    if (val === null) return "null";
    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const innerType = getType(val[0], key);
      return `${innerType}[]`;
    }
    if (typeof val === "object") {
      const subName = key.charAt(0).toUpperCase() + key.slice(1);
      buildInterface(val, subName);
      return subName;
    }
    return typeof val;
  }

  function buildInterface(obj: Record<string, any>, name: string) {
    const lines: string[] = [`export interface ${name} {`];
    for (const [key, val] of Object.entries(obj)) {
      const type = getType(val, key);
      lines.push(`  ${key}: ${type};`);
    }
    lines.push("}");
    interfaces.push(lines.join("\n"));
  }

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    buildInterface(data, interfaceName);
  } else {
    interfaces.push(`export type ${interfaceName} = ${getType(data, "Item")};`);
  }

  return interfaces.reverse().join("\n\n");
}

/**
 * Queries JSON using simple dot notation (e.g. .users[0].name).
 */
export function queryJson(raw: string, queryPath: string): any {
  const data = JSON.parse(raw);
  const cleanPath = queryPath.replace(/^\./, "");
  if (!cleanPath) return data;

  const parts = cleanPath.split(/\.|\b(?=\[)/);
  let current = data;

  for (const part of parts) {
    if (part.startsWith("[") && part.endsWith("]")) {
      const idx = parseInt(part.slice(1, -1), 10);
      current = current?.[idx];
    } else if (part) {
      current = current?.[part];
    }
  }

  return current;
}
