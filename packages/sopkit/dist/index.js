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

// ../cli/src/tools/timestamp.ts
function now() {
  const d = /* @__PURE__ */ new Date();
  return formatTimestamp(d);
}
function fromEpoch(epoch) {
  let num = typeof epoch === "string" ? Number(epoch.trim()) : epoch;
  if (isNaN(num)) {
    throw new Error(`Invalid numeric epoch timestamp: "${epoch}"`);
  }
  if (num < 1e11) {
    num = num * 1e3;
  }
  return formatTimestamp(new Date(num));
}
function fromDateString(str) {
  const d = new Date(str.trim());
  if (isNaN(d.getTime())) {
    throw new Error(`Unable to parse date string: "${str}"`);
  }
  return formatTimestamp(d);
}
function formatTimestamp(d) {
  const ms = d.getTime();
  const sec = Math.floor(ms / 1e3);
  return {
    seconds: sec,
    milliseconds: ms,
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toString(),
    relative: getRelativeTime(ms)
  };
}
function getRelativeTime(timestampMs) {
  const nowMs = Date.now();
  const diffSec = Math.round((timestampMs - nowMs) / 1e3);
  if (Math.abs(diffSec) < 5) return "just now";
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);
  const units = [
    [31536e3, "year"],
    [2592e3, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"]
  ];
  for (const [divisor, unit] of units) {
    if (abs >= divisor) {
      const val = Math.floor(abs / divisor);
      const plural = val > 1 ? `${unit}s` : unit;
      return isPast ? `${val} ${plural} ago` : `in ${val} ${plural}`;
    }
  }
  return "just now";
}

// ../cli/src/tools/case.ts
function splitWords(text) {
  return text.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/[_\-./\\]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function toCamelCase(text) {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return words[0].toLowerCase() + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}
function toPascalCase(text) {
  const words = splitWords(text);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}
function toSnakeCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join("_");
}
function toKebabCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join("-");
}
function toConstantCase(text) {
  return splitWords(text).map((w) => w.toUpperCase()).join("_");
}
function toTitleCase(text) {
  return splitWords(text).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
function toDotCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join(".");
}
function convertAllCases(text) {
  return {
    camelCase: toCamelCase(text),
    pascalCase: toPascalCase(text),
    snakeCase: toSnakeCase(text),
    kebabCase: toKebabCase(text),
    constantCase: toConstantCase(text),
    titleCase: toTitleCase(text),
    dotCase: toDotCase(text)
  };
}

// ../cli/src/tools/lorem.ts
var LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "at",
  "vero",
  "eos",
  "accusamus",
  "iusto",
  "odio",
  "dignissimos",
  "ducimus",
  "blanditiis",
  "praesentium",
  "voluptatum",
  "deleniti",
  "atque",
  "corrupti",
  "quos",
  "dolores",
  "quas",
  "molestias",
  "excepturi",
  "sint",
  "obcaecati",
  "cupiditate",
  "provident"
];
function generateWords(count = 10) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  }
  return result.join(" ");
}
function generateSentence(minWords = 6, maxWords = 14) {
  const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = [];
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * LOREM_WORDS.length);
    words.push(LOREM_WORDS[idx]);
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}
function generateParagraph(sentenceCount = 4) {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}
function generateParagraphs(count = 3) {
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph());
  }
  return paragraphs.join("\n\n");
}

// ../cli/src/tools/url.ts
function parseUrl(input) {
  let target = input.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }
  const u = new URL(target);
  const params = {};
  u.searchParams.forEach((val, key) => {
    params[key] = val;
  });
  return {
    href: u.href,
    protocol: u.protocol,
    origin: u.origin,
    host: u.host,
    hostname: u.hostname,
    port: u.port || "(default)",
    pathname: u.pathname,
    search: u.search || "(none)",
    hash: u.hash || "(none)",
    params
  };
}
function encodeUrl(str, component = true) {
  return component ? encodeURIComponent(str) : encodeURI(str);
}
function decodeUrl(str, component = true) {
  return component ? decodeURIComponent(str) : decodeURI(str);
}

