/**
 * SopKit JSON Utilities
 * Premium, zero-dependency JSON utility for parsing, validating, formatting, and minification.
 * Link: https://sopkit.github.io/json-formatter/
 */
interface FormatOptions {
    /**
     * Spacing size or indent character. Defaults to 2.
     */
    space?: number | string;
}
interface ValidationResult {
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
declare function validate(jsonStr: string): ValidationResult;
/**
 * Formats (beautifies) a JSON string with optional custom indentation.
 */
declare function format(jsonStr: string, options?: FormatOptions): string;
/**
 * Minifies a JSON string, stripping all whitespace and unnecessary formatting.
 */
declare function minify(jsonStr: string): string;

export { type FormatOptions, type ValidationResult, format, minify, validate };
