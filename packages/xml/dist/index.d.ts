/**
 * SopKit XML Utilities
 * Premium, zero-dependency XML parser, formatter, validator, and minifier.
 * Link: https://sopkit.github.io/xml-formatter/
 */
interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates whether the given string is a valid XML representation.
 * Supports DOMParser in browsers and falling back to a structured tag checker in Node.js.
 */
declare function validate(xml: string): ValidationResult;
/**
 * Formats (beautifies) an XML string with customizable indentation.
 */
declare function format(xml: string, indentSize?: number): string;
/**
 * Minifies an XML string by stripping spaces between tags and comments.
 */
declare function minify(xml: string): string;

export { type ValidationResult, format, minify, validate };
