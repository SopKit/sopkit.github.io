// src/index.ts
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
function isValid(input) {
  if (typeof input !== "string" || input.trim() === "") {
    return false;
  }
  const base64Regex = /^[A-Za-z0-9+/_-]*={0,2}$/;
  if (!base64Regex.test(input)) {
    return false;
  }
  try {
    const sanitized = input.replace(/-/g, "+").replace(/_/g, "/");
    atob(sanitized);
    return true;
  } catch {
    return false;
  }
}
export {
  decode,
  encode,
  isValid,
  urlDecode,
  urlEncode
};
//# sourceMappingURL=index.js.map