/**
 * SopKit UUID Utilities
 * Premium, zero-dependency UUID (Universally Unique Identifier) generator and validator.
 * Link: https://sopkit.github.io/uuid-generator/
 */
/**
 * Generates a cryptographically secure UUID v4 (Random).
 * Falls back to Math.random() if crypto API is unavailable.
 */
declare function v4(): string;
/**
 * Generates a timestamp-based UUID v1.
 */
declare function v1(): string;
/**
 * Validates whether the given string is a valid UUID.
 */
declare function validate(uuid: string): boolean;
/**
 * Detects the version of the given UUID.
 * Returns the version number (1-5) or null if invalid.
 */
declare function getVersion(uuid: string): number | null;

export { getVersion, v1, v4, validate };
