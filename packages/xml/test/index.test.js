import test from "node:test";
import assert from "node:assert";
import { validate, format, minify } from "../dist/index.js";

test("XML Utilities - validate", () => {
  assert.strictEqual(validate("<root><child id='1'>test</child></root>").valid, true);
  assert.strictEqual(validate("<root><child>test</root>").valid, false);
  assert.strictEqual(validate("").valid, false);
  assert.strictEqual(validate("<just-text>hello").valid, false);
});

test("XML Utilities - format", () => {
  const input = "<root><child>text</child></root>";
  const expected = "<root>\n  <child>text</child>\n</root>";
  assert.strictEqual(format(input, 2), expected);

  assert.throws(() => {
    format("<root><unbalanced>");
  });
});

test("XML Utilities - minify", () => {
  const input = "<root>\n  <child>text</child>\n</root>";
  const expected = "<root><child>text</child></root>";
  assert.strictEqual(minify(input), expected);
});
