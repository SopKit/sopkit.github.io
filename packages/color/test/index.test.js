import test from "node:test";
import assert from "node:assert";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "../dist/index.js";

test("Color Utilities - hexToRgb and rgbToHex", () => {
  // Hex to RGB
  assert.deepStrictEqual(hexToRgb("#ffffff"), { r: 255, g: 255, b: 255 });
  assert.deepStrictEqual(hexToRgb("#000000"), { r: 0, g: 0, b: 0 });
  assert.deepStrictEqual(hexToRgb("ff0000"), { r: 255, g: 0, b: 0 }); // shorthand without hash
  assert.deepStrictEqual(hexToRgb("#333"), { r: 51, g: 51, b: 51 }); // shorthand 3-char hex

  // RGB to Hex
  assert.strictEqual(rgbToHex(255, 255, 255), "#ffffff");
  assert.strictEqual(rgbToHex(0, 0, 0), "#000000");
  assert.strictEqual(rgbToHex(10, 15, 255), "#0a0fff");
});

test("Color Utilities - rgbToHsl and hslToRgb", () => {
  // RGB to HSL
  assert.deepStrictEqual(rgbToHsl(255, 255, 255), { h: 0, s: 0, l: 100 });
  assert.deepStrictEqual(rgbToHsl(0, 0, 0), { h: 0, s: 0, l: 0 });
  
  const redHsl = rgbToHsl(255, 0, 0);
  assert.strictEqual(redHsl.h, 0);
  assert.strictEqual(redHsl.s, 100);
  assert.strictEqual(redHsl.l, 50);

  // HSL to RGB
  assert.deepStrictEqual(hslToRgb(0, 0, 100), { r: 255, g: 255, b: 255 });
  assert.deepStrictEqual(hslToRgb(0, 0, 0), { r: 0, g: 0, b: 0 });
  assert.deepStrictEqual(hslToRgb(0, 100, 50), { r: 255, g: 0, b: 0 });
});
