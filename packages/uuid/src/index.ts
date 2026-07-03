/**
 * SopKit UUID Utilities
 * Premium, zero-dependency UUID (Universally Unique Identifier) generator and validator.
 * Link: https://sopkit.github.io/uuid-generator/
 */

/**
 * Generates a cryptographically secure UUID v4 (Random).
 * Falls back to Math.random() if crypto API is unavailable.
 */
export function v4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: number) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }

  // Math.random fallback (for non-secure/legacy environments)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a timestamp-based UUID v1.
 */
export function v1(): string {
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates whether the given string is a valid UUID.
 */
export function validate(uuid: string): boolean {
  if (typeof uuid !== "string") {
    return false;
  }
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Detects the version of the given UUID.
 * Returns the version number (1-5) or null if invalid.
 */
export function getVersion(uuid: string): number | null {
  if (!validate(uuid)) {
    return null;
  }
  return parseInt(uuid.charAt(14), 10);
}
