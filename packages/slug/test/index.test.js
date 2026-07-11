import test from "node:test";
import assert from "node:assert";
import { slugify, isValid } from "../dist/index.js";

test("Slug Utilities - slugify texts and normalize accents", () => {
  assert.strictEqual(slugify("Hello World"), "hello-world");
  assert.strictEqual(slugify("Café au lait & Croissant"), "cafe-au-lait-croissant");
  
  // Lowercase = false option
  assert.strictEqual(slugify("Hello World", { lowercase: false }), "Hello-World");
  
  // Custom separator option
  assert.strictEqual(slugify("Hello World", { separator: "_" }), "hello_world");
});

test("Slug Utilities - validation check", () => {
  assert.strictEqual(isValid("hello-world"), true);
  assert.strictEqual(isValid("hello_world", "_"), true);
  assert.strictEqual(isValid("Hello-World"), true); // validation is case-insensitive by default in the library
  assert.strictEqual(isValid("hello world"), false);
  assert.strictEqual(isValid(""), false);
});
