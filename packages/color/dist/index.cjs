"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  hexToRgb: () => hexToRgb,
  hslToRgb: () => hslToRgb,
  rgbToHex: () => rgbToHex,
  rgbToHsl: () => rgbToHsl
});
module.exports = __toCommonJS(index_exports);
function hexToRgb(hex) {
  let cleanHex = hex.trim().replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((char) => char + char).join("");
  }
  if (cleanHex.length !== 6) {
    throw new Error(`Invalid HEX color format: ${hex}`);
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    throw new Error(`Invalid HEX color characters: ${hex}`);
  }
  return {
    r: num >> 16 & 255,
    g: num >> 8 & 255,
    b: num & 255
  };
}
function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const componentToHex = (c) => {
    const hex = clamp(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rgbToHsl(r, g, b) {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case normR:
        h = (normG - normB) / d + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / d + 2;
        break;
      case normB:
        h = (normR - normG) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
function hslToRgb(h, s, l) {
  const normH = h / 360;
  const normS = s / 100;
  const normL = l / 100;
  let r = normL;
  let g = normL;
  let b = normL;
  if (normS !== 0) {
    const hue2rgb = (p2, q2, t) => {
      let tempT = t;
      if (tempT < 0) tempT += 1;
      if (tempT > 1) tempT -= 1;
      if (tempT < 1 / 6) return p2 + (q2 - p2) * 6 * tempT;
      if (tempT < 1 / 2) return q2;
      if (tempT < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tempT) * 6;
      return p2;
    };
    const q = normL < 0.5 ? normL * (1 + normS) : normL + normS - normL * normS;
    const p = 2 * normL - q;
    r = hue2rgb(p, q, normH + 1 / 3);
    g = hue2rgb(p, q, normH);
    b = hue2rgb(p, q, normH - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl
});
//# sourceMappingURL=index.cjs.map