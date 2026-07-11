import test from "node:test";
import assert from "node:assert";
import { v4, v1, validate, getVersion } from "../dist/index.js";

test("UUID Utilities - v4 and v1 generation", () => {
  const id4 = v4();
  const id1 = v1();

  assert.strictEqual(id4.length, 36);
  assert.strictEqual(id1.length, 36);

  // Validate format
  assert.ok(validate(id4));
  assert.ok(validate(id1));

  // Verify version bytes
  assert.strictEqual(getVersion(id4), 4);
  assert.strictEqual(getVersion(id1), 1);
});

test("UUID Utilities - validation and edge cases", () => {
  assert.strictEqual(validate("f81d4fae-7dec-11d0-a765-00a0c91e6bf6"), true);
  assert.strictEqual(validate("invalid-uuid-string-here"), false);
  assert.strictEqual(validate(""), false);
  
  assert.strictEqual(getVersion("invalid-uuid"), null);
});