// ../cli/src/tools/bytes.ts
function formatBytes(bytes) {
  const absBytes = Math.abs(bytes);
  const kib = absBytes / 1024;
  const mib = kib / 1024;
  const gib = mib / 1024;
  const tib = gib / 1024;
  let binaryHuman = `${absBytes} B`;
  if (tib >= 1) binaryHuman = `${tib.toFixed(2)} TiB`;
  else if (gib >= 1) binaryHuman = `${gib.toFixed(2)} GiB`;
  else if (mib >= 1) binaryHuman = `${mib.toFixed(2)} MiB`;
  else if (kib >= 1) binaryHuman = `${kib.toFixed(2)} KiB`;
  const kb = absBytes / 1e3;
  const mb = kb / 1e3;
  const gb = mb / 1e3;
  const tb = gb / 1e3;
  let decimalHuman = `${absBytes} B`;
  if (tb >= 1) decimalHuman = `${tb.toFixed(2)} TB`;
  else if (gb >= 1) decimalHuman = `${gb.toFixed(2)} GB`;
  else if (mb >= 1) decimalHuman = `${mb.toFixed(2)} MB`;
  else if (kb >= 1) decimalHuman = `${kb.toFixed(2)} KB`;
  return {
    bytes,
    binary: {
      kib: Number(kib.toFixed(2)),
      mib: Number(mib.toFixed(2)),
      gib: Number(gib.toFixed(2)),
      tib: Number(tib.toFixed(2)),
      human: binaryHuman
    },
    decimal: {
      kb: Number(kb.toFixed(2)),
      mb: Number(mb.toFixed(2)),
      gb: Number(gb.toFixed(2)),
      tb: Number(tb.toFixed(2)),
      human: decimalHuman
    }
  };
}
function parseByteString(input) {
  const match = input.trim().match(/^([0-9.]+)\s*([a-zA-Z]+)?$/);
  if (!match) {
    const raw = Number(input.trim());
    if (isNaN(raw)) throw new Error(`Cannot parse bytes from: "${input}"`);
    return raw;
  }
  const val = parseFloat(match[1]);
  const unit = (match[2] || "B").toUpperCase();
  const multipliers = {
    B: 1,
    KB: 1e3,
    KIB: 1024,
    MB: 1e3 ** 2,
    MIB: 1024 ** 2,
    GB: 1e3 ** 3,
    GIB: 1024 ** 3,
    TB: 1e3 ** 4,
    TIB: 1024 ** 4
  };
  const mult = multipliers[unit] || 1;
  return Math.round(val * mult);
}

