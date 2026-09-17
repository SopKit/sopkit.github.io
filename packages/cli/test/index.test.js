import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.resolve(__dirname, "../dist/index.cjs");

test("@sopkit/cli standalone execution suite", async (t) => {
  await t.test("executes --help cleanly without error", () => {
    const out = execSync(`node ${cliPath} --help`).toString();
    assert.match(out, /S O P K I T/);
    assert.match(out, /sopkit uuid/);
  });

  await t.test("generates valid uuid v4", () => {
    const out = execSync(`node ${cliPath} uuid v4`).toString().trim();
    assert.match(out, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  await t.test("encodes and decodes base64", () => {
    const encoded = execSync(`node ${cliPath} base64 encode "Hello SopKit"`).toString().trim();
    assert.equal(encoded, "SGVsbG8gU29wS2l0");
    const decoded = execSync(`node ${cliPath} base64 decode "${encoded}"`).toString().trim();
    assert.equal(decoded, "Hello SopKit");
  });

  await t.test("computes sha256 hash", () => {
    const hash = execSync(`node ${cliPath} hash sha256 "SopKit"`).toString().trim();
    assert.equal(hash, "1fb50d7e92cf20536cf887d4081c333472d6e289e37188a464d6e06a3f31d4c9");
  });

  await t.test("generates url slug", () => {
    const slug = execSync(`node ${cliPath} slug "Love Calculator Story Share"`).toString().trim();
    assert.equal(slug, "love-calculator-story-share");
  });

  await t.test("converts colors", () => {
    const out = execSync(`node ${cliPath} color "#10b981"`).toString().trim();
    assert.match(out, /HEX: #10b981/);
    assert.match(out, /RGB: rgb\(16, 185, 129\)/);
  });
});
