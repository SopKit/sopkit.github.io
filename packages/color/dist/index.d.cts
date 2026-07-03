/**
 * SopKit Color Utilities
 * Premium, zero-dependency color converter supporting HEX, RGB, RGBA, and HSL formats.
 * Link: https://sopkit.github.io/color-converter/
 */
interface RGB {
    r: number;
    g: number;
    b: number;
}
interface RGBA extends RGB {
    a: number;
}
interface HSL {
    h: number;
    s: number;
    l: number;
}
/**
 * Converts a HEX color string to RGB.
 * Supports 3-digit and 6-digit HEX inputs (with or without # prefix).
 */
declare function hexToRgb(hex: string): RGB;
/**
 * Converts RGB components to a 6-digit HEX string prefixed with #.
 */
declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * Converts RGB components to HSL.
 */
declare function rgbToHsl(r: number, g: number, b: number): HSL;
/**
 * Converts HSL components to RGB.
 */
declare function hslToRgb(h: number, s: number, l: number): RGB;

export { type HSL, type RGB, type RGBA, hexToRgb, hslToRgb, rgbToHex, rgbToHsl };