// ../cli/src/tools/http.ts
var HTTP_CODES = {
  100: { phrase: "Continue", description: "Server received request headers, client should proceed to send the body." },
  101: { phrase: "Switching Protocols", description: "Requester has asked server to switch protocols (e.g. WebSocket)." },
  200: { phrase: "OK", description: "Standard successful HTTP response." },
  201: { phrase: "Created", description: "Request fulfilled and new resource created." },
  202: { phrase: "Accepted", description: "Request accepted for processing, but processing is incomplete." },
  204: { phrase: "No Content", description: "Request processed successfully, but returns no content." },
  206: { phrase: "Partial Content", description: "Delivering part of the resource due to a Range header." },
  301: { phrase: "Moved Permanently", description: "Permanent redirect. All future requests should use the new URI." },
  302: { phrase: "Found", description: "Temporary redirect to a different URI." },
  304: { phrase: "Not Modified", description: "Resource has not been modified since the version specified in request." },
  307: { phrase: "Temporary Redirect", description: "Temporary redirect preserving original HTTP method." },
  308: { phrase: "Permanent Redirect", description: "Permanent redirect preserving original HTTP method." },
  400: { phrase: "Bad Request", description: "Server cannot process request due to client error (malformed syntax)." },
  401: { phrase: "Unauthorized", description: "Authentication required and either missing or failed." },
  403: { phrase: "Forbidden", description: "Authenticated client does not have access permissions." },
  404: { phrase: "Not Found", description: "Requested resource could not be found on the server." },
  405: { phrase: "Method Not Allowed", description: "Request method (POST, GET, etc.) not supported for resource." },
  408: { phrase: "Request Timeout", description: "Server timed out waiting for the request from the client." },
  409: { phrase: "Conflict", description: "Request could not be processed because of conflict in request state." },
  413: { phrase: "Payload Too Large", description: "Request entity is larger than limits defined by server." },
  415: { phrase: "Unsupported Media Type", description: "Payload format is in an unsupported format." },
  422: { phrase: "Unprocessable Entity", description: "Syntax is correct but semantic instructions are unprocessable." },
  429: { phrase: "Too Many Requests", description: "User has sent too many requests in a given amount of time (rate limited)." },
  500: { phrase: "Internal Server Error", description: "Generic error message when server encounters an unexpected condition." },
  501: { phrase: "Not Implemented", description: "Server either does not recognize request method or lacks ability to fulfill." },
  502: { phrase: "Bad Gateway", description: "Server acting as gateway/proxy received invalid response from upstream." },
  503: { phrase: "Service Unavailable", description: "Server is currently unavailable (overloaded or down for maintenance)." },
  504: { phrase: "Gateway Timeout", description: "Gateway/proxy server did not receive timely response from upstream." }
};
function lookupStatus(code) {
  const num = typeof code === "string" ? parseInt(code.trim(), 10) : code;
  const item = HTTP_CODES[num];
  if (!item) return null;
  let category = "2xx Success";
  if (num < 200) category = "1xx Informational";
  else if (num < 300) category = "2xx Success";
  else if (num < 400) category = "3xx Redirection";
  else if (num < 500) category = "4xx Client Error";
  else category = "5xx Server Error";
  return {
    code: num,
    phrase: item.phrase,
    category,
    description: item.description
  };
}

