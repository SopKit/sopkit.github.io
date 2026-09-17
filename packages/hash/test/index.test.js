import test from "node:test";
import assert from "node:assert";
import { sha256, sha512, sha1, md5, hmacSha256, compareHash, bufferToHex, hexToBuffer } from "../dist/index.js";

test("Hash Utilities - SHA-256 computation", async () => {
  const hash = await sha256("hello world");
  assert.strictEqual(hash, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");

  const emptyHash = await sha256("");
  assert.strictEqual(emptyHash, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("Hash Utilities - SHA-512 computation", async () => {
  const hash = await sha512("hello world");
  assert.strictEqual(
    hash,
    "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
  );
});

test("Hash Utilities - SHA-1 computation", async () => {
  const hash = await sha1("hello world");
  assert.strictEqual(hash, "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
});

test("Hash Utilities - MD5 synchronous computation", () => {
  assert.strictEqual(md5("hello world"), "5eb63bbbe01eeed093cb22bb8f5acdc3");
  assert.strictEqual(md5(""), "d41d8cd98f00b204e9800998ecf8427e");
  // Test Unicode / Emoji support
  assert.strictEqual(md5("SopKit 🚀"), "41e43a64dc62bd07bfe79d0f65a27782");
});

test("Hash Utilities - HMAC-SHA256 signature", async () => {
  const hmac = await hmacSha256("secret-key", "message to verify");
  assert.strictEqual(typeof hmac, "string");
  assert.strictEqual(hmac.length, 64);
});

test("Hash Utilities - Constant-time comparison", () => {
  assert.strictEqual(compareHash("abcdef", "abcdef"), true);
  assert.strictEqual(compareHash("abcdef", "abcdeg"), false);
  assert.strictEqual(compareHash("abcdef", "abcde"), false);
});

test("Hash Utilities - Hex and Buffer conversions", () => {
  const hex = "deadbeef";
  const buf = hexToBuffer(hex);
  assert.strictEqual(bufferToHex(buf), hex);
});
