import test from "node:test";
import assert from "node:assert";
import { generate, analyze } from "../dist/index.js";

test("Password Utilities - generate options", () => {
  const p1 = generate({ length: 16 });
  assert.strictEqual(p1.length, 16);

  const p2 = generate({ length: 8, numbers: false, symbols: false });
  assert.strictEqual(p2.length, 8);
  assert.ok(!/[0-9]/.test(p2));
  assert.ok(!/[^a-zA-Z0-9]/.test(p2));
});

test("Password Utilities - analyze strength", () => {
  const weak = analyze("123");
  assert.ok(weak.score <= 1);
  assert.strictEqual(weak.label, "very-weak");

  const strong = analyze("P@ssw0rd2026_Secure!");
  assert.ok(strong.score >= 3);
  assert.ok(strong.entropy > 50);
});
