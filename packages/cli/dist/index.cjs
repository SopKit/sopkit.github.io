#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_prompts = __toESM(require("prompts"), 1);
var base64 = __toESM(require("@sopkit/base64"), 1);
var uuid = __toESM(require("@sopkit/uuid"), 1);
var slug = __toESM(require("@sopkit/slug"), 1);
var json = __toESM(require("@sopkit/json"), 1);
var color = __toESM(require("@sopkit/color"), 1);
var validator = __toESM(require("@sopkit/validator"), 1);
var password = __toESM(require("@sopkit/password"), 1);
async function main() {
  console.log("\n\u{1F680} Welcome to SopKit CLI \u2014 Interactive Developer Utilities");
  console.log("Website: https://sopkit.github.io/\n");
  const response = await (0, import_prompts.default)({
    type: "select",
    name: "utility",
    message: "Select a SopKit utility to run:",
    choices: [
      { title: "Base64 (Encode / Decode)", value: "base64" },
      { title: "UUID (Generate v4 or v1)", value: "uuid" },
      { title: "URL Slug (Generate URL-safe Slug)", value: "slug" },
      { title: "JSON (Beautify / Minify / Validate)", value: "json" },
      { title: "Color (HEX / RGB / HSL Conversion)", value: "color" },
      { title: "Validator (Email / URL / IP / Credit Card)", value: "validator" },
      { title: "Password (Generate / Strength Analyzer)", value: "password" },
      { title: "Exit", value: "exit" }
    ]
  });
  if (!response.utility || response.utility === "exit") {
    console.log("Goodbye!");
    process.exit(0);
  }
  switch (response.utility) {
    case "base64":
      await runBase64();
      break;
    case "uuid":
      await runUuid();
      break;
    case "slug":
      await runSlug();
      break;
    case "json":
      await runJson();
      break;
    case "color":
      await runColor();
      break;
    case "validator":
      await runValidator();
      break;
    case "password":
      await runPassword();
      break;
  }
}
async function runBase64() {
  const action = await (0, import_prompts.default)({
    type: "select",
    name: "type",
    message: "Select action:",
    choices: [
      { title: "Encode Text to Base64", value: "encode" },
      { title: "Decode Base64 to Text", value: "decode" },
      { title: "URL-Safe Encode", value: "urlEncode" },
      { title: "URL-Safe Decode", value: "urlDecode" }
    ]
  });
  if (!action.type) return;
  const input = await (0, import_prompts.default)({
    type: "text",
    name: "value",
    message: "Enter the text input:"
  });
  if (!input.value) return;
  try {
    let result = "";
    if (action.type === "encode") result = base64.encode(input.value);
    else if (action.type === "decode") result = base64.decode(input.value);
    else if (action.type === "urlEncode") result = base64.urlEncode(input.value);
    else if (action.type === "urlDecode") result = base64.urlDecode(input.value);
    console.log(`
\u2728 Result:
${result}
`);
  } catch (err) {
    console.error(`\u274C Error: ${err.message}`);
  }
}
async function runUuid() {
  const type = await (0, import_prompts.default)({
    type: "select",
    name: "version",
    message: "Select UUID version to generate:",
    choices: [
      { title: "UUID v4 (Randomly Generated)", value: "v4" },
      { title: "UUID v1 (Timestamp-Based)", value: "v1" }
    ]
  });
  if (!type.version) return;
  const count = await (0, import_prompts.default)({
    type: "number",
    name: "quantity",
    message: "How many UUIDs do you want to generate?",
    initial: 1,
    min: 1
  });
  const qty = count.quantity || 1;
  console.log(`
\u2728 Generated UUID(s):`);
  for (let i = 0; i < qty; i++) {
    const id = type.version === "v4" ? uuid.v4() : uuid.v1();
    console.log(id);
  }
  console.log();
}
async function runSlug() {
  const input = await (0, import_prompts.default)({
    type: "text",
    name: "value",
    message: "Enter the text to slugify:"
  });
  if (!input.value) return;
  const sep = await (0, import_prompts.default)({
    type: "text",
    name: "separator",
    message: "Enter separator character:",
    initial: "-"
  });
  const options = {
    separator: sep.separator || "-",
    lowercase: true
  };
  try {
    const result = slug.slugify(input.value, options);
    console.log(`
\u2728 Result:
${result}
`);
  } catch (err) {
    console.error(`\u274C Error: ${err.message}`);
  }
}
async function runJson() {
  const action = await (0, import_prompts.default)({
    type: "select",
    name: "type",
    message: "Select action:",
    choices: [
      { title: "Beautify / Format JSON", value: "format" },
      { title: "Minify JSON", value: "minify" },
      { title: "Validate JSON Syntax", value: "validate" }
    ]
  });
  if (!action.type) return;
  const input = await (0, import_prompts.default)({
    type: "text",
    name: "value",
    message: "Enter raw JSON string:"
  });
  if (!input.value) return;
  try {
    if (action.type === "format") {
      const result = json.format(input.value);
      console.log(`
\u2728 Result:
${result}
`);
    } else if (action.type === "minify") {
      const result = json.minify(input.value);
      console.log(`
\u2728 Result:
${result}
`);
    } else if (action.type === "validate") {
      const res = json.validate(input.value);
      if (res.valid) {
        console.log("\n\u2705 Valid JSON Syntax!\n");
      } else {
        console.log(`
\u274C Invalid JSON: ${res.error}`);
        if (res.line) console.log(`   Location: Line ${res.line}, Column ${res.column}
`);
      }
    }
  } catch (err) {
    console.error(`\u274C Error: ${err.message}`);
  }
}
async function runColor() {
  const action = await (0, import_prompts.default)({
    type: "select",
    name: "type",
    message: "Select conversion direction:",
    choices: [
      { title: "HEX to RGB & HSL", value: "hex" },
      { title: "RGB to HEX & HSL", value: "rgb" }
    ]
  });
  if (!action.type) return;
  if (action.type === "hex") {
    const input = await (0, import_prompts.default)({
      type: "text",
      name: "value",
      message: "Enter HEX color (e.g. #3b82f6 or 3b82f6):"
    });
    if (!input.value) return;
    try {
      const rgbVal = color.hexToRgb(input.value);
      const hslVal = color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      console.log(`
\u2728 Conversion Results:`);
      console.log(`   HEX: ${color.rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b)}`);
      console.log(`   RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      console.log(`   HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)
`);
    } catch (err) {
      console.error(`\u274C Error: ${err.message}`);
    }
  } else if (action.type === "rgb") {
    const rInput = await (0, import_prompts.default)({ type: "number", name: "r", message: "Enter Red component (0-255):", min: 0, max: 255 });
    const gInput = await (0, import_prompts.default)({ type: "number", name: "g", message: "Enter Green component (0-255):", min: 0, max: 255 });
    const bInput = await (0, import_prompts.default)({ type: "number", name: "b", message: "Enter Blue component (0-255):", min: 0, max: 255 });
    try {
      const r = rInput.r ?? 0;
      const g = gInput.g ?? 0;
      const b = bInput.b ?? 0;
      const hexVal = color.rgbToHex(r, g, b);
      const hslVal = color.rgbToHsl(r, g, b);
      console.log(`
\u2728 Conversion Results:`);
      console.log(`   HEX: ${hexVal}`);
      console.log(`   RGB: rgb(${r}, ${g}, ${b})`);
      console.log(`   HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)
`);
    } catch (err) {
      console.error(`\u274C Error: ${err.message}`);
    }
  }
}
async function runValidator() {
  const type = await (0, import_prompts.default)({
    type: "select",
    name: "field",
    message: "Select validation type:",
    choices: [
      { title: "Email Address", value: "email" },
      { title: "URL Link", value: "url" },
      { title: "Domain Name", value: "domain" },
      { title: "IP Address (IPv4 / IPv6)", value: "ip" },
      { title: "MAC Address", value: "mac" },
      { title: "Credit Card (Luhn check)", value: "creditCard" }
    ]
  });
  if (!type.field) return;
  const input = await (0, import_prompts.default)({
    type: "text",
    name: "value",
    message: `Enter value to validate:`
  });
  if (!input.value) return;
  let isValid = false;
  if (type.field === "email") isValid = validator.isEmail(input.value);
  else if (type.field === "url") isValid = validator.isUrl(input.value);
  else if (type.field === "domain") isValid = validator.isDomain(input.value);
  else if (type.field === "ip") isValid = validator.isIp(input.value);
  else if (type.field === "mac") isValid = validator.isMacAddress(input.value);
  else if (type.field === "creditCard") isValid = validator.isCreditCard(input.value);
  if (isValid) {
    console.log("\n\u2705 Valid Format!\n");
  } else {
    console.log("\n\u274C Invalid Format!\n");
  }
}
async function runPassword() {
  const action = await (0, import_prompts.default)({
    type: "select",
    name: "type",
    message: "Select action:",
    choices: [
      { title: "Generate Secure Password", value: "generate" },
      { title: "Analyze Password Strength", value: "analyze" }
    ]
  });
  if (!action.type) return;
  if (action.type === "generate") {
    const len = await (0, import_prompts.default)({
      type: "number",
      name: "length",
      message: "Password length:",
      initial: 16,
      min: 6,
      max: 64
    });
    try {
      const pass = password.generate({
        length: len.length || 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
      });
      console.log(`
\u2728 Generated Password:
${pass}
`);
    } catch (err) {
      console.error(`\u274C Error: ${err.message}`);
    }
  } else if (action.type === "analyze") {
    const input = await (0, import_prompts.default)({
      type: "text",
      name: "value",
      message: "Enter password to analyze:"
    });
    if (!input.value) return;
    const res = password.analyze(input.value);
    console.log(`
\u2728 Strength Analysis:`);
    console.log(`   Score: ${res.score}/4 (${res.label.toUpperCase()})`);
    console.log(`   Entropy: ${res.entropy} bits`);
    if (res.suggestions.length > 0) {
      console.log("   Suggestions:");
      res.suggestions.forEach((s) => console.log(`   - ${s}`));
    }
    console.log();
  }
}
main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
//# sourceMappingURL=index.cjs.map