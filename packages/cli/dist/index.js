#!/usr/bin/env node

// ../base64/src/index.ts
function encode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function decode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    throw new Error(`Failed to decode Base64: ${e.message}`);
  }
}
function urlEncode(input) {
  return encode(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function urlDecode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return decode(base64);
}

// ../uuid/src/index.ts
function v4() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return ("10000000-1000-4000-8000" + -1e11).replace(
      /[018]/g,
      (c2) => (c2 ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c2 / 4).toString(16)
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c2) => {
    const r = Math.random() * 16 | 0;
    const v = c2 === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function v1() {
  let d = (/* @__PURE__ */ new Date()).getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c2) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    const v = c2 === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function validate(uuid) {
  if (typeof uuid !== "string") {
    return false;
  }
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

// ../slug/src/index.ts
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

// ../json/src/index.ts
function validate2(jsonStr) {
  if (typeof jsonStr !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (jsonStr.trim() === "") {
    return { valid: false, error: "Input string is empty" };
  }
  try {
    const data = JSON.parse(jsonStr);
    return { valid: true, data };
  } catch (e) {
    const message = e.message;
    let line = void 0;
    let column = void 0;
    const lineMatch = message.match(/line\s+(\d+)/i);
    const colMatch = message.match(/column\s+(\d+)/i);
    const posMatch = message.match(/position\s+(\d+)/i);
    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (colMatch) column = parseInt(colMatch[1], 10);
    if (posMatch && !line && !column) {
      const pos = parseInt(posMatch[1], 10);
      const linesBefore = jsonStr.slice(0, pos).split("\n");
      line = linesBefore.length;
      column = linesBefore[linesBefore.length - 1].length + 1;
    }
    return {
      valid: false,
      error: message,
      line,
      column
    };
  }
}
function format(jsonStr, options = {}) {
  const { space = 2 } = options;
  const validation = validate2(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data, null, space);
}
function minify(jsonStr) {
  const validation = validate2(jsonStr);
  if (!validation.valid) {
    throw new Error(`Invalid JSON: ${validation.error}`);
  }
  return JSON.stringify(validation.data);
}

// ../color/src/index.ts
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

// ../validator/src/index.ts
function isEmail(email) {
  if (typeof email !== "string") return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
}
function isUrl(url) {
  if (typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function isDomain(domain) {
  if (typeof domain !== "string") return false;
  const regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return regex.test(domain);
}
function isIp(ip) {
  if (typeof ip !== "string") return false;
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
function isMacAddress(mac) {
  if (typeof mac !== "string") return false;
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
}

// ../password/src/index.ts
function generate(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true
  } = options;
  if (length < 4 || length > 128) {
    throw new RangeError("Password length must be between 4 and 128");
  }
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numChars = "0123456789";
  const symChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let charPool = "";
  const guaranteedChars = [];
  if (uppercase) {
    charPool += upperChars;
    guaranteedChars.push(upperChars.charAt(Math.floor(Math.random() * upperChars.length)));
  }
  if (lowercase) {
    charPool += lowerChars;
    guaranteedChars.push(lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)));
  }
  if (numbers) {
    charPool += numChars;
    guaranteedChars.push(numChars.charAt(Math.floor(Math.random() * numChars.length)));
  }
  if (symbols) {
    charPool += symChars;
    guaranteedChars.push(symChars.charAt(Math.floor(Math.random() * symChars.length)));
  }
  if (charPool === "") {
    throw new Error("At least one character set option must be enabled");
  }
  const passwordChars = [...guaranteedChars];
  const remainingLength = length - guaranteedChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    passwordChars.push(charPool.charAt(randomIndex));
  }
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }
  return passwordChars.join("");
}
function analyze(password) {
  if (typeof password !== "string") {
    throw new TypeError("Input must be a string");
  }
  const len = password.length;
  if (len === 0) {
    return { score: 0, label: "very-weak", entropy: 0, suggestions: ["Password cannot be empty."] };
  }
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 26;
  const entropy = Math.round(len * (Math.log(poolSize) / Math.log(2)));
  const suggestions = [];
  if (len < 8) {
    suggestions.push("Increase password length to at least 12 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters.");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters.");
  }
  if (!/[0-9]/.test(password)) {
    suggestions.push("Add numeric digits.");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push("Add symbols or special characters.");
  }
  let score = 0;
  let label = "very-weak";
  if (entropy >= 128) {
    score = 4;
    label = "very-strong";
  } else if (entropy >= 60) {
    score = 3;
    label = "strong";
  } else if (entropy >= 36) {
    score = 2;
    label = "moderate";
  } else if (entropy >= 28) {
    score = 1;
    label = "weak";
  }
  return {
    score,
    label,
    entropy,
    suggestions
  };
}

// ../xml/src/index.ts
function validate3(xml) {
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
function format2(xml, indentSize = 2) {
  const validation = validate3(xml);
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
function minify2(xml) {
  const validation = validate3(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  return xml.replace(/>\s*</g, "><").replace(/<!--[\s\S]*?-->/g, "").trim();
}

// ../jwt/src/index.ts
function decodeBase64Url(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
function verifyFormat(token) {
  if (typeof token !== "string") return false;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  const base64UrlRegex = /^[A-Za-z0-9-_]+$/;
  return base64UrlRegex.test(parts[0]) && base64UrlRegex.test(parts[1]) && (parts[2] === "" || base64UrlRegex.test(parts[2]));
}
function decode2(token) {
  if (typeof token !== "string") {
    throw new TypeError("Token must be a string");
  }
  if (!verifyFormat(token)) {
    throw new Error("Invalid JWT token format");
  }
  const parts = token.trim().split(".");
  try {
    const headerJson = decodeBase64Url(parts[0]);
    const payloadJson = decodeBase64Url(parts[1]);
    return {
      header: JSON.parse(headerJson),
      payload: JSON.parse(payloadJson),
      signature: parts[2]
    };
  } catch (e) {
    throw new Error(`Failed to decode JWT payload: ${e.message}`);
  }
}

// ../hash/src/index.ts
function bufferToHex(buffer) {
  let hex = "";
  for (let i = 0; i < buffer.length; i++) {
    hex += buffer[i].toString(16).padStart(2, "0");
  }
  return hex;
}
async function sha256(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-256 requires Web Crypto API or Node.js runtime.");
  }
}
async function sha512(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-512", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha512").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-512 requires Web Crypto API or Node.js runtime.");
  }
}
async function sha1(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-1", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha1").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-1 requires Web Crypto API or Node.js runtime.");
  }
}
async function hmacSha256(key, message) {
  const keyBytes = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const msgBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
    return bufferToHex(new Uint8Array(signature));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHmac("sha256", keyBytes).update(msgBytes).digest("hex");
  } catch {
    throw new Error("HMAC requires Web Crypto API or Node.js runtime.");
  }
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c2, d, x, s, t) {
  return md5cmn(b & c2 | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c2, d, x, s, t) {
  return md5cmn(b & d | c2 & ~d, a, b, x, s, t);
}
function md5hh(a, b, c2, d, x, s, t) {
  return md5cmn(b ^ c2 ^ d, a, b, x, s, t);
}
function md5ii(a, b, c2, d, x, s, t) {
  return md5cmn(c2 ^ (b | ~d), a, b, x, s, t);
}
function binlMD5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  let a = 1732584193;
  let b = -271733879;
  let c2 = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c2;
    const oldd = d;
    a = md5ff(a, b, c2, d, x[i + 0] || 0, 7, -680876936);
    d = md5ff(d, a, b, c2, x[i + 1] || 0, 12, -389564586);
    c2 = md5ff(c2, d, a, b, x[i + 2] || 0, 17, 606105819);
    b = md5ff(b, c2, d, a, x[i + 3] || 0, 22, -1044525330);
    a = md5ff(a, b, c2, d, x[i + 4] || 0, 7, -176418897);
    d = md5ff(d, a, b, c2, x[i + 5] || 0, 12, 1200080426);
    c2 = md5ff(c2, d, a, b, x[i + 6] || 0, 17, -1473231341);
    b = md5ff(b, c2, d, a, x[i + 7] || 0, 22, -45705983);
    a = md5ff(a, b, c2, d, x[i + 8] || 0, 7, 1770035416);
    d = md5ff(d, a, b, c2, x[i + 9] || 0, 12, -1958414417);
    c2 = md5ff(c2, d, a, b, x[i + 10] || 0, 17, -42063);
    b = md5ff(b, c2, d, a, x[i + 11] || 0, 22, -1990404162);
    a = md5ff(a, b, c2, d, x[i + 12] || 0, 7, 1804603682);
    d = md5ff(d, a, b, c2, x[i + 13] || 0, 12, -40341101);
    c2 = md5ff(c2, d, a, b, x[i + 14] || 0, 17, -1502002290);
    b = md5ff(b, c2, d, a, x[i + 15] || 0, 22, 1236535329);
    a = md5gg(a, b, c2, d, x[i + 1] || 0, 5, -165796510);
    d = md5gg(d, a, b, c2, x[i + 6] || 0, 9, -1069501632);
    c2 = md5gg(c2, d, a, b, x[i + 11] || 0, 14, 643717713);
    b = md5gg(b, c2, d, a, x[i + 0] || 0, 20, -373897302);
    a = md5gg(a, b, c2, d, x[i + 5] || 0, 5, -701558691);
    d = md5gg(d, a, b, c2, x[i + 10] || 0, 9, 38016083);
    c2 = md5gg(c2, d, a, b, x[i + 15] || 0, 14, -660478335);
    b = md5gg(b, c2, d, a, x[i + 4] || 0, 20, -405537848);
    a = md5gg(a, b, c2, d, x[i + 9] || 0, 5, 568446438);
    d = md5gg(d, a, b, c2, x[i + 14] || 0, 9, -1019803690);
    c2 = md5gg(c2, d, a, b, x[i + 3] || 0, 14, -187363961);
    b = md5gg(b, c2, d, a, x[i + 8] || 0, 20, 1163531501);
    a = md5gg(a, b, c2, d, x[i + 13] || 0, 5, -1444681467);
    d = md5gg(d, a, b, c2, x[i + 2] || 0, 9, -51403784);
    c2 = md5gg(c2, d, a, b, x[i + 7] || 0, 14, 1735328473);
    b = md5gg(b, c2, d, a, x[i + 12] || 0, 20, -1926607734);
    a = md5hh(a, b, c2, d, x[i + 5] || 0, 4, -378558);
    d = md5hh(d, a, b, c2, x[i + 8] || 0, 11, -2022574463);
    c2 = md5hh(c2, d, a, b, x[i + 11] || 0, 16, 1839030562);
    b = md5hh(b, c2, d, a, x[i + 14] || 0, 23, -35309556);
    a = md5hh(a, b, c2, d, x[i + 1] || 0, 4, -1530992060);
    d = md5hh(d, a, b, c2, x[i + 4] || 0, 11, 1272893353);
    c2 = md5hh(c2, d, a, b, x[i + 7] || 0, 16, -155497632);
    b = md5hh(b, c2, d, a, x[i + 10] || 0, 23, -1094730640);
    a = md5hh(a, b, c2, d, x[i + 13] || 0, 4, 681279174);
    d = md5hh(d, a, b, c2, x[i + 0] || 0, 11, -358537222);
    c2 = md5hh(c2, d, a, b, x[i + 3] || 0, 16, -722521979);
    b = md5hh(b, c2, d, a, x[i + 6] || 0, 23, 76029189);
    a = md5hh(a, b, c2, d, x[i + 9] || 0, 4, -640364487);
    d = md5hh(d, a, b, c2, x[i + 12] || 0, 11, -421815835);
    c2 = md5hh(c2, d, a, b, x[i + 15] || 0, 16, 530742520);
    b = md5hh(b, c2, d, a, x[i + 2] || 0, 23, -995338651);
    a = md5ii(a, b, c2, d, x[i + 0] || 0, 6, -198630844);
    d = md5ii(d, a, b, c2, x[i + 7] || 0, 10, 1126891415);
    c2 = md5ii(c2, d, a, b, x[i + 14] || 0, 15, -1416354905);
    b = md5ii(b, c2, d, a, x[i + 5] || 0, 21, -57434055);
    a = md5ii(a, b, c2, d, x[i + 12] || 0, 6, 1700485571);
    d = md5ii(d, a, b, c2, x[i + 3] || 0, 10, -1894986606);
    c2 = md5ii(c2, d, a, b, x[i + 10] || 0, 15, -1051523);
    b = md5ii(b, c2, d, a, x[i + 1] || 0, 21, -2054922799);
    a = md5ii(a, b, c2, d, x[i + 8] || 0, 6, 1873313359);
    d = md5ii(d, a, b, c2, x[i + 15] || 0, 10, -30611744);
    c2 = md5ii(c2, d, a, b, x[i + 6] || 0, 15, -1560198380);
    b = md5ii(b, c2, d, a, x[i + 13] || 0, 21, 1309151649);
    a = md5ii(a, b, c2, d, x[i + 4] || 0, 6, -145523070);
    d = md5ii(d, a, b, c2, x[i + 11] || 0, 10, -1120210379);
    c2 = md5ii(c2, d, a, b, x[i + 2] || 0, 15, 718787259);
    b = md5ii(b, c2, d, a, x[i + 9] || 0, 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c2 = safeAdd(c2, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c2, d];
}
function rstr2binl(input) {
  const output = [];
  const length8 = input.length * 8;
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
  }
  return output;
}
function binl2hex(binarray) {
  const hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i++) {
    str += hexTab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hexTab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
  }
  return str;
}
function md5(data) {
  const utf8 = unescape(encodeURIComponent(data));
  return binl2hex(binlMD5(rstr2binl(utf8), utf8.length * 8));
}

