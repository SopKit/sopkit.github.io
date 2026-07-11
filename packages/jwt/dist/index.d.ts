/**
 * SopKit JWT Utilities
 * Premium, zero-dependency JWT (JSON Web Token) parser and format validator.
 * Link: https://sopkit.github.io/jwt-decoder/
 */
interface DecodedJWT {
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
/**
 * Verifies if the given string has a valid JWT structure (3 parts separated by dots).
 */
declare function verifyFormat(token: string): boolean;
/**
 * Decodes a JSON Web Token (JWT) returning its Header, Payload, and Signature.
 * Throws an error if the format is invalid.
 */
declare function decode(token: string): DecodedJWT;

export { type DecodedJWT, decode, verifyFormat };
