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
  isValid: () => isValid,
  slugify: () => slugify
});
module.exports = __toCommonJS(index_exports);
function slugify(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }
  const {
    separator = "-",
    lowercase = true,
    strict = true
  } = options;
  let str = text;
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lowercase) {
    str = str.toLowerCase();
  }
  if (strict) {
    str = str.replace(/[^a-z0-9\s-_]/gi, "");
  }
  str = str.trim().replace(/\s+/g, separator).replace(new RegExp(`\\${separator}+`, "g"), separator);
  if (str.startsWith(separator)) {
    str = str.slice(separator.length);
  }
  if (str.endsWith(separator)) {
    str = str.slice(0, -separator.length);
  }
  return str;
}
function isValid(slug, separator = "-") {
  if (typeof slug !== "string" || slug.trim() === "") {
    return false;
  }
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`^[a-z0-9]+(${escapedSeparator}[a-z0-9]+)*$`, "i");
  return regex.test(slug);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValid,
  slugify
});
//# sourceMappingURL=index.cjs.map