// src/ui.ts
import readline from "readline";
function rgb(r, g, b) {
  return `\x1B[38;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}
function bgRgb(r, g, b) {
  return `\x1B[48;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}
var c = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  italic: "\x1B[3m",
  underline: "\x1B[4m",
  // Sleek TrueColor Foregrounds
  violet: rgb(168, 85, 247),
  purple: rgb(192, 132, 252),
  indigo: rgb(99, 102, 241),
  blue: rgb(59, 130, 246),
  cyan: rgb(6, 182, 212),
  teal: rgb(20, 184, 166),
  emerald: rgb(16, 185, 129),
  green: rgb(34, 197, 94),
  amber: rgb(245, 158, 11),
  rose: rgb(244, 63, 94),
  red: rgb(239, 68, 68),
  white: rgb(255, 255, 255),
  muted: rgb(148, 163, 184),
  darkGray: rgb(71, 85, 105),
  // Fallback ANSI Standard
  brightWhite: "\x1B[97m",
  brightCyan: "\x1B[96m",
  brightGreen: "\x1B[92m",
  brightYellow: "\x1B[93m",
  brightRed: "\x1B[91m"
};
var GRADIENT_CYBERPUNK = [
  [168, 85, 247],
  // Violet
  [129, 140, 248],
  // Indigo
  [59, 130, 246],
  // Blue
  [6, 182, 212],
  // Cyan
  [16, 185, 129]
  // Emerald
];
function gradient(text, colors = GRADIENT_CYBERPUNK) {
  const clean = text.replace(/\x1b\[[0-9;]*m/g, "");
  const n = clean.length;
  if (n <= 1) return text;
  let out = "";
  let cleanIdx = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\x1B") {
      const end = text.indexOf("m", i);
      if (end !== -1) {
        out += text.slice(i, end + 1);
        i = end;
        continue;
      }
    }
    const t = cleanIdx / (n - 1);
    const seg = t * (colors.length - 1);
    const idx = Math.min(Math.floor(seg), colors.length - 2);
    const frac = seg - idx;
    const c1 = colors[idx];
    const c2 = colors[idx + 1];
    const r = c1[0] + (c2[0] - c1[0]) * frac;
    const g = c1[1] + (c2[1] - c1[1]) * frac;
    const b = c1[2] + (c2[2] - c1[2]) * frac;
    out += rgb(r, g, b) + text[i];
    cleanIdx++;
  }
  return out + c.reset;
}
function badge(text, bg, fg = [255, 255, 255]) {
  return `${bgRgb(bg[0], bg[1], bg[2])}${rgb(fg[0], fg[1], fg[2])}${c.bold} ${text} ${c.reset}`;
}
function printBanner() {
  const asciiLines = [
    "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557",
    "  \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u255D \u2588\u2588\u2551 \u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D",
    "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2554\u255D  \u2588\u2588\u2551    \u2588\u2588\u2551   ",
    "  \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2588\u2588\u2557  \u2588\u2588\u2551    \u2588\u2588\u2551   ",
    "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551      \u2588\u2588\u2551  \u2588\u2588\u2557 \u2588\u2588\u2551    \u2588\u2588\u2551   ",
    "  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u255D      \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u255D    \u255A\u2550\u255D   "
  ];
  console.log();
  for (const line of asciiLines) {
    console.log(gradient(line, GRADIENT_CYBERPUNK));
  }
  const b1 = badge("600+ Web Tools", [99, 102, 241]);
  const b2 = badge("100% Client-Side Private", [16, 185, 129]);
  const b3 = badge("v1.0.2", [6, 182, 212]);
  const url = `${c.dim}https://${c.reset}${c.bold}${c.cyan}sopkit.space${c.reset}`;
  console.log(`
  ${c.bold}${c.brightWhite}S O P K I T${c.reset}  ${c.dim}\u2014 Privacy-First Developer Utility Suite${c.reset}`);
  console.log(`  ${b1}  ${b2}  ${b3}  ${url}
`);
}
function printCard(title, content, status, categoryBadge) {
  const lines = content.split("\n");
  const cleanTitle = title.replace(/\x1b\[[0-9;]*m/g, "");
  const cleanBadge = (categoryBadge || "").replace(/\x1b\[[0-9;]*m/g, "");
  const titleTotal = cleanTitle.length + (cleanBadge ? cleanBadge.length + 3 : 0);
  const cleanLengths = lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length);
  const maxLineLen = Math.max(titleTotal + 8, ...cleanLengths, 48);
  const topBorderText = `\u2500\u2500 ${c.bold}${c.cyan}${title}${c.reset}${categoryBadge ? ` ${c.dim}[${c.reset}${c.violet}${categoryBadge}${c.dim}]${c.reset}` : ""} `;
  const topBorderPlainLen = titleTotal + 4;
  const remainingDashes = Math.max(0, maxLineLen - topBorderPlainLen);
  const topBorder = `\u256D${topBorderText}${"\u2500".repeat(remainingDashes)}\u256E`;
  const bottomBorder = `\u2570${"\u2500".repeat(maxLineLen + 1)}\u256F`;
  console.log(`
${c.darkGray}${topBorder}${c.reset}`);
  for (const line of lines) {
    console.log(`  ${line}`);
  }
  console.log(`${c.darkGray}${bottomBorder}${c.reset}`);
  if (status) {
    console.log(`  ${c.emerald}\u2714${c.reset} ${c.muted}${status}${c.reset}
`);
  } else {
    console.log();
  }
}
function printColorCard(hex, rgbStr, hslStr, r, g, b) {
  const block = `${bgRgb(r, g, b)}          ${c.reset}`;
  const blockTall = `${bgRgb(r, g, b)}          ${c.reset}`;
  const content = [
    `  ${block}   ${c.bold}HEX${c.reset}  ${c.cyan}${hex.toUpperCase()}${c.reset}`,
    `  ${blockTall}   ${c.bold}RGB${c.reset}  ${c.emerald}${rgbStr}${c.reset}`,
    `  ${block}   ${c.bold}HSL${c.reset}  ${c.purple}${hslStr}${c.reset}`
  ].join("\n");
  printCard("Color Preview & Conversion", content, void 0, "PALETTE");
}
function printPasswordCard(passwordText, length, entropyBits, score, durationMs) {
  const maxBars = 16;
  const filledBars = Math.min(Math.round(score / 4 * maxBars), maxBars);
  const emptyBars = maxBars - filledBars;
  let meterColor = c.red;
  let strengthLabel = "Weak";
  if (score >= 4) {
    meterColor = c.emerald;
    strengthLabel = "Ultra Secure";
  } else if (score === 3) {
    meterColor = c.teal;
    strengthLabel = "Strong";
  } else if (score === 2) {
    meterColor = c.amber;
    strengthLabel = "Moderate";
  }
  const meter = `${meterColor}${"\u2588".repeat(filledBars)}${c.darkGray}${"\u2591".repeat(emptyBars)}${c.reset}`;
  const content = [
    `  ${c.bold}${c.brightWhite}${passwordText}${c.reset}`,
    ``,
    `  ${c.muted}Entropy:${c.reset}   ${meter} ${c.bold}${meterColor}${strengthLabel}${c.reset} ${c.dim}(${entropyBits.toFixed(1)} bits)${c.reset}`,
    `  ${c.muted}Length:${c.reset}    ${c.cyan}${length} characters${c.reset}`
  ].join("\n");
  printCard("Generated Secure Password", content, `Generated in ${durationMs}ms`, "SECURITY");
}
async function select(message, choices) {
  if (!process.stdin.isTTY) {
    return choices[0]?.value || "";
  }
  let selectedIndex = 0;
  const stdin = process.stdin;
  const stdout = process.stdout;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");
  function render() {
    stdout.write(`\x1B[?25l`);
    stdout.write(`\r\x1B[K${c.bold}${c.cyan}?${c.reset} ${c.bold}${c.brightWhite}${message}${c.reset}
`);
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      const isSelected = i === selectedIndex;
      const shortcutNum = choice.shortcut || (i < 9 ? String(i + 1) : i === 9 ? "0" : "");
      const shortcutDisplay = shortcutNum ? `${c.dim}[${c.reset}${c.cyan}${shortcutNum}${c.dim}]${c.reset} ` : "    ";
      const pointer = isSelected ? `${c.bold}${c.cyan}\u276F${c.reset}` : " ";
      const tag = choice.tag ? ` ${c.dim}[${c.reset}${c.violet}${choice.tag}${c.dim}]${c.reset}` : "";
      const text = isSelected ? `${c.bold}${c.cyan}${choice.title}${c.reset}` : `${c.muted}${choice.title}${c.reset}`;
      const desc = choice.desc ? ` ${c.dim}\u2014 ${choice.desc}${c.reset}` : "";
      stdout.write(`\r\x1B[K  ${pointer} ${shortcutDisplay}${text}${tag}${desc}
`);
    }
    const hints = `${c.darkGray}  \u2500 \u2191/\u2193 navigate \u2022 1-9 quick-key \u2022 Enter select \u2022 q / Ctrl+C quit \u2500${c.reset}`;
    stdout.write(`\r\x1B[K${hints}
`);
  }
  render();
  return new Promise((resolve) => {
    function onData(key) {
      if (key === "" || key === "q" || key === "Q") {
        cleanup();
        stdout.write(`
${c.muted}Session ended. Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}

`);
        process.exit(0);
      }
      if (key === "\r" || key === "\n") {
        cleanup();
        resolve(choices[selectedIndex].value);
        return;
      }
      if (key >= "1" && key <= "9") {
        const numIdx = parseInt(key, 10) - 1;
        if (numIdx < choices.length) {
          cleanup();
          resolve(choices[numIdx].value);
          return;
        }
      } else if (key === "0" && choices.length >= 10) {
        cleanup();
        resolve(choices[9].value);
        return;
      }
      if (key === "\x1B[A" || key === "k") {
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
      } else if (key === "\x1B[B" || key === "j") {
        selectedIndex = (selectedIndex + 1) % choices.length;
      }
      stdout.write(`\x1B[${choices.length + 2}A`);
      render();
    }
    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write(`\x1B[?25h`);
    }
    stdin.on("data", onData);
  });
}
async function promptText(message, defaultValue = "") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const promptMsg = defaultValue ? `  ${c.bold}${c.cyan}?${c.reset} ${c.brightWhite}${message}${c.reset} ${c.dim}(default: ${defaultValue})${c.reset}: ` : `  ${c.bold}${c.cyan}?${c.reset} ${c.brightWhite}${message}${c.reset}: `;
  return new Promise((resolve) => {
    rl.question(promptMsg, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// src/index.ts
async function main() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    await handleDirectCli(args);
    return;
  }
  printBanner();
  while (true) {
    const choice = await select("Choose a SopKit developer utility:", [
      { title: "\u{1F511}  Hash Generator", value: "hash", desc: "SHA-256, SHA-512, MD5, HMAC", tag: "CRYPTO", shortcut: "1" },
      { title: "\u{1F4E6}  Base64 Engine", value: "base64", desc: "Encode, Decode, URL-safe", tag: "ENCODE", shortcut: "2" },
      { title: "\u{1F194}  UUID Generator", value: "uuid", desc: "v4 Random, v1 Timestamp", tag: "IDENT", shortcut: "3" },
      { title: "\u{1F517}  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "4" },
      { title: "\u{1F3A8}  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "5" },
      { title: "\u{1F6E1}\uFE0F   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "6" },
      { title: "\u2728  JSON Formatter", value: "json", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "7" },
      { title: "\u{1F4DC}  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "8" },
      { title: "\u{1F512}  Password Generator", value: "password", desc: "High-entropy password with visual meter", tag: "SECURITY", shortcut: "9" },
      { title: "\u2705  Data Validator", value: "validator", desc: "Email, URL, IP, UUID, JSON", tag: "CHECK", shortcut: "0" },
      { title: "\u{1F6AA}  Exit", value: "exit", desc: "Return to shell", shortcut: "q" }
    ]);
    if (choice === "exit") {
      console.log(`
  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for 600+ web tools.${c.reset}
`);
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
    { title: "URL-Safe Base64 Decode", value: "urlDecode", tag: "URL-SAFE" }
  ]);
  const text = await promptText("Input text");
  if (!text) return;
  const t0 = performance.now();
  let result = "";
  if (mode === "encode") result = encode(text);
  else if (mode === "decode") result = decode(text);
  else if (mode === "urlEncode") result = urlEncode(text);
  else if (mode === "urlDecode") result = urlDecode(text);
  const duration = (performance.now() - t0).toFixed(2);
  printCard("Base64 Output", `${c.bold}${c.brightWhite}${result}${c.reset}`, `Executed in ${duration}ms`, "BASE64");
}
async function runUuid() {
  const version = await select("UUID Version:", [
    { title: "UUID v4 (Cryptographic Random)", value: "v4", tag: "RFC 4122" },
    { title: "UUID v1 (Timestamp-Based)", value: "v1", tag: "RFC 4122" }
  ]);
  const countStr = await promptText("Quantity", "1");
  const count = Math.min(Math.max(parseInt(countStr, 10) || 1, 1), 50);
  const t0 = performance.now();
  const rows = [];
  for (let i = 0; i < count; i++) {
    const val = version === "v1" ? v1() : v4();
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
  const res = slugify(text, { separator: sep, lowercase: true });
  const duration = (performance.now() - t0).toFixed(2);
  const content = [
    `  ${c.muted}Input:${c.reset}   ${c.brightWhite}${text}${c.reset}`,
    `  ${c.muted}Slug:${c.reset}    ${c.bold}${c.emerald}${res}${c.reset}`
  ].join("\n");
  printCard("URL Slug Output", content, `Generated in ${duration}ms`, "SEO");
}
async function runColor() {
  const input = await promptText("Enter HEX / CSS color", "#ff3366");
  if (!input) return;
  try {
    const rgbVal = hexToRgb(input);
    const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    const hexClean = input.startsWith("#") ? input : `#${input}`;
    const rgbStr = `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`;
    const hslStr = `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`;
    printColorCard(hexClean, rgbStr, hslStr, rgbVal.r, rgbVal.g, rgbVal.b);
  } catch (e) {
    printCard("Error", `${c.red}${e.message}${c.reset}`);
  }
}
async function runJwt() {
  const token = await promptText("Paste JWT Token");
  if (!token) return;
  const t0 = performance.now();
  try {
    const decoded = decode2(token);
    const duration = (performance.now() - t0).toFixed(2);
    const parts = [
      `  ${c.bold}${c.violet}Algorithm & Header:${c.reset}`,
      `  ${JSON.stringify(decoded.header, null, 2).split("\n").join("\n  ")}`,
      ``,
      `  ${c.bold}${c.cyan}Claims & Payload:${c.reset}`,
      `  ${JSON.stringify(decoded.payload, null, 2).split("\n").join("\n  ")}`
    ];
    printCard("Decoded JWT Details", parts.join("\n"), `Decoded in ${duration}ms`, "AUTH");
  } catch (err) {
    printCard("Error", `${c.red}Failed to decode JWT: ${err.message}${c.reset}`);
  }
}
async function runHash() {
  const algo = await select("Select Hash Algorithm:", [
    { title: "SHA-256 (Industry standard)", value: "sha256", tag: "SECURE" },
    { title: "SHA-512 (Maximum bit security)", value: "sha512", tag: "MAX" },
    { title: "HMAC SHA-256 (Keyed Hash)", value: "hmac", tag: "HMAC" },
    { title: "SHA-1 (Legacy checksum)", value: "sha1", tag: "LEGACY" },
    { title: "MD5 (Legacy digest)", value: "md5", tag: "LEGACY" }
  ]);
  const text = await promptText("Input string to hash", "secret");
  if (!text) return;
  const t0 = performance.now();
  let result = "";
  if (algo === "sha256") result = await sha256(text);
  else if (algo === "sha512") result = await sha512(text);
  else if (algo === "sha1") result = await sha1(text);
  else if (algo === "md5") result = await md5(text);
  else if (algo === "hmac") {
    const key = await promptText("Secret HMAC key", "sopkit-secret");
    result = await hmacSha256(text, key);
  }
  const duration = (performance.now() - t0).toFixed(2);
  const content = [
    `  ${c.muted}Input:${c.reset}   ${c.brightWhite}${text}${c.reset}`,
    `  ${c.muted}Digest:${c.reset}  ${c.bold}${c.cyan}${result}${c.reset}`
  ].join("\n");
  printCard(`${algo.toUpperCase()} Hash Output`, content, `Computed in ${duration}ms`, "CRYPTO");
}
async function runJson() {
  const mode = await select("JSON Operation:", [
    { title: "Beautify / Format (2 spaces)", value: "beautify", tag: "FORMAT" },
    { title: "Minify (Single line)", value: "minify", tag: "MINIFY" },
    { title: "Validate Syntax", value: "validate", tag: "CHECK" }
  ]);
  const text = await promptText("Enter JSON string", '{"name":"SopKit","speed":"instant"}');
  if (!text) return;
  const t0 = performance.now();
  if (mode === "validate") {
    const res = validate2(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard(
      "JSON Validation",
      res.valid ? `  ${c.emerald}\u2714 Valid JSON Syntax${c.reset}` : `  ${c.red}\u2716 Invalid JSON: ${res.error}${c.reset}`,
      `Validated in ${duration}ms`,
      "JSON"
    );
  } else if (mode === "beautify") {
    try {
      const res = format(text, 2);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Formatted JSON", res, `Formatted in ${duration}ms`, "JSON");
    } catch (e) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  } else if (mode === "minify") {
    try {
      const res = minify(text);
      const duration = (performance.now() - t0).toFixed(2);
      printCard("Minified JSON", `${c.cyan}${res}${c.reset}`, `Minified in ${duration}ms`, "JSON");
    } catch (e) {
      printCard("Error", `${c.red}${e.message}${c.reset}`);
    }
  }
}
async function runXml() {
  const mode = await select("XML Operation:", [
    { title: "Beautify / Format", value: "beautify", tag: "FORMAT" },
    { title: "Minify", value: "minify", tag: "MINIFY" },
    { title: "Validate Syntax", value: "validate", tag: "CHECK" }
  ]);
  const text = await promptText("Enter XML string", "<root><tool>SopKit</tool></root>");
  if (!text) return;
  const t0 = performance.now();
  if (mode === "validate") {
    const isValid = validate3(text).isValid;
    const duration = (performance.now() - t0).toFixed(2);
    printCard(
      "XML Validation",
      isValid ? `  ${c.emerald}\u2714 Valid XML Document${c.reset}` : `  ${c.red}\u2716 Invalid XML${c.reset}`,
      `Validated in ${duration}ms`,
      "XML"
    );
  } else if (mode === "beautify") {
    const res = format2(text, { indent: 2 });
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Formatted XML", res, `Formatted in ${duration}ms`, "XML");
  } else if (mode === "minify") {
    const res = minify2(text);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("Minified XML", `${c.cyan}${res}${c.reset}`, `Minified in ${duration}ms`, "XML");
  }
}
async function runPassword() {
  const lenStr = await promptText("Password length", "24");
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 24, 4), 128);
  const t0 = performance.now();
  const pass = generate({ length, numbers: true, symbols: true, uppercase: true, lowercase: true });
  const strength = analyze(pass);
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
    { title: "UUID", value: "uuid", tag: "UUID" }
  ]);
  const val = await promptText("Enter value to validate");
  if (!val) return;
  const t0 = performance.now();
  let ok = false;
  if (type === "email") ok = isEmail(val);
  else if (type === "url") ok = isUrl(val);
  else if (type === "domain") ok = isDomain(val);
  else if (type === "ip") ok = isIp(val);
  else if (type === "mac") ok = isMacAddress(val);
  else if (type === "uuid") ok = validate(val);
  const duration = (performance.now() - t0).toFixed(2);
  const content = ok ? `  ${c.emerald}${c.bold}\u2714 VALID${c.reset}  ${c.brightWhite}${val}${c.reset}` : `  ${c.red}${c.bold}\u2716 INVALID${c.reset}  ${c.brightWhite}${val}${c.reset}`;
  printCard(`Validation Result [${type.toUpperCase()}]`, content, `Checked in ${duration}ms`, "VALIDATE");
}
async function handleDirectCli(args) {
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
      console.log(ver === "v1" ? v1() : v4());
    }
    return;
  }
  if (cmd === "base64") {
    const action = args[1]?.toLowerCase();
    const text = args.slice(2).join(" ");
    if (action === "decode") console.log(decode(text));
    else console.log(encode(text));
    return;
  }
  if (cmd === "hash") {
    const algo = args[1]?.toLowerCase() || "sha256";
    const text = args.slice(2).join(" ");
    if (algo === "sha512") console.log(await sha512(text));
    else if (algo === "md5") console.log(await md5(text));
    else if (algo === "sha1") console.log(await sha1(text));
    else console.log(await sha256(text));
    return;
  }
  if (cmd === "slug") {
    console.log(slugify(args.slice(1).join(" ")));
    return;
  }
  if (cmd === "password") {
    const len = parseInt(args[1] || "18", 10) || 18;
    console.log(generate({ length: len }));
    return;
  }
  if (cmd === "color") {
    const col = args[1] || "#38bdf8";
    try {
      const rgbVal = hexToRgb(col);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      const swatch = process.stdout.isTTY ? `${bgRgb(rgbVal.r, rgbVal.g, rgbVal.b)}  ${c.reset} ` : "";
      console.log(`${swatch}HEX: ${col} | RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}) | HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    } catch (e) {
      console.error(e.message);
    }
    return;
  }
  console.log(`${c.red}Unknown command: ${cmd}${c.reset}. Run ${c.cyan}sopkit --help${c.reset} for options.`);
}
main().catch((err) => {
  console.error(`
${c.red}Error:${c.reset} ${err.message}
`);
  process.exit(1);
});
//# sourceMappingURL=index.js.map