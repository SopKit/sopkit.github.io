import test from "node:test";
import assert from "node:assert";
import { encode, decode, urlEncode, urlDecode, isValid } from "../dist/index.js";

test("Base64 Utilities - encode and decode standard and Unicode strings", () => {
  assert.strictEqual(encode("Hello World"), "SGVsbG8gV29ybGQ=");
  assert.strictEqual(decode("SGVsbG8gV29ybGQ="), "Hello World");

  // UTF-8 Unicode characters (emojis, etc.)
  assert.strictEqual(encode("SopKit 🚀"), "U29wS2l0IPCfmoA=");
  assert.strictEqual(decode("U29wS2l0IPCfmoA="), "SopKit 🚀");
});

test("Base64 Utilities - URL-safe encoding and decoding", () => {
  const sample = "Subjects: coding, databases, API & systems / apps";
  // urlEncode replaces '+' with '-', '/' with '_', and strips '='
  const encoded = urlEncode(sample);
  assert.ok(!encoded.includes("+"));
  assert.ok(!encoded.includes("/"));
  assert.ok(!encoded.includes("="));
  
  assert.strictEqual(urlDecode(encoded), sample);
});

test("Base64 Utilities - validation", () => {
  assert.strictEqual(isValid("U29wS2l0IPCfmog="), true);
  assert.strictEqual(isValid("invalid-base64-string!@#"), false);
  assert.strictEqual(isValid(""), false);
});
