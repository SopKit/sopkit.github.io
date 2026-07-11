/**
 * SopKit JWT Utilities
 * Premium, zero-dependency JWT (JSON Web Token) parser and format validator.
 * Link: https://sopkit.github.io/jwt-decoder/
 */

export interface DecodedJWT {
  /**
   * The parsed header object containing metadata like 'alg' and 'typ'.
   */
  header: any;
  /**
   * The parsed payload object containing claims like 'sub', 'name', 'iat', 'exp'.
   */
  payload: any;
  /**
   * The raw cryptographic signature string.
   */
  signature: string;
}

// Internal helper for Unicode-safe Base64URL decoding
function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Verifies if the given string has a valid JWT structure (3 parts separated by dots).
 */
export function verifyFormat(token: string): boolean {
  if (typeof token !== "string") return false;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  
  // Base64URL characters regex check
  const base64UrlRegex = /^[A-Za-z0-9-_]+$/;
  return base64UrlRegex.test(parts[0]) && base64UrlRegex.test(parts[1]) && (parts[2] === "" || base64UrlRegex.test(parts[2]));
}

/**
 * Decodes a JSON Web Token (JWT) returning its Header, Payload, and Signature.
 * Throws an error if the format is invalid.
 */
export function decode(token: string): DecodedJWT {
  if (typeof token !== "string") {
    throw new TypeError("Token must be a string");
  }

  if (!verifyFormat(token)) {
    throw new Error("Invalid JWT token format");
  }

  const parts = token.trim().split(".");
  
  try {
    const headerJson = decodeBase64Url(parts[0]);
    const payloadJson = decodeBase64Url(parts[1]);

    return {
      header: JSON.parse(headerJson),
      payload: JSON.parse(payloadJson),
      signature: parts[2]
    };
  } catch (e: any) {
    throw new Error(`Failed to decode JWT payload: ${e.message}`);
  }
}