// ../cli/src/tools/html.ts
var HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function escapeHtml(text) {
  return text.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITIES[char] || char);
}
function unescapeHtml(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/").replace(/&#x60;/g, "`").replace(/&#x3D;/g, "=");
}

// ../cli/src/ui.ts
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

// ../cli/src/index.ts
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
      { title: "\u{1F552}  Timestamp / Epoch", value: "timestamp", desc: "Unix epoch, ISO, Relative time", tag: "DATE", shortcut: "4" },
      { title: "\u{1F524}  Text Case Converter", value: "case", desc: "camel, snake, kebab, CONSTANT", tag: "TEXT", shortcut: "5" },
      { title: "\u{1F517}  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "6" },
      { title: "\u{1F3A8}  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "7" },
      { title: "\u{1F6E1}\uFE0F   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "8" },
      { title: "\u2728  JSON Formatter", value: "json", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "9" },
      { title: "\u{1F4DC}  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "0" },
      { title: "\u{1F512}  Password Generator", value: "password", desc: "High-entropy password with visual meter", tag: "SECURITY", shortcut: "p" },
      { title: "\u{1F4DD}  Lorem Ipsum Generator", value: "lorem", desc: "Generate words, sentences, paragraphs", tag: "MOCK", shortcut: "l" },
      { title: "\u{1F310}  URL Inspector & Parser", value: "url", desc: "Parse parameters, encode, decode", tag: "NET", shortcut: "u" },
      { title: "\u{1F4BE}  Byte Size Converter", value: "bytes", desc: "B, KB, MB, GB, TB binary & decimal", tag: "DATA", shortcut: "b" },
      { title: "\u{1F4E1}  HTTP Status Codes", value: "http", desc: "RFC codes 100-599 lookup & meaning", tag: "HTTP", shortcut: "h" },
      { title: "\u{1F523}  HTML Entity Escape", value: "html", desc: "Encode / decode HTML entities", tag: "HTML", shortcut: "e" },
      { title: "\u2705  Data Validator", value: "validator", desc: "Email, URL, IP, UUID, JSON", tag: "CHECK", shortcut: "v" },
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
async function runTimestamp() {
  const mode = await select("Timestamp / Epoch Operation:", [
    { title: "Current Epoch & Date (Now)", value: "now", tag: "NOW" },
    { title: "Convert Epoch to Human Date", value: "fromEpoch", tag: "CONVERT" },
    { title: "Convert Date String to Epoch", value: "toDate", tag: "PARSE" }
  ]);
  const t0 = performance.now();
  let info;
  if (mode === "now") {
    info = now();
  } else if (mode === "fromEpoch") {
    const epochInput = await promptText("Epoch timestamp (seconds or ms)", String(Math.floor(Date.now() / 1e3)));
    if (!epochInput) return;
    info = fromEpoch(epochInput);
  } else {
    const dateInput = await promptText("Date string (e.g. 2026-09-18T10:00:00Z)", (/* @__PURE__ */ new Date()).toISOString());
    if (!dateInput) return;
    info = fromDateString(dateInput);
  }
  const duration = (performance.now() - t0).toFixed(2);
  const rows = [
    `  ${c.muted}Epoch (Sec):${c.reset}    ${c.bold}${c.brightCyan}${info.seconds}${c.reset}`,
    `  ${c.muted}Epoch (Ms):${c.reset}     ${c.bold}${c.brightWhite}${info.milliseconds}${c.reset}`,
    `  ${c.muted}ISO 8601:${c.reset}       ${c.emerald}${info.iso}${c.reset}`,
    `  ${c.muted}UTC Date:${c.reset}       ${c.brightWhite}${info.utc}${c.reset}`,
    `  ${c.muted}Local Date:${c.reset}     ${c.brightWhite}${info.local}${c.reset}`,
    `  ${c.muted}Relative:${c.reset}       ${c.amber}${info.relative}${c.reset}`
  ].join("\n");
  printCard("Timestamp & Epoch Breakdown", rows, `Resolved in ${duration}ms`, "DATETIME");
}
async function runCase() {
  const text = await promptText("Enter string to convert", "SopKit Developer Toolkit");
  if (!text) return;
  const t0 = performance.now();
  const all = convertAllCases(text);
  const duration = (performance.now() - t0).toFixed(2);
  const rows = [
    `  ${c.muted}camelCase:${c.reset}     ${c.bold}${c.brightCyan}${all.camelCase}${c.reset}`,
    `  ${c.muted}PascalCase:${c.reset}    ${c.bold}${c.emerald}${all.pascalCase}${c.reset}`,
    `  ${c.muted}snake_case:${c.reset}    ${c.bold}${c.amber}${all.snakeCase}${c.reset}`,
    `  ${c.muted}kebab-case:${c.reset}    ${c.bold}${c.rose}${all.kebabCase}${c.reset}`,
    `  ${c.muted}CONSTANT_CASE:${c.reset} ${c.bold}${c.purple}${all.constantCase}${c.reset}`,
    `  ${c.muted}Title Case:${c.reset}    ${c.brightWhite}${all.titleCase}${c.reset}`,
    `  ${c.muted}dot.case:${c.reset}      ${c.muted}${all.dotCase}${c.reset}`
  ].join("\n");
  printCard("Text Case Conversions", rows, `Converted in ${duration}ms`, "STRING");
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
  printCard("URL Slug Generated", content, `Processed in ${duration}ms`, "SEO-SLUG");
}
async function runColor() {
  const hex = await promptText("Enter HEX color code", "#38bdf8");
  if (!hex) return;
  const t0 = performance.now();
  try {
    const rgbVal = hexToRgb(hex);
    const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    const duration = (performance.now() - t0).toFixed(2);
    printColorCard(hex, rgbVal, hslVal, duration);
  } catch (err) {
    console.log(`  ${c.red}Error:${c.reset} ${err.message}`);
  }
}
async function runJwt() {
  const token = await promptText("Paste JSON Web Token (JWT)");
  if (!token) return;
  const t0 = performance.now();
  try {
    const decoded = decode2(token);
    const duration = (performance.now() - t0).toFixed(2);
    const headerStr = JSON.stringify(decoded.header, null, 2);
    const payloadStr = JSON.stringify(decoded.payload, null, 2);
    const content = [
      `  ${c.bold}${c.purple}HEADER:${c.reset}`,
      ...headerStr.split("\n").map((l) => `    ${c.muted}${l}${c.reset}`),
      ``,
      `  ${c.bold}${c.cyan}PAYLOAD:${c.reset}`,
      ...payloadStr.split("\n").map((l) => `    ${c.brightWhite}${l}${c.reset}`)
    ].join("\n");
    printCard("Decoded JWT Token", content, `Parsed in ${duration}ms`, "JWT-INSPECT");
  } catch (err) {
    console.log(`  ${c.red}Error parsing JWT:${c.reset} ${err.message}`);
  }
}
async function runJson() {
  const mode = await select("JSON Operation:", [
    { title: "Format & Beautify (2 spaces)", value: "format2", tag: "BEAUTIFY" },
    { title: "Format & Beautify (4 spaces)", value: "format4", tag: "BEAUTIFY" },
    { title: "Minify (Single-line)", value: "minify", tag: "MINIFY" },
    { title: "Validate JSON Syntax", value: "validate", tag: "VALIDATE" }
  ]);
  const raw = await promptText("Enter JSON string");
  if (!raw) return;
  const t0 = performance.now();
  try {
    let output = "";
    if (mode === "format2") output = format(raw, 2);
    else if (mode === "format4") output = format(raw, 4);
    else if (mode === "minify") output = minify(raw);
    else {
      const ok = validate2(raw).valid;
      output = ok ? `${c.emerald}\u2714 JSON Syntax is Valid${c.reset}` : `${c.red}\u2716 Invalid JSON Syntax${c.reset}`;
    }
    const duration = (performance.now() - t0).toFixed(2);
    printCard("JSON Result", output, `Completed in ${duration}ms`, "JSON-ENGINE");
  } catch (err) {
    console.log(`  ${c.red}JSON Error:${c.reset} ${err.message}`);
  }
}
async function runXml() {
  const mode = await select("XML Operation:", [
    { title: "Format & Beautify (Indent)", value: "format", tag: "BEAUTIFY" },
    { title: "Minify XML", value: "minify", tag: "MINIFY" },
    { title: "Validate XML Syntax", value: "validate", tag: "VALIDATE" }
  ]);
  const raw = await promptText("Enter XML string");
  if (!raw) return;
  const t0 = performance.now();
  try {
    let output = "";
    if (mode === "format") output = format2(raw, 2);
    else if (mode === "minify") output = minify2(raw);
    else {
      const ok = validate3(raw).valid;
      output = ok ? `${c.emerald}\u2714 XML Syntax is Valid${c.reset}` : `${c.red}\u2716 Invalid XML Syntax${c.reset}`;
    }
    const duration = (performance.now() - t0).toFixed(2);
    printCard("XML Result", output, `Completed in ${duration}ms`, "XML-ENGINE");
  } catch (err) {
    console.log(`  ${c.red}XML Error:${c.reset} ${err.message}`);
  }
}
async function runPassword() {
  const lenStr = await promptText("Password Length", "20");
  const length = Math.min(Math.max(parseInt(lenStr, 10) || 20, 8), 128);
  const t0 = performance.now();
  const pass = generate({ length, numbers: true, symbols: true, uppercase: true, lowercase: true });
  const strength = analyze(pass);
  const duration = (performance.now() - t0).toFixed(2);
  printPasswordCard(pass, length, strength.entropy, strength.score, duration);
}
async function runLorem() {
  const type = await select("Lorem Ipsum Type:", [
    { title: "Words", value: "words", tag: "WORDS" },
    { title: "Sentences", value: "sentences", tag: "SENTENCES" },
    { title: "Paragraphs", value: "paragraphs", tag: "PARAGRAPHS" }
  ]);
  const countStr = await promptText("Quantity", "3");
  const count = Math.min(Math.max(parseInt(countStr, 10) || 3, 1), 100);
  const t0 = performance.now();
  let result = "";
  if (type === "words") result = generateWords(count);
  else if (type === "sentences") {
    const list = [];
    for (let i = 0; i < count; i++) list.push(generateSentence());
    result = list.join(" ");
  } else {
    result = generateParagraphs(count);
  }
  const duration = (performance.now() - t0).toFixed(2);
  printCard(`Lorem Ipsum [${count} ${type.toUpperCase()}]`, result, `Generated in ${duration}ms`, "LOREM");
}
async function runUrl() {
  const mode = await select("URL Operation:", [
    { title: "Parse & Inspect URL", value: "parse", tag: "INSPECT" },
    { title: "URL Encode Component", value: "encode", tag: "ENCODE" },
    { title: "URL Decode Component", value: "decode", tag: "DECODE" }
  ]);
  const input = await promptText("Enter URL or text string", "https://sopkit.space/tools?cat=image&page=1#top");
  if (!input) return;
  const t0 = performance.now();
  if (mode === "parse") {
    try {
      const parsed = parseUrl(input);
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
        ...paramRows.length > 0 ? paramRows : [`    ${c.dim}(none)${c.reset}`]
      ].join("\n");
      printCard("URL Breakdown", rows, `Parsed in ${duration}ms`, "URL-INSPECT");
    } catch (e) {
      console.log(`  ${c.red}Invalid URL:${c.reset} ${e.message}`);
    }
  } else if (mode === "encode") {
    const encoded = encodeUrl(input);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("URL Encoded", `${c.bold}${c.brightWhite}${encoded}${c.reset}`, `Encoded in ${duration}ms`, "URL-ENCODE");
  } else {
    const decoded = decodeUrl(input);
    const duration = (performance.now() - t0).toFixed(2);
    printCard("URL Decoded", `${c.bold}${c.brightWhite}${decoded}${c.reset}`, `Decoded in ${duration}ms`, "URL-DECODE");
  }
}
async function runBytes() {
  const input = await promptText("Enter byte amount or size string (e.g. 1048576, 500MB, 2.5GB)", "1048576");
  if (!input) return;
  const t0 = performance.now();
  try {
    const bytes = parseByteString(input);
    const b = formatBytes(bytes);
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
      `    Human: ${c.bold}${c.amber}${b.decimal.human}${c.reset}`
    ].join("\n");
    printCard("Data Size Conversions", rows, `Computed in ${duration}ms`, "BYTES");
  } catch (e) {
    console.log(`  ${c.red}Error:${c.reset} ${e.message}`);
  }
}
async function runHttp() {
  const code = await promptText("HTTP Status Code to lookup", "404");
  if (!code) return;
  const t0 = performance.now();
  const info = lookupStatus(code);
  const duration = (performance.now() - t0).toFixed(2);
  if (!info) {
    console.log(`  ${c.red}Unknown HTTP Status Code:${c.reset} ${code}`);
    return;
  }
  const badgeColor = info.code < 300 ? c.emerald : info.code < 400 ? c.cyan : info.code < 500 ? c.amber : c.red;
  const rows = [
    `  ${c.muted}Status:${c.reset}       ${badgeColor}${c.bold}${info.code} ${info.phrase}${c.reset}`,
    `  ${c.muted}Class:${c.reset}        ${c.brightWhite}${info.category}${c.reset}`,
    `  ${c.muted}Description:${c.reset}  ${c.muted}${info.description}${c.reset}`
  ].join("\n");
  printCard(`HTTP ${info.code}`, rows, `Retrieved in ${duration}ms`, "HTTP-STATUS");
}
async function runHtml() {
  const mode = await select("HTML Entity Operation:", [
    { title: `Escape HTML (encode <, >, &, ", ')`, value: "escape", tag: "ESCAPE" },
    { title: "Unescape HTML (decode entities)", value: "unescape", tag: "UNESCAPE" }
  ]);
  const text = await promptText("Enter text string", `<div class="container">&copy; SopKit</div>`);
  if (!text) return;
  const t0 = performance.now();
  const res = mode === "escape" ? escapeHtml(text) : unescapeHtml(text);
  const duration = (performance.now() - t0).toFixed(2);
  printCard("HTML Entity Result", `${c.bold}${c.brightWhite}${res}${c.reset}`, `Executed in ${duration}ms`, "HTML");
}
async function runHash() {
  const algo = await select("Select Hash Algorithm:", [
    { title: "SHA-256 (Secure, 256-bit)", value: "sha256", tag: "DEFAULT" },
    { title: "SHA-512 (Ultra-Secure, 512-bit)", value: "sha512", tag: "HIGH-ENTROPY" },
    { title: "MD5 (Legacy Fingerprint)", value: "md5", tag: "CHECKSUM" },
    { title: "SHA-1 (Legacy Git Object)", value: "sha1", tag: "LEGACY" }
  ]);
  const text = await promptText("Enter text to hash");
  if (!text) return;
  const t0 = performance.now();
  let result = "";
  if (algo === "sha256") result = await sha256(text);
  else if (algo === "sha512") result = await sha512(text);
  else if (algo === "md5") result = await md5(text);
  else if (algo === "sha1") result = await sha1(text);
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
      console.log(ver === "v1" ? v1() : v4());
    }
    return;
  }
  if (cmd === "timestamp" || cmd === "epoch") {
    const arg = args[1];
    if (!arg || arg === "now") {
      const nowInfo = now();
      console.log(`${nowInfo.seconds} (ms: ${nowInfo.milliseconds}) | ${nowInfo.iso}`);
    } else if (/^\d+$/.test(arg)) {
      const info = fromEpoch(arg);
      console.log(`${info.iso} (${info.relative})`);
    } else {
      const info = fromDateString(args.slice(1).join(" "));
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
    const all = convertAllCases(text);
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
      console.log(generateParagraphs(count));
    } else if (type.startsWith("sen")) {
      const sents = [];
      for (let i = 0; i < count; i++) sents.push(generateSentence());
      console.log(sents.join(" "));
    } else {
      console.log(generateWords(count));
    }
    return;
  }
  if (cmd === "url") {
    const sub = args[1]?.toLowerCase();
    const rest = args.slice(2).join(" ");
    if (sub === "encode") {
      console.log(encodeUrl(rest));
    } else if (sub === "decode") {
      console.log(decodeUrl(rest));
    } else {
      const target = rest || args[1] || "";
      const p = parseUrl(target);
      console.log(`Origin:   ${p.origin}`);
      console.log(`Path:     ${p.pathname}`);
      console.log(`Params:   ${JSON.stringify(p.params)}`);
    }
    return;
  }
  if (cmd === "bytes") {
    const raw = args.slice(1).join(" ");
    const b = formatBytes(parseByteString(raw));
    console.log(`Bytes: ${b.bytes.toLocaleString()} B | Binary: ${b.binary.human} | Decimal: ${b.decimal.human}`);
    return;
  }
  if (cmd === "http" || cmd === "status") {
    const code = args[1];
    const info = lookupStatus(code);
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
      console.log(unescapeHtml(str));
    } else {
      console.log(escapeHtml(str || args.slice(1).join(" ")));
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
  if (cmd === "validator") {
    const type = (args[1] || "email").toLowerCase();
    const val = args[2] || "";
    let ok = false;
    if (type === "email") ok = isEmail(val);
    else if (type === "url") ok = isUrl(val);
    else if (type === "ip") ok = isIp(val);
    console.log(ok ? "VALID" : "INVALID");
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