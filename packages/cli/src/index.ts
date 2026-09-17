/**
 * @file packages/cli/src/index.ts
 * @description Beautiful interactive CLI for SopKit developer utilities.
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
import { printBanner, printCard, select, promptText, c } from "./ui";

async function main() {
  const args = process.argv.slice(2);

  // Fast direct flag execution if arguments passed
  if (args.length > 0) {
    await handleDirectCli(args);
    return;
  }

  // Interactive UI Mode
  printBanner();

  while (true) {
    const choice = await select("Choose a SopKit developer utility:", [
      { title: "🔑  Hash Generator", value: "hash", desc: "SHA-256, SHA-512, MD5, HMAC" },
      { title: "📦  Base64 Engine", value: "base64", desc: "Encode, Decode, URL-safe" },
      { title: "🆔  UUID Generator", value: "uuid", desc: "v4 Random, v1 Timestamp" },
      { title: "🔗  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs" },
      { title: "🎨  Color Converter", value: "color", desc: "HEX, RGB, HSL conversions" },
      { title: "🛡️   JWT Inspector", value: "jwt", desc: "Decode header & payload" },
      { title: "✨  JSON Formatter", value: "json", desc: "Beautify, Minify, Validate" },
      { title: "📜  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate" },
      { title: "🔒  Password Generator", value: "password", desc: "Strong entropy passwords" },
      { title: "✅  Data Validator", value: "validator", desc: "Email, URL, IP, UUID, JSON" },
      { title: "🚪  Exit", value: "exit" },
    ]);

    if (choice === "exit") {
      console.log(`\n${c.dim}Thank you for using SopKit CLI! Visit ${c.cyan}https://sopkit.space${c.dim} for 600+ web tools.${c.reset}\n`);
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
    { title: "Encode text to Base64", value: "encode" },
    { title: "Decode Base64 to text", value: "decode" },
    { title: "URL-Safe Base64 Encode", value: "urlEncode" },
    { title: "URL-Safe Base64 Decode", value: "urlDecode" },
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
  printCard("Base64 Output", result, `Executed in ${duration}ms`);
}

async function runUuid() {
  const version = await select("UUID Version:", [
    { title: "UUID v4 (Random Crypto)", value: "v4" },
    { title: "UUID v1 (Timestamp-Based)", value: "v1" },
  ]);

  const countStr = await promptText("Quantity", "1");
  const count = Math.min(Math.max(parseInt(countStr, 10) || 1, 1), 50);

  const t0 = performance.now();
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(version === "v4" ? uuid.v4() : uuid.v1());
  }

  const duration = (performance.now() - t0).toFixed(2);
  printCard(`Generated UUID(s) [${version.toUpperCase()}]`, uuids.join("\n"), `${count} generated in ${duration}ms`);
}

async function runSlug() {
  const text = await promptText("Text to slugify", "Hello World! This is SopKit");
  if (!text) return;

  const sep = await promptText("Separator", "-");
  const t0 = performance.now();
  const res = slug.slugify(text, { separator: sep, lowercase: true });
  const duration = (performance.now() - t0).toFixed(2);

  printCard("URL Slug", res, `Generated in ${duration}ms`);
}

async function runColor() {
  const input = await promptText("Enter HEX color", "#38bdf8");
  if (!input) return;

  const t0 = performance.now();
  try {
    const rgb = color.hexToRgb(input);
    const hsl = color.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const duration = (performance.now() - t0).toFixed(2);

    const output = [
      `HEX:  ${c.bold}${input.startsWith("#") ? input : "#" + input}${c.reset}`,
      `RGB:  ${c.bold}rgb(${rgb.r}, ${rgb.g}, ${rgb.b})${c.reset}`,
      `HSL:  ${c.bold}hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)${c.reset}`,
    ].join("\n");

    printCard("Color Conversion", output, `Converted in ${duration}ms`);
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

    const output = [
      `${c.bold}${c.brightCyan}Header:${c.reset}`,
      JSON.stringify(decoded.header, null, 2),
      ``,
      `${c.bold}${c.brightCyan}Payload:${c.reset}`,
      JSON.stringify(decoded.payload, null, 2),
    ].join("\n");

    printCard("JWT Decoded Details", output, `Decoded in ${duration}ms`);
  } catch (err: any) {
    printCard("Error", `${c.red}Failed to decode JWT: ${err.message}${c.reset}`);
  }
}

async function runHash() {
  const algo = await select("Select Hash Algorithm:", [
    { title: "SHA-256 (Industry standard)", value: "sha256" },
    { title: "SHA-512 (Maximum security)", value: "sha512" },
    { title: "SHA-1 (Legacy checksums)", value: "sha1" },
    { title: "MD5 (Legacy hash)", value: "md5" },
    { title: "HMAC SHA-256 (Keyed Hash)", value: "hmac" },
  ]);

  const text = await promptText("Input string to hash");
  if (!text) return;

  const t0 = performance.now();
  let result = "";
  if (algo === "sha256") result = await hash.sha256(text);
  else if (algo === "sha512") result = await hash.sha512(text);
  else if (algo === "sha1") result = await hash.sha1(text);
  else if (algo === "md5") result = await hash.md5(text);
  else if (algo === "hmac") {
    const key = await promptText("Secret HMAC key", "secret");
    result = await hash.hmacSha256(text, key);
  }

  const duration = (performance.now() - t0).toFixed(2);
  printCard(`${algo.toUpperCase()} Hash Output`, result, `Computed in ${duration}ms`);
}

async function runJson() {
  const mode = await select("JSON Operation:", [
    { title: "Beautify / Format (2 spaces)", value: "beautify" },
    { title: "Minify (Single line)", value: "minify" },
    { title: "Validate Syntax", value: "validate" },
  ]);

  const text = await promptText("Enter JSON string", '{"name":"SopKit","speed":"fast"}');
  if (!text) return;

  const t0 = performance.now();
  if (mode === "validate") {
    const res = json.validate(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("JSON Validation", res.valid ? `${c.green}✔ Valid JSON${c.reset}` : `${c.red}✖ Invalid JSON: ${res.error || "Syntax error"}${c.reset}`, `Validated in ${duration}ms`);
  } else if (mode === "beautify") {
    try {
      const res = json.format(text, 2);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Formatted JSON", res, `Formatted in ${duration}ms`);
    } catch (e: any) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  } else if (mode === "minify") {
    try {
      const res = json.minify(text);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Minified JSON", res, `Minified in ${duration}ms`);
    } catch (e: any) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  }
}

async function runXml() {
  const mode = await select("XML Operation:", [
    { title: "Beautify / Format", value: "beautify" },
    { title: "Minify", value: "minify" },
    { title: "Validate Syntax", value: "validate" },
  ]);

  const text = await promptText("Enter XML string", "<root><tool>SopKit</tool></root>");
  if (!text) return;

  const t0 = performance.now();
  if (mode === "validate") {
    const isValid = xml.validate(text).isValid;
    const duration = (performance.now() - t0).toFixed(2);
    printCard("XML Validation", isValid ? `${c.green}✔ Valid XML${c.reset}` : `${c.red}✖ Invalid XML${c.reset}`, `Validated in ${duration}ms`);
  } else if (mode === "beautify") {
    const res = xml.format(text, { indent: 2 });
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Formatted XML", res, `Formatted in ${duration}ms`);
  } else if (mode === "minify") {
    const res = xml.minify(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Minified XML", res, `Minified in ${duration}ms`);
  }
}

async function runPassword() {
  const lenStr = await promptText("Password length", "18");
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 18, 4), 128);

  const t0 = performance.now();
  const pass = password.generate({ length, numbers: true, symbols: true, uppercase: true, lowercase: true });
  const strength = password.analyze(pass);
  const duration = (performance.now() - t0).toFixed(2);

  const output = [
    `${c.bold}${c.brightGreen}${pass}${c.reset}`,
    ``,
    `Strength Score:  ${c.bold}${strength.score}/4${c.reset} (${strength.label})`,
    `Entropy:         ${c.bold}${strength.entropy} bits${c.reset}`,
  ].join("\n");

  printCard("Generated Secure Password", output, `Generated in ${duration}ms`);
}

async function runValidator() {
  const type = await select("Validator Type:", [
    { title: "Email Address", value: "email" },
    { title: "URL", value: "url" },
    { title: "Domain Name", value: "domain" },
    { title: "IP Address (IPv4 / IPv6)", value: "ip" },
    { title: "MAC Address", value: "mac" },
    { title: "UUID", value: "uuid" },
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
  printCard("Validation Result", ok ? `${c.green}✔ Valid ${type.toUpperCase()}${c.reset}` : `${c.red}✖ Invalid ${type.toUpperCase()}${c.reset}`, `Checked in ${duration}ms`);
}

async function handleDirectCli(args: string[]) {
  const cmd = args[0].toLowerCase();
  if (cmd === "--help" || cmd === "-h" || cmd === "help") {
    printBanner();
    console.log(`Usage:
  sopkit                           Launch interactive menu
  sopkit uuid [v4|v1] [count]      Generate UUID(s)
  sopkit base64 <encode|decode> <text>
  sopkit hash <sha256|sha512|md5> <text>
  sopkit slug <text>
  sopkit password [length]
  sopkit color <hex>
  sopkit validator <email|url|ip> <value>
`);
    return;
  }

  if (cmd === "--version" || cmd === "-v") {
    console.log("sopkit v1.0.1");
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
      const rgb = color.hexToRgb(col);
      const hsl = color.rgbToHsl(rgb.r, rgb.g, rgb.b);
      console.log(`HEX: ${col} | RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}) | HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
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
