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
  format: () => format,
  minify: () => minify,
  validate: () => validate
});
module.exports = __toCommonJS(index_exports);
function validate(xml) {
  if (typeof xml !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (xml.trim() === "") {
    return { valid: false, error: "Input cannot be empty" };
  }
  if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        return { valid: false, error: errorNode.textContent || "XML parsing error" };
      }
      return { valid: true };
    } catch (e) {
      return { valid: false, error: e.message || "XML parsing error" };
    }
  }
  try {
    const stack = [];
    const tagReg = /<(\/?[a-zA-Z0-9:_.-]+)(\s+[^>]*)?\/?>/g;
    let match;
    const cleanXml = xml.replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "").replace(/<\?xml[\s\S]*?\?>/g, "");
    let tagCount = 0;
    while ((match = tagReg.exec(cleanXml)) !== null) {
      const tag = match[1];
      const isClosing = tag.startsWith("/");
      const isSelfClosing = match[0].endsWith("/>") || tag.startsWith("?");
      if (isSelfClosing) continue;
      if (!isClosing) {
        tagCount++;
        stack.push(tag);
      } else {
        const opening = stack.pop();
        const expected = tag.slice(1);
        if (!opening || opening !== expected) {
          return { valid: false, error: `Mismatched closing tag: </${expected}>. Expected: </${opening || "none"}>` };
        }
      }
    }
    if (stack.length > 0) {
      return { valid: false, error: `Unclosed XML tags: ${stack.join(", ")}` };
    }
    if (tagCount === 0) {
      return { valid: false, error: "No XML elements found" };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
function format(xml, indentSize = 2) {
  const validation = validate(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  let cleanXml = xml.replace(/>\s*</g, "><").trim();
  let formatted = "";
  let pad = 0;
  const indent = " ".repeat(indentSize);
  cleanXml = cleanXml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3");
  const lines = cleanXml.split("\r\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let indentLevel = 0;
    if (line.match(/.+<\/\w[^>]*>$/)) {
      indentLevel = 0;
    } else if (line.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      indentLevel = 1;
    } else {
      indentLevel = 0;
    }
    const padding = indent.repeat(pad);
    formatted += padding + line + "\n";
    pad += indentLevel;
  }
  return formatted.trim();
}
function minify(xml) {
  const validation = validate(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  return xml.replace(/>\s*</g, "><").replace(/<!--[\s\S]*?-->/g, "").trim();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  format,
  minify,
  validate
});
//# sourceMappingURL=index.cjs.map