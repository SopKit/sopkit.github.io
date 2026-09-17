/**
 * @file packages/cli/src/index.ts
 * @description World-class interactive CLI for SopKit developer utilities.
 */

import * as base64 from "../../base64/src/index";
import * as uuid from "../../uuid/src/index";
import * as slug from "../../slug/src/index";
import * as json from "../../json/src/index";
import * as color from "../../color/src/index";
import * as validator from "../../validator/src/index";
import * as password from "../../password/src/index";
import * as xml from "../../xml/src/index";
import * as jwt from "../../jwt/src/index";
import * as hash from "../../hash/src/index";
import {
  printBanner,
  printCard,
  printColorCard,
  printPasswordCard,
  select,
  promptText,
  c,
  bgRgb,
} from "./ui";

async function main() {
  const args = process.argv.slice(2);

  // Direct CLI command handling
  if (args.length > 0) {
    await handleDirectCli(args);
    return;
  }

  // Interactive UI Mode
  printBanner();

  while (true) {
    const choice = await select("Choose a SopKit developer utility:", [
      { title: "🔑  Hash Generator", value: "hash", desc: "SHA-256, SHA-512, MD5, HMAC", tag: "CRYPTO", shortcut: "1" },
      { title: "📦  Base64 Engine", value: "base64", desc: "Encode, Decode, URL-safe", tag: "ENCODE", shortcut: "2" },
      { title: "🆔  UUID Generator", value: "uuid", desc: "v4 Random, v1 Timestamp", tag: "IDENT", shortcut: "3" },
      { title: "🔗  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "4" },
      { title: "🎨  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "5" },
      { title: "🛡️   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "6" },
      { title: "✨  JSON Formatter", value: "json", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "7" },
      { title: "📜  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "8" },
      { title: "🔒  Password Generator", value: "password", desc: "High-entropy password with visual meter", tag: "SECURITY", shortcut: "9" },
      { title: "✅  Data Validator", value: "validator", desc: "Email, URL, IP, UUID, JSON", tag: "CHECK", shortcut: "0" },
      { title: "🚪  Exit", value: "exit", desc: "Return to shell", shortcut: "q" },
    ]);

    if (choice === "exit") {
      console.log(`\n  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for 600+ web tools.${c.reset}\n`);
      process.exit(0);
    }

    switch (choice) {
      case "hash":
        await runHash();
        break;
      case "base64":
        await runBase64();
        break;
      case "uuid":
        await runUuid();
        break;
      case "slug":
        await runSlug();
        break;
      case "color":
        await runColor();
        break;
      case "jwt":
        await runJwt();
        break;
      case "json":
        await runJson();
        break;
      case "xml":
        await runXml();
        break;
      case "password":
        await runPassword();
        break;
      case "validator":
        await runValidator();
        break;
    }
  }
}

async function runBase64() {
  const mode = await select("Base64 Operation:", [
    { title: "Encode text to Base64", value: "encode", tag: "ENCODE" },
    { title: "Decode Base64 to text", value: "decode", tag: "DECODE" },
    { title: "URL-Safe Base64 Encode", value: "urlEncode", tag: "URL-SAFE" },
    { title: "URL-Safe Base64 Decode", value: "urlDecode", tag: "URL-SAFE" },
  ]);

  const text = await promptText("Input text");
  if (!text) return;

  const t0 = performance.now();
  let result = "";
  if (mode === "encode") result = base64.encode(text);
  else if (mode === "decode") result = base64.decode(text);
  else if (mode === "urlEncode") result = base64.urlEncode(text);
  else if (mode === "urlDecode") result = base64.urlDecode(text);

  const duration = (performance.now() - t0).toFixed(2);
  printCard("Base64 Output", `${c.bold}${c.brightWhite}${result}${c.reset}`, `Executed in ${duration}ms`, "BASE64");
}

async function runUuid() {
  const version = await select("UUID Version:", [
    { title: "UUID v4 (Cryptographic Random)", value: "v4", tag: "RFC 4122" },
    { title: "UUID v1 (Timestamp-Based)", value: "v1", tag: "RFC 4122" },
  ]);

  const countStr = await promptText("Quantity", "1");
  const count = Math.min(Math.max(parseInt(countStr, 10) || 1, 1), 50);

  const t0 = performance.now();
  const rows: string[] = [];
  for (let i = 0; i < count; i++) {
    const val = version === "v1" ? uuid.v1() : uuid.v4();
    const idxBadge = `${c.dim}[${c.reset}${c.cyan}${String(i + 1).padStart(2, "0")}${c.dim}]${c.reset}`;
    rows.push(`  ${idxBadge}  ${c.bold}${c.brightWhite}${val}${c.reset}`);
  }

  const duration = (performance.now() - t0).toFixed(2);
  printCard(`Generated UUID(s) [${version.toUpperCase()}]`, rows.join("\n"), `${count} generated in ${duration}ms`, "IDENTIFIER");
}

async function runSlug() {
  const text = await promptText("Text to slugify", "Love Calculator Story");
  if (!text) return;

  const sep = await promptText("Separator", "-");
  const t0 = performance.now();
  const res = slug.slugify(text, { separator: sep, lowercase: true });
  const duration = (performance.now() - t0).toFixed(2);

  const content = [
    `  ${c.muted}Input:${c.reset}   ${c.brightWhite}${text}${c.reset}`,
    `  ${c.muted}Slug:${c.reset}    ${c.bold}${c.emerald}${res}${c.reset}`,
  ].join("\n");

  printCard("URL Slug Output", content, `Generated in ${duration}ms`, "SEO");
}

async function runColor() {
  const input = await promptText("Enter HEX / CSS color", "#ff3366");
  if (!input) return;

  try {
    const rgbVal = color.hexToRgb(input);
    const hslVal = color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    const hexClean = input.startsWith("#") ? input : `#${input}`;
    const rgbStr = `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`;
    const hslStr = `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`;

    printColorCard(hexClean, rgbStr, hslStr, rgbVal.r, rgbVal.g, rgbVal.b);
  } catch (e: any) {
    printCard("Error", `${c.red}${e.message}${c.reset}`);
  }
}

async function runJwt() {
  const token = await promptText("Paste JWT Token");
  if (!token) return;

  const t0 = performance.now();
  try {
    const decoded = jwt.decode(token);
    const duration = (performance.now() - t0).toFixed(2);

    const parts = [
      `  ${c.bold}${c.violet}Algorithm & Header:${c.reset}`,
      `  ${JSON.stringify(decoded.header, null, 2).split("\n").join("\n  ")}`,
      ``,
      `  ${c.bold}${c.cyan}Claims & Payload:${c.reset}`,
      `  ${JSON.stringify(decoded.payload, null, 2).split("\n").join("\n  ")}`,
    ];

    printCard("Decoded JWT Details", parts.join("\n"), `Decoded in ${duration}ms`, "AUTH");
  } catch (err: any) {
    printCard("Error", `${c.red}Failed to decode JWT: ${err.message}${c.reset}`);
  }
}

async function runHash() {
  const algo = await select("Select Hash Algorithm:", [
    { title: "SHA-256 (Industry standard)", value: "sha256", tag: "SECURE" },
    { title: "SHA-512 (Maximum bit security)", value: "sha512", tag: "MAX" },
    { title: "HMAC SHA-256 (Keyed Hash)", value: "hmac", tag: "HMAC" },
    { title: "SHA-1 (Legacy checksum)", value: "sha1", tag: "LEGACY" },
    { title: "MD5 (Legacy digest)", value: "md5", tag: "LEGACY" },
  ]);

  const text = await promptText("Input string to hash", "secret");
  if (!text) return;

  const t0 = performance.now();
  let result = "";
  if (algo === "sha256") result = await hash.sha256(text);
  else if (algo === "sha512") result = await hash.sha512(text);
  else if (algo === "sha1") result = await hash.sha1(text);
  else if (algo === "md5") result = await hash.md5(text);
  else if (algo === "hmac") {
    const key = await promptText("Secret HMAC key", "sopkit-secret");
    result = await hash.hmacSha256(text, key);
  }

  const duration = (performance.now() - t0).toFixed(2);
  const content = [
    `  ${c.muted}Input:${c.reset}   ${c.brightWhite}${text}${c.reset}`,
    `  ${c.muted}Digest:${c.reset}  ${c.bold}${c.cyan}${result}${c.reset}`,
  ].join("\n");

  printCard(`${algo.toUpperCase()} Hash Output`, content, `Computed in ${duration}ms`, "CRYPTO");
}

async function runJson() {
  const mode = await select("JSON Operation:", [
    { title: "Beautify / Format (2 spaces)", value: "beautify", tag: "FORMAT" },
    { title: "Minify (Single line)", value: "minify", tag: "MINIFY" },
    { title: "Validate Syntax", value: "validate", tag: "CHECK" },
  ]);

  const text = await promptText("Enter JSON string", '{"name":"SopKit","speed":"instant"}');
  if (!text) return;

  const t0 = performance.now();
  if (mode === "validate") {
    const res = json.validate(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard(
      "JSON Validation",
      res.valid ? `  ${c.emerald}✔ Valid JSON Syntax${c.reset}` : `  ${c.red}✖ Invalid JSON: ${res.error}${c.reset}`,
      `Validated in ${duration}ms`,
      "JSON"
    );
  } else if (mode === "beautify") {
    try {
      const res = json.format(text, 2);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Formatted JSON", res, `Formatted in ${duration}ms`, "JSON");
    } catch (e: any) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  } else if (mode === "minify") {
    try {
      const res = json.minify(text);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Minified JSON", `${c.cyan}${res}${c.reset}`, `Minified in ${duration}ms`, "JSON");
    } catch (e: any) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  }
}

async function runXml() {
  const mode = await select("XML Operation:", [
    { title: "Beautify / Format", value: "beautify", tag: "FORMAT" },
    { title: "Minify", value: "minify", tag: "MINIFY" },
    { title: "Validate Syntax", value: "validate", tag: "CHECK" },
  ]);

  const text = await promptText("Enter XML string", "<root><tool>SopKit</tool></root>");
  if (!text) return;

  const t0 = performance.now();
  if (mode === "validate") {
    const isValid = xml.validate(text).isValid;
    const duration = (performance.now() - t0).toFixed(2);
    printCard(
      "XML Validation",
      isValid ? `  ${c.emerald}✔ Valid XML Document${c.reset}` : `  ${c.red}✖ Invalid XML${c.reset}`,
      `Validated in ${duration}ms`,
      "XML"
    );
  } else if (mode === "beautify") {
    const res = xml.format(text, { indent: 2 });
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Formatted XML", res, `Formatted in ${duration}ms`, "XML");
  } else if (mode === "minify") {
    const res = xml.minify(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Minified XML", `${c.cyan}${res}${c.reset}`, `Minified in ${duration}ms`, "XML");
  }
}

async function runPassword() {
  const lenStr = await promptText("Password length", "24");
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 24, 4), 128);

  const t0 = performance.now();
  const pass = password.generate({ length, numbers: true, symbols: true, uppercase: true, lowercase: true });
  const strength = password.analyze(pass);
  const duration = (performance.now() - t0).toFixed(2);

  printPasswordCard(pass, length, strength.entropy, strength.score, duration);
}

async function runValidator() {
  const type = await select("Validator Type:", [
    { title: "Email Address", value: "email", tag: "EMAIL" },
    { title: "URL (HTTP / HTTPS)", value: "url", tag: "URL" },
    { title: "Domain Name", value: "domain", tag: "DNS" },
    { title: "IP Address (IPv4 / IPv6)", value: "ip", tag: "NET" },
    { title: "MAC Address", value: "mac", tag: "HARDWARE" },
    { title: "UUID", value: "uuid", tag: "UUID" },
  ]);

  const val = await promptText("Enter value to validate");
  if (!val) return;

  const t0 = performance.now();
  let ok = false;
  if (type === "email") ok = validator.isEmail(val);
  else if (type === "url") ok = validator.isUrl(val);
  else if (type === "domain") ok = validator.isDomain(val);
  else if (type === "ip") ok = validator.isIp(val);
  else if (type === "mac") ok = validator.isMacAddress(val);
  else if (type === "uuid") ok = uuid.validate(val);

  const duration = (performance.now() - t0).toFixed(2);
  const content = ok
    ? `  ${c.emerald}${c.bold}✔ VALID${c.reset}  ${c.brightWhite}${val}${c.reset}`
    : `  ${c.red}${c.bold}✖ INVALID${c.reset}  ${c.brightWhite}${val}${c.reset}`;

  printCard(`Validation Result [${type.toUpperCase()}]`, content, `Checked in ${duration}ms`, "VALIDATE");
}

async function handleDirectCli(args: string[]) {
  const cmd = args[0].toLowerCase();
  if (cmd === "--help" || cmd === "-h" || cmd === "help") {
    printBanner();
    console.log(`  ${c.bold}${c.brightWhite}Usage:${c.reset}
    ${c.cyan}sopkit${c.reset}                              Launch world-class interactive UI dashboard
    ${c.cyan}sopkit uuid${c.reset} [v4|v1] [count]         Generate UUID(s)
    ${c.cyan}sopkit base64${c.reset} <encode|decode> <text>  Base64 text encoder/decoder
    ${c.cyan}sopkit hash${c.reset} <sha256|sha512|md5> <txt> Compute cryptographic hashes
    ${c.cyan}sopkit slug${c.reset} <text>                  Generate URL-safe slug
    ${c.cyan}sopkit password${c.reset} [length]             Generate strong entropy password
    ${c.cyan}sopkit color${c.reset} <hex>                   Convert HEX, RGB, HSL with visual preview
    ${c.cyan}sopkit validator${c.reset} <email|url|ip> <val> Validate string formats
`);
    return;
  }

  if (cmd === "--version" || cmd === "-v") {
    console.log("sopkit v1.0.2");
    return;
  }

  if (cmd === "uuid") {
    const ver = (args[1] || "v4").toLowerCase();
    const count = parseInt(args[2] || "1", 10) || 1;
    for (let i = 0; i < count; i++) {
      console.log(ver === "v1" ? uuid.v1() : uuid.v4());
    }
    return;
  }

  if (cmd === "base64") {
    const action = args[1]?.toLowerCase();
    const text = args.slice(2).join(" ");
    if (action === "decode") console.log(base64.decode(text));
    else console.log(base64.encode(text));
    return;
  }

  if (cmd === "hash") {
    const algo = args[1]?.toLowerCase() || "sha256";
    const text = args.slice(2).join(" ");
    if (algo === "sha512") console.log(await hash.sha512(text));
    else if (algo === "md5") console.log(await hash.md5(text));
    else if (algo === "sha1") console.log(await hash.sha1(text));
    else console.log(await hash.sha256(text));
    return;
  }

  if (cmd === "slug") {
    console.log(slug.slugify(args.slice(1).join(" ")));
    return;
  }

  if (cmd === "password") {
    const len = parseInt(args[1] || "18", 10) || 18;
    console.log(password.generate({ length: len }));
    return;
  }

  if (cmd === "color") {
    const col = args[1] || "#38bdf8";
    try {
      const rgbVal = color.hexToRgb(col);
      const hslVal = color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      // Pretty print with color swatch if in terminal
      const swatch = process.stdout.isTTY ? `${bgRgb(rgbVal.r, rgbVal.g, rgbVal.b)}  ${c.reset} ` : "";
      console.log(`${swatch}HEX: ${col} | RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}) | HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    } catch (e: any) {
      console.error(e.message);
    }
    return;
  }

  // Fallback
  console.log(`${c.red}Unknown command: ${cmd}${c.reset}. Run ${c.cyan}sopkit --help${c.reset} for options.`);
}

main().catch((err) => {
  console.error(`\n${c.red}Error:${c.reset} ${err.message}\n`);
  process.exit(1);
});
