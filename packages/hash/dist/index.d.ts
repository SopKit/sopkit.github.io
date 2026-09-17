/**
 * @sopkit/hash — High-Performance Zero-Dependency Hashing Suite
 * Supporting SHA-256, SHA-512, SHA-1, MD5, and HMAC for Browser & Node.js
 */
/**
 * Converts a Uint8Array buffer into a lowercase hexadecimal string.
 */
declare function bufferToHex(buffer: Uint8Array): string;
/**
 * Converts a hexadecimal string into a Uint8Array buffer.
 */
declare function hexToBuffer(hex: string): Uint8Array;
/**
 * Computes SHA-256 hash using native Web Crypto API (or Node.js crypto fallback).
 * Returns lowercase hex string.
 */
declare function sha256(data: string | Uint8Array): Promise<string>;
/**
 * Computes SHA-512 hash using native Web Crypto API (or Node.js crypto fallback).
 */
declare function sha512(data: string | Uint8Array): Promise<string>;
/**
 * Computes SHA-1 hash using native Web Crypto API (or Node.js crypto fallback).
 */
declare function sha1(data: string | Uint8Array): Promise<string>;
/**
 * Computes HMAC-SHA256 authentication digest using Web Crypto API.
 */
declare function hmacSha256(key: string | Uint8Array, message: string | Uint8Array): Promise<string>;
/**
 * Constant-time hash comparison to prevent timing attacks.
 */
declare function compareHash(a: string, b: string): boolean;
/**
 * Computes MD5 hash synchronously.
 * Pure JavaScript, zero external dependencies, UTF-8 safe.
 */
declare function md5(data: string): string;

export { bufferToHex, compareHash, hexToBuffer, hmacSha256, md5, sha1, sha256, sha512 };
