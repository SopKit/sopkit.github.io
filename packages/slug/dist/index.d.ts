/**
 * SopKit Slug Utilities
 * Premium, zero-dependency multilingual URL slug generator.
 * Link: https://sopkit.github.io/slug-generator/
 */
interface SlugOptions {
    /**
     * Character separator. Defaults to "-".
     */
    separator?: string;
    /**
     * Automatically convert slug to lowercase. Defaults to true.
     */
    lowercase?: boolean;
    /**
     * Strip non-alphanumeric characters. Defaults to true.
     */
    strict?: boolean;
}
/**
 * Generates a clean URL slug from the given text input.
 * Supports accent removal and basic character normalization.
 */
declare function slugify(text: string, options?: SlugOptions): string;
/**
 * Validates if a string is a valid URL slug (alphanumeric and dashes/underscores).
 */
declare function isValid(slug: string, separator?: string): boolean;

export { type SlugOptions, isValid, slugify };
