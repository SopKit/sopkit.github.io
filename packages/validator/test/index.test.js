import test from "node:test";
import assert from "node:assert";
import { isEmail, isUrl, isDomain, isIp, isMacAddress, isCreditCard } from "../dist/index.js";

test("Validator Utilities - isEmail", () => {
  assert.strictEqual(isEmail("support@sopkit.com"), true);
  assert.strictEqual(isEmail("john.doe@company.co.uk"), true);
  assert.strictEqual(isEmail("invalid-email"), false);
  assert.strictEqual(isEmail("@domain.com"), false);
});

test("Validator Utilities - isUrl", () => {
  assert.strictEqual(isUrl("https://sopkit.github.io/"), true);
  assert.strictEqual(isUrl("http://localhost:3000/app"), true);
  assert.strictEqual(isUrl("ftp://files.example.com"), true);
  assert.strictEqual(isUrl("just-a-string"), false);
});

test("Validator Utilities - isDomain", () => {
  assert.strictEqual(isDomain("sopkit.github.io"), true);
  assert.strictEqual(isDomain("google.co.in"), true);
  assert.strictEqual(isDomain("localhost"), false); // expects a TLD
  assert.strictEqual(isDomain("http://sopkit.com"), false);
});

test("Validator Utilities - isIp", () => {
  assert.strictEqual(isIp("192.168.1.1"), true);
  assert.strictEqual(isIp("256.0.0.1"), false); // invalid octet
  assert.strictEqual(isIp("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), true); // IPv6
});

test("Validator Utilities - isMacAddress", () => {
  assert.strictEqual(isMacAddress("00:1A:2B:3C:4D:5E"), true);
  assert.strictEqual(isMacAddress("00-1a-2b-3c-4d-5e"), true);
  assert.strictEqual(isMacAddress("001A2B3C4D5E"), false);
});

test("Validator Utilities - isCreditCard", () => {
  // Classic Luhn-valid card number (16-digit Visa)
  assert.strictEqual(isCreditCard("4111111111111111"), true);
  // Luhn-invalid
  assert.strictEqual(isCreditCard("4111111111111112"), false);
});
