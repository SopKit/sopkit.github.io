/**
 * SopKit Slug Utilities
 * Premium, zero-dependency multilingual URL slug generator.
 * Link: https://sopkit.github.io/slug-generator/
 */

export interface SlugOptions {
  /**
   * Character separator. Defaults to "-".
   */
  separator?: string;
  /**
   * Automatically convert slug to lowercase. Defaults to true.
   */
  lowercase?: boolean;
  /**
   * Strip non-alphanumeric characters. Defaults to true.
   */
  strict?: boolean;
}

/**
 * Generates a clean URL slug from the given text input.
 * Supports accent removal and basic character normalization.
 */
export function slugify(text: string, options: SlugOptions = {}): string {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }

  const {
    separator = "-",
    lowercase = true,
    strict = true
  } = options;

  let str = text;

  // 1. Normalize unicode characters (remove diacritics/accents)
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 2. Convert to lowercase if flag set
  if (lowercase) {
    str = str.toLowerCase();
  }

  // 3. Apply separator and remove invalid characters
  if (strict) {
    str = str.replace(/[^a-z0-9\s-_]/gi, "");
  }

  // 4. Replace whitespace and multiple separators
  str = str.trim()
    .replace(/\s+/g, separator)
    .replace(new RegExp(`\\${separator}+`, "g"), separator);

  // 5. Clean up leading or trailing separators
  if (str.startsWith(separator)) {
    str = str.slice(separator.length);
  }
  if (str.endsWith(separator)) {
    str = str.slice(0, -separator.length);
  }

  return str;
}

/**
 * Validates if a string is a valid URL slug (alphanumeric and dashes/underscores).
 */
export function isValid(slug: string, separator: string = "-"): boolean {
  if (typeof slug !== "string" || slug.trim() === "") {
    return false;
  }
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`^[a-z0-9]+(${escapedSeparator}[a-z0-9]+)*$`, "i");
  return regex.test(slug);
}
