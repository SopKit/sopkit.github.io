/**
 * SopKit Base64 Utilities
 * Premium, zero-dependency Base64 encoder/decoder supporting Unicode and URL-safe formats.
 * Link: https://sopkit.github.io/base64-encode/
 */

/**
 * Encodes a string into standard Base64 representation.
 * Supports full UTF-8 Unicode characters.
 */
export function encode(input: string): string {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a standard Base64 string back into its original representation.
 * Supports full UTF-8 Unicode characters.
 */
export function decode(input: string): string {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e: any) {
    throw new Error(`Failed to decode Base64: ${e.message}`);
  }
}

/**
 * Encodes a string into URL-safe Base64 representation.
 * Replaces '+' with '-', '/' with '_', and removes padding '='.
 */
export function urlEncode(input: string): string {
  return encode(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodes a URL-safe Base64 string back to its original representation.
 */
export function urlDecode(input: string): string {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return decode(base64);
}

/**
 * Validates whether the given string is a valid Base64 string.
 */
export function isValid(input: string): boolean {
  if (typeof input !== "string" || input.trim() === "") {
    return false;
  }
  const base64Regex = /^[A-Za-z0-9+/_-]*={0,2}$/;
  if (!base64Regex.test(input)) {
    return false;
  }
  try {
    const sanitized = input.replace(/-/g, "+").replace(/_/g, "/");
    atob(sanitized);
    return true;
  } catch {
    return false;
  }
}
