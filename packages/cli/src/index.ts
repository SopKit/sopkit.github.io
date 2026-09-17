/**
 * @file packages/cli/src/index.ts
 * @description World-class interactive CLI for SopKit developer utilities.
 * Supports 17+ high-performance developer tools directly in your terminal.
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

import * as timestamp from "./tools/timestamp";
import * as caseUtil from "./tools/case";
import * as lorem from "./tools/lorem";
import * as urlUtil from "./tools/url";
import * as bytesUtil from "./tools/bytes";
import * as httpUtil from "./tools/http";
import * as htmlUtil from "./tools/html";

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
      { title: "🕒  Timestamp / Epoch", value: "timestamp", desc: "Unix epoch, ISO, Relative time", tag: "DATE", shortcut: "4" },
      { title: "🔤  Text Case Converter", value: "case", desc: "camel, snake, kebab, CONSTANT", tag: "TEXT", shortcut: "5" },
      { title: "🔗  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "6" },
      { title: "🎨  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "7" },
      { title: "🛡️   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "8" },
      { title: "✨  JSON Formatter", value: "json", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "9" },
      { title: "📜  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "0" },
      { title: "🔒  Password Generator", value: "password", desc: "High-entropy password with visual meter", tag: "SECURITY", shortcut: "p" },
      { title: "📝  Lorem Ipsum Generator", value: "lorem", desc: "Generate words, sentences, paragraphs", tag: "MOCK", shortcut: "l" },
      { title: "🌐  URL Inspector & Parser", value: "url", desc: "Parse parameters, encode, decode", tag: "NET", shortcut: "u" },
      { title: "💾  Byte Size Converter", value: "bytes", desc: "B, KB, MB, GB, TB binary & decimal", tag: "DATA", shortcut: "b" },
      { title: "📡  HTTP Status Codes", value: "http", desc: "RFC codes 100-599 lookup & meaning", tag: "HTTP", shortcut: "h" },
      { title: "🔣  HTML Entity Escape", value: "html", desc: "Encode / decode HTML entities", tag: "HTML", shortcut: "e" },
      { title: "✅  Data Validator", value: "validator", desc: "Email, URL, IP, UUID, JSON", tag: "CHECK", shortcut: "v" },
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
      case "timestamp":
        await runTimestamp();
        break;
      case "case":
        await runCase();
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
      case "lorem":
        await runLorem();
        break;
      case "url":
        await runUrl();
        break;
      case "bytes":
        await runBytes();
        break;
      case "http":
        await runHttp();
        break;
      case "html":
        await runHtml();
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

async function runTimestamp() {
  const mode = await select("Timestamp / Epoch Operation:", [
    { title: "Current Epoch & Date (Now)", value: "now", tag: "NOW" },
    { title: "Convert Epoch to Human Date", value: "fromEpoch", tag: "CONVERT" },
    { title: "Convert Date String to Epoch", value: "toDate", tag: "PARSE" },
  ]);

  const t0 = performance.now();
  let info: timestamp.TimestampInfo;

  if (mode === "now") {
    info = timestamp.now();
  } else if (mode === "fromEpoch") {
    const epochInput = await promptText("Epoch timestamp (seconds or ms)", String(Math.floor(Date.now() / 1000)));
    if (!epochInput) return;
    info = timestamp.fromEpoch(epochInput);
  } else {
    const dateInput = await promptText("Date string (e.g. 2026-09-18T10:00:00Z)", new Date().toISOString());
    if (!dateInput) return;
    info = timestamp.fromDateString(dateInput);
  }

  const duration = (performance.now() - t0).toFixed(2);
  const rows = [
    `  ${c.muted}Epoch (Sec):${c.reset}    ${c.bold}${c.brightCyan}${info.seconds}${c.reset}`,
    `  ${c.muted}Epoch (Ms):${c.reset}     ${c.bold}${c.brightWhite}${info.milliseconds}${c.reset}`,
    `  ${c.muted}ISO 8601:${c.reset}       ${c.emerald}${info.iso}${c.reset}`,
    `  ${c.muted}UTC Date:${c.reset}       ${c.brightWhite}${info.utc}${c.reset}`,
    `  ${c.muted}Local Date:${c.reset}     ${c.brightWhite}${info.local}${c.reset}`,
    `  ${c.muted}Relative:${c.reset}       ${c.amber}${info.relative}${c.reset}`,
  ].join("\n");

  printCard("Timestamp & Epoch Breakdown", rows, `Resolved in ${duration}ms`, "DATETIME");
}

async function runCase() {
  const text = await promptText("Enter string to convert", "SopKit Developer Toolkit");
  if (!text) return;

  const t0 = performance.now();
  const all = caseUtil.convertAllCases(text);
  const duration = (performance.now() - t0).toFixed(2);

  const rows = [
    `  ${c.muted}camelCase:${c.reset}     ${c.bold}${c.brightCyan}${all.camelCase}${c.reset}`,
    `  ${c.muted}PascalCase:${c.reset}    ${c.bold}${c.emerald}${all.pascalCase}${c.reset}`,
    `  ${c.muted}snake_case:${c.reset}    ${c.bold}${c.amber}${all.snakeCase}${c.reset}`,
    `  ${c.muted}kebab-case:${c.reset}    ${c.bold}${c.rose}${all.kebabCase}${c.reset}`,
    `  ${c.muted}CONSTANT_CASE:${c.reset} ${c.bold}${c.purple}${all.constantCase}${c.reset}`,
    `  ${c.muted}Title Case:${c.reset}    ${c.brightWhite}${all.titleCase}${c.reset}`,
    `  ${c.muted}dot.case:${c.reset}      ${c.muted}${all.dotCase}${c.reset}`,
  ].join("\n");

  printCard("Text Case Conversions", rows, `Converted in ${duration}ms`, "STRING");
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

  printCard("URL Slug Generated", content, `Processed in ${duration}ms`, "SEO-SLUG");
}

async function runColor() {
  const hex = await promptText("Enter HEX color code", "#38bdf8");
  if (!hex) return;

  const t0 = performance.now();
  try {
    const rgbVal = color.hexToRgb(hex);
    const hslVal = color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    const duration = (performance.now() - t0).toFixed(2);

    printColorCard(hex, rgbVal, hslVal, duration);
  } catch (err: any) {
    console.log(`  ${c.red}Error:${c.reset} ${err.message}`);
  }
}

async function runJwt() {
  const token = await promptText("Paste JSON Web Token (JWT)");
  if (!token) return;

  const t0 = performance.now();
  try {
    const decoded = jwt.decode(token);
    const duration = (performance.now() - t0).toFixed(2);

    const headerStr = JSON.stringify(decoded.header, null, 2);
    const payloadStr = JSON.stringify(decoded.payload, null, 2);

    const content = [
      `  ${c.bold}${c.purple}HEADER:${c.reset}`,
      ...headerStr.split("\n").map((l) => `    ${c.muted}${l}${c.reset}`),
      ``,
      `  ${c.bold}${c.cyan}PAYLOAD:${c.reset}`,
      ...payloadStr.split("\n").map((l) => `    ${c.brightWhite}${l}${c.reset}`),
    ].join("\n");

    printCard("Decoded JWT Token", content, `Parsed in ${duration}ms`, "JWT-INSPECT");
  } catch (err: any) {
    console.log(`  ${c.red}Error parsing JWT:${c.reset} ${err.message}`);
  }
}

async function runJson() {
  const mode = await select("JSON Operation:", [
    { title: "Format & Beautify (2 spaces)", value: "format2", tag: "BEAUTIFY" },
    { title: "Format & Beautify (4 spaces)", value: "format4", tag: "BEAUTIFY" },
    { title: "Minify (Single-line)", value: "minify", tag: "MINIFY" },
    { title: "Validate JSON Syntax", value: "validate", tag: "VALIDATE" },
  ]);

  const raw = await promptText("Enter JSON string");
  if (!raw) return;

  const t0 = performance.now();
  try {
    let output = "";
    if (mode === "format2") output = json.format(raw, 2);
    else if (mode === "format4") output = json.format(raw, 4);
    else if (mode === "minify") output = json.minify(raw);
    else {
      const ok = json.validate(raw).valid;
      output = ok ? `${c.emerald}✔ JSON Syntax is Valid${c.reset}` : `${c.red}✖ Invalid JSON Syntax${c.reset}`;
    }

    const duration = (performance.now() - t0).toFixed(2);
    printCard("JSON Result", output, `Completed in ${duration}ms`, "JSON-ENGINE");
  } catch (err: any) {
    console.log(`  ${c.red}JSON Error:${c.reset} ${err.message}`);
  }
}

async function runXml() {
  const mode = await select("XML Operation:", [
    { title: "Format & Beautify (Indent)", value: "format", tag: "BEAUTIFY" },
    { title: "Minify XML", value: "minify", tag: "MINIFY" },
    { title: "Validate XML Syntax", value: "validate", tag: "VALIDATE" },
  ]);

  const raw = await promptText("Enter XML string");
  if (!raw) return;

  const t0 = performance.now();
  try {
    let output = "";
    if (mode === "format") output = xml.format(raw, 2);
    else if (mode === "minify") output = xml.minify(raw);
    else {
      const ok = xml.validate(raw).valid;
      output = ok ? `${c.emerald}✔ XML Syntax is Valid${c.reset}` : `${c.red}✖ Invalid XML Syntax${c.reset}`;
    }

    const duration = (performance.now() - t0).toFixed(2);
    printCard("XML Result", output, `Completed in ${duration}ms`, "XML-ENGINE");
  } catch (err: any) {
    console.log(`  ${c.red}XML Error:${c.reset} ${err.message}`);
  }
}

async function runPassword() {
  const lenStr = await promptText("Password Length", "20");
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 20, 8), 128);

  const t0 = performance.now();
  const pass = password.generate({ length, numbers: true, symbols: true, uppercase: true, lowercase: true });
  const strength = password.analyze(pass);
  const duration = (performance.now() - t0).toFixed(2);

  printPasswordCard(pass, length, strength.entropy, strength.score, duration);
}

async function runLorem() {
  const type = await select("Lorem Ipsum Type:", [
    { title: "Words", value: "words", tag: "WORDS" },
    { title: "Sentences", value: "sentences", tag: "SENTENCES" },
    { title: "Paragraphs", value: "paragraphs", tag: "PARAGRAPHS" },
  ]);

  const countStr = await promptText("Quantity", "3");
  const count = Math.min(Math.max(parseInt(countStr, 10) || 3, 1), 100);

  const t0 = performance.now();
  let result = "";
  if (type === "words") result = lorem.generateWords(count);
  else if (type === "sentences") {
    const list: string[] = [];
    for (let i = 0; i < count; i++) list.push(lorem.generateSentence());
    result = list.join(" ");
  } else {
    result = lorem.generateParagraphs(count);
  }

  const duration = (performance.now() - t0).toFixed(2);
  printCard(`Lorem Ipsum [${count} ${type.toUpperCase()}]`, result, `Generated in ${duration}ms`, "LOREM");
}

async function runUrl() {
  const mode = await select("URL Operation:", [
    { title: "Parse & Inspect URL", value: "parse", tag: "INSPECT" },
    { title: "URL Encode Component", value: "encode", tag: "ENCODE" },
    { title: "URL Decode Component", value: "decode", tag: "DECODE" },
  ]);

  const input = await promptText("Enter URL or text string", "https://sopkit.space/tools?cat=image&page=1#top");
  if (!input) return;

  const t0 = performance.now();
  if (mode === "parse") {
    try {
      const parsed = urlUtil.parseUrl(input);
      const duration = (performance.now() - t0).toFixed(2);

      const paramRows = Object.entries(parsed.params).map(
        ([k, v]) => `    ${c.cyan}${k}${c.reset}: ${c.brightWhite}${v}${c.reset}`
      );

      const rows = [
        `  ${c.muted}Origin:${c.reset}    ${c.bold}${c.brightWhite}${parsed.origin}${c.reset}`,
        `  ${c.muted}Protocol:${c.reset}  ${c.emerald}${parsed.protocol}${c.reset}`,
        `  ${c.muted}Host:${c.reset}      ${c.brightCyan}${parsed.host}${c.reset}`,
        `  ${c.muted}Pathname:${c.reset}  ${c.amber}${parsed.pathname}${c.reset}`,
        `  ${c.muted}Hash:${c.reset}      ${c.purple}${parsed.hash}${c.reset}`,
        `  ${c.muted}Params (${Object.keys(parsed.params).length}):${c.reset}`,
        ...(paramRows.length > 0 ? paramRows : [`    ${c.dim}(none)${c.reset}`]),
      ].join("\n");

      printCard("URL Breakdown", rows, `Parsed in ${duration}ms`, "URL-INSPECT");
    } catch (e: any) {
      console.log(`  ${c.red}Invalid URL:${c.reset} ${e.message}`);
    }
  } else if (mode === "encode") {
    const encoded = urlUtil.encodeUrl(input);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("URL Encoded", `${c.bold}${c.brightWhite}${encoded}${c.reset}`, `Encoded in ${duration}ms`, "URL-ENCODE");
  } else {
    const decoded = urlUtil.decodeUrl(input);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("URL Decoded", `${c.bold}${c.brightWhite}${decoded}${c.reset}`, `Decoded in ${duration}ms`, "URL-DECODE");
  }
}

async function runBytes() {
  const input = await promptText("Enter byte amount or size string (e.g. 1048576, 500MB, 2.5GB)", "1048576");
  if (!input) return;

  const t0 = performance.now();
  try {
    const bytes = bytesUtil.parseByteString(input);
    const b = bytesUtil.formatBytes(bytes);
    const duration = (performance.now() - t0).toFixed(2);

    const rows = [
      `  ${c.muted}Exact Bytes:${c.reset}     ${c.bold}${c.brightWhite}${b.bytes.toLocaleString()} B${c.reset}`,
      ``,
      `  ${c.bold}${c.cyan}BINARY (Base 1024 / IEC):${c.reset}`,
      `    KiB:  ${c.brightWhite}${b.binary.kib.toLocaleString()}${c.reset}`,
      `    MiB:  ${c.brightWhite}${b.binary.mib.toLocaleString()}${c.reset}`,
      `    GiB:  ${c.brightWhite}${b.binary.gib.toLocaleString()}${c.reset}`,
      `    Human: ${c.bold}${c.emerald}${b.binary.human}${c.reset}`,
      ``,
      `  ${c.bold}${c.purple}DECIMAL (Base 1000 / SI):${c.reset}`,
      `    KB:   ${c.brightWhite}${b.decimal.kb.toLocaleString()}${c.reset}`,
      `    MB:   ${c.brightWhite}${b.decimal.mb.toLocaleString()}${c.reset}`,
      `    GB:   ${c.brightWhite}${b.decimal.gb.toLocaleString()}${c.reset}`,
      `    Human: ${c.bold}${c.amber}${b.decimal.human}${c.reset}`,
    ].join("\n");

    printCard("Data Size Conversions", rows, `Computed in ${duration}ms`, "BYTES");
  } catch (e: any) {
    console.log(`  ${c.red}Error:${c.reset} ${e.message}`);
  }
}

async function runHttp() {
  const code = await promptText("HTTP Status Code to lookup", "404");
  if (!code) return;

  const t0 = performance.now();
  const info = httpUtil.lookupStatus(code);
  const duration = (performance.now() - t0).toFixed(2);

  if (!info) {
    console.log(`  ${c.red}Unknown HTTP Status Code:${c.reset} ${code}`);
    return;
  }

  const badgeColor =
    info.code < 300 ? c.emerald : info.code < 400 ? c.cyan : info.code < 500 ? c.amber : c.red;

  const rows = [
    `  ${c.muted}Status:${c.reset}       ${badgeColor}${c.bold}${info.code} ${info.phrase}${c.reset}`,
    `  ${c.muted}Class:${c.reset}        ${c.brightWhite}${info.category}${c.reset}`,
    `  ${c.muted}Description:${c.reset}  ${c.muted}${info.description}${c.reset}`,
  ].join("\n");

  printCard(`HTTP ${info.code}`, rows, `Retrieved in ${duration}ms`, "HTTP-STATUS");
}

async function runHtml() {
  const mode = await select("HTML Entity Operation:", [
    { title: "Escape HTML (encode <, >, &, \", ')", value: "escape", tag: "ESCAPE" },
    { title: "Unescape HTML (decode entities)", value: "unescape", tag: "UNESCAPE" },
  ]);

  const text = await promptText("Enter text string", `<div class="container">&copy; SopKit</div>`);
  if (!text) return;

  const t0 = performance.now();
  const res = mode === "escape" ? htmlUtil.escapeHtml(text) : htmlUtil.unescapeHtml(text);
  const duration = (performance.now() - t0).toFixed(2);

  printCard("HTML Entity Result", `${c.bold}${c.brightWhite}${res}${c.reset}`, `Executed in ${duration}ms`, "HTML");
}

async function runHash() {
  const algo = await select("Select Hash Algorithm:", [
    { title: "SHA-256 (Secure, 256-bit)", value: "sha256", tag: "DEFAULT" },
    { title: "SHA-512 (Ultra-Secure, 512-bit)", value: "sha512", tag: "HIGH-ENTROPY" },
    { title: "MD5 (Legacy Fingerprint)", value: "md5", tag: "CHECKSUM" },
    { title: "SHA-1 (Legacy Git Object)", value: "sha1", tag: "LEGACY" },
  ]);

  const text = await promptText("Enter text to hash");
  if (!text) return;

  const t0 = performance.now();
  let result = "";
  if (algo === "sha256") result = await hash.sha256(text);
  else if (algo === "sha512") result = await hash.sha512(text);
  else if (algo === "md5") result = await hash.md5(text);
  else if (algo === "sha1") result = await hash.sha1(text);

  const duration = (performance.now() - t0).toFixed(2);
  printCard(`Hash Output [${algo.toUpperCase()}]`, `${c.bold}${c.brightCyan}${result}${c.reset}`, `Generated in ${duration}ms`, "CRYPTO");
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
    ${c.cyan}sopkit${c.reset}                                    Launch interactive UI dashboard
    ${c.cyan}sopkit uuid${c.reset} [v4|v1] [count]               Generate UUID(s)
    ${c.cyan}sopkit timestamp${c.reset} [epoch|iso]                 Convert or inspect timestamp/epoch
    ${c.cyan}sopkit case${c.reset} <text>                         Convert string to camel, snake, kebab, CONSTANT
    ${c.cyan}sopkit lorem${c.reset} [count] [words|sentences]      Generate placeholder Lorem Ipsum
    ${c.cyan}sopkit base64${c.reset} <encode|decode> <text>        Base64 text encoder/decoder
    ${c.cyan}sopkit hash${c.reset} <sha256|sha512|md5> <txt>       Compute cryptographic hashes
    ${c.cyan}sopkit slug${c.reset} <text>                        Generate URL-safe slug
    ${c.cyan}sopkit password${c.reset} [length]                   Generate strong entropy password
    ${c.cyan}sopkit color${c.reset} <hex>                         Convert HEX, RGB, HSL with visual preview
    ${c.cyan}sopkit url${c.reset} <parse|encode|decode> <url>     Inspect or encode/decode URL
    ${c.cyan}sopkit bytes${c.reset} <size>                         Convert byte units (KB, MB, GB, TB)
    ${c.cyan}sopkit http${c.reset} <code>                          Lookup HTTP status code & RFC meaning
    ${c.cyan}sopkit html${c.reset} <escape|unescape> <str>        Escape/unescape HTML entities
    ${c.cyan}sopkit validator${c.reset} <email|url|ip> <val>       Validate string formats
`);
    return;
  }

  if (cmd === "--version" || cmd === "-v") {
    console.log("sopkit v1.1.0");
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

  if (cmd === "timestamp" || cmd === "epoch") {
    const arg = args[1];
    if (!arg || arg === "now") {
      const nowInfo = timestamp.now();
      console.log(`${nowInfo.seconds} (ms: ${nowInfo.milliseconds}) | ${nowInfo.iso}`);
    } else if (/^\d+$/.test(arg)) {
      const info = timestamp.fromEpoch(arg);
      console.log(`${info.iso} (${info.relative})`);
    } else {
      const info = timestamp.fromDateString(args.slice(1).join(" "));
      console.log(`Epoch: ${info.seconds} (ms: ${info.milliseconds}) | ${info.iso}`);
    }
    return;
  }

  if (cmd === "case" || cmd === "text") {
    const text = args.slice(1).join(" ");
    if (!text) {
      console.log(`${c.red}Error: Please provide text to convert.${c.reset}`);
      return;
    }
    const all = caseUtil.convertAllCases(text);
    console.log(`camelCase:     ${all.camelCase}`);
    console.log(`PascalCase:    ${all.pascalCase}`);
    console.log(`snake_case:    ${all.snakeCase}`);
    console.log(`kebab-case:    ${all.kebabCase}`);
    console.log(`CONSTANT_CASE: ${all.constantCase}`);
    return;
  }

  if (cmd === "lorem") {
    const count = parseInt(args[1] || "10", 10) || 10;
    const type = (args[2] || "words").toLowerCase();
    if (type.startsWith("par")) {
      console.log(lorem.generateParagraphs(count));
    } else if (type.startsWith("sen")) {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) sents.push(lorem.generateSentence());
      console.log(sents.join(" "));
    } else {
      console.log(lorem.generateWords(count));
    }
    return;
  }

  if (cmd === "url") {
    const sub = args[1]?.toLowerCase();
    const rest = args.slice(2).join(" ");
    if (sub === "encode") {
      console.log(urlUtil.encodeUrl(rest));
    } else if (sub === "decode") {
      console.log(urlUtil.decodeUrl(rest));
    } else {
      const target = rest || args[1] || "";
      const p = urlUtil.parseUrl(target);
      console.log(`Origin:   ${p.origin}`);
      console.log(`Path:     ${p.pathname}`);
      console.log(`Params:   ${JSON.stringify(p.params)}`);
    }
    return;
  }

  if (cmd === "bytes") {
    const raw = args.slice(1).join(" ");
    const b = bytesUtil.formatBytes(bytesUtil.parseByteString(raw));
    console.log(`Bytes: ${b.bytes.toLocaleString()} B | Binary: ${b.binary.human} | Decimal: ${b.decimal.human}`);
    return;
  }

  if (cmd === "http" || cmd === "status") {
    const code = args[1];
    const info = httpUtil.lookupStatus(code);
    if (!info) {
      console.log(`Unknown HTTP Status: ${code}`);
    } else {
      console.log(`${info.code} ${info.phrase} (${info.category}) - ${info.description}`);
    }
    return;
  }

  if (cmd === "html") {
    const sub = args[1]?.toLowerCase();
    const str = args.slice(2).join(" ");
    if (sub === "unescape" || sub === "decode") {
      console.log(htmlUtil.unescapeHtml(str));
    } else {
      console.log(htmlUtil.escapeHtml(str || args.slice(1).join(" ")));
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
      const swatch = process.stdout.isTTY ? `${bgRgb(rgbVal.r, rgbVal.g, rgbVal.b)}  ${c.reset} ` : "";
      console.log(`${swatch}HEX: ${col} | RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}) | HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    } catch (e: any) {
      console.error(e.message);
    }
    return;
  }

  if (cmd === "validator") {
    const type = (args[1] || "email").toLowerCase();
    const val = args[2] || "";
    let ok = false;
    if (type === "email") ok = validator.isEmail(val);
    else if (type === "url") ok = validator.isUrl(val);
    else if (type === "ip") ok = validator.isIp(val);
    console.log(ok ? "VALID" : "INVALID");
    return;
  }

  // Fallback
  console.log(`${c.red}Unknown command: ${cmd}${c.reset}. Run ${c.cyan}sopkit --help${c.reset} for options.`);
}

main().catch((err) => {
  console.error(`\n${c.red}Error:${c.reset} ${err.message}\n`);
  process.exit(1);
});
