import test from "node:test";
import assert from "node:assert";
import { validate, format, minify } from "../dist/index.js";

test("JSON Utilities - validate", () => {
  assert.strictEqual(validate('{"a":1,"b":[true,false,null]}').valid, true);
  assert.strictEqual(validate("").valid, false);
  assert.strictEqual(validate('{"bad": }').valid, false);
  assert.ok(validate('{"bad": }').error !== undefined);
});

test("JSON Utilities - format", () => {
  const input = '{"a":1,"b":2}';
  const expected = '{\n  "a": 1,\n  "b": 2\n}';
  assert.strictEqual(format(input, { space: 2 }), expected);

  // Throws on invalid JSON
  assert.throws(() => {
    format('{"invalid": }');
  });
});

test("JSON Utilities - minify", () => {
  const input = '{\n  "a": 1,\n  "b": 2\n}';
  const expected = '{"a":1,"b":2}';
  assert.strictEqual(minify(input), expected);

  // Throws on invalid JSON
  assert.throws(() => {
    minify('{"invalid": }');
  });
});
