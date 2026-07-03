/**
 * SopKit Base64 Utilities
 * Premium, zero-dependency Base64 encoder/decoder supporting Unicode and URL-safe formats.
 * Link: https://sopkit.github.io/base64-encode/
 */
/**
 * Encodes a string into standard Base64 representation.
 * Supports full UTF-8 Unicode characters.
 */
declare function encode(input: string): string;
/**
 * Decodes a standard Base64 string back into its original representation.
 * Supports full UTF-8 Unicode characters.
 */
declare function decode(input: string): string;
/**
 * Encodes a string into URL-safe Base64 representation.
 * Replaces '+' with '-', '/' with '_', and removes padding '='.
 */
declare function urlEncode(input: string): string;
/**
 * Decodes a URL-safe Base64 string back to its original representation.
 */
declare function urlDecode(input: string): string;
/**
 * Validates whether the given string is a valid Base64 string.
 */
declare function isValid(input: string): boolean;

export { decode, encode, isValid, urlDecode, urlEncode };
