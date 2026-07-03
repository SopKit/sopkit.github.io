/**
 * SopKit JSON Utilities
 * Premium, zero-dependency JSON utility for parsing, validating, formatting, and minification.
 * Link: https://sopkit.github.io/json-formatter/
 */

export interface FormatOptions {
  /**
   * Spacing size or indent character. Defaults to 2.
   */
  space?: number | string;
}

export interface ValidationResult {
  /**
   * Whether the input is valid JSON.
   */
  valid: boolean;
  /**
   * The parsed JavaScript object/array/value if valid.
   */
  data?: any;
  /**
   * Error message if validation failed.
   */
  error?: string;
  /**
   * Line number of the syntax error if validation failed.
   */
  line?: number;
  /**
   * Column number of the syntax error if validation failed.
   */
  column?: number;
}

/**
 * Validates a string to check if it's a valid JSON representation.
 * Returns a detailed ValidationResult object.
 */
export function validate(jsonStr: string): ValidationResult {
  if (typeof jsonStr !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (jsonStr.trim() === "") {
    return { valid: false, error: "Input string is empty" };
  }
  try {
    const data = JSON.parse(jsonStr);
    return { valid: true, data };
  } catch (e: any) {
    const message = e.message;
    let line = undefined;
    let column = undefined;

    const lineMatch = message.match(/line\s+(\d+)/i);
    const colMatch = message.match(/column\s+(\d+)/i);
    const posMatch = message.match(/position\s+(\d+)/i);

    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (colMatch) column = parseInt(colMatch[1], 10);

    if (posMatch && !line && !column) {
      const pos = parseInt(posMatch[1], 10);
      const linesBefore = jsonStr.slice(0, pos).split("\n");
      line = linesBefore.length;
      column = linesBefore[linesBefore.length - 1].length + 1;
    }

    return {
      valid: false,
      error: message,
      line,
      column
    };
  }
}

/**
 * Formats (beautifies) a JSON string with optional custom indentation.
 */
export function format(jsonStr: string, options: FormatOptions = {}): string {
  const { space = 2 } = options;
  const validation = validate(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data, null, space);
}

/**
 * Minifies a JSON string, stripping all whitespace and unnecessary formatting.
 */
export function minify(jsonStr: string): string {
  const validation = validate(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data);
}
