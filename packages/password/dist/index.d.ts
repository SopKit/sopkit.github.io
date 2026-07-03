/**
 * SopKit Password Utilities
 * Premium, zero-dependency password generator and strength analyzer.
 * Link: https://sopkit.github.io/password-generator/
 */
interface GeneratorOptions {
    length?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
}
interface StrengthResult {
    score: number;
    label: "very-weak" | "weak" | "moderate" | "strong" | "very-strong";
    entropy: number;
    suggestions: string[];
}
/**
 * Generates a random secure password based on options.
 */
declare function generate(options?: GeneratorOptions): string;
/**
 * Evaluates the strength of a given password.
 */
declare function analyze(password: string): StrengthResult;

export { type GeneratorOptions, type StrengthResult, analyze, generate };
