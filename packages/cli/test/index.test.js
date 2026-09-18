import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.resolve(__dirname, "../dist/index.cjs");

test("@sopkit/cli standalone execution suite", async (t) => {
  await t.test("executes --help cleanly without error", () => {
    const out = execSync(`node ${cliPath} --help`).toString();
    assert.match(out, /SopKit CLI/);
    assert.match(out, /sopkit uuid/);
    assert.match(out, /sopkit pdf/);
    assert.match(out, /sopkit bg-remover/);
  });

  await t.test("generates valid uuid v4", () => {
    const out = execSync(`node ${cliPath} uuid`).toString().trim();
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

  await t.test("formats and validates json", () => {
    const out = execSync(`node ${cliPath} json validate '{"valid":true,"count":10}'`).toString().trim();
    assert.match(out, /VALID JSON/);
  });

  await t.test("converts json to typescript", () => {
    const out = execSync(`node ${cliPath} json ts '{"id":"test","active":true,"score":99}'`).toString().trim();
    assert.match(out, /export interface RootObject/);
    assert.match(out, /id: string;/);
    assert.match(out, /active: boolean;/);
    assert.match(out, /score: number;/);
  });

  await t.test("executes background remover", () => {
    const testFile = path.resolve(__dirname, "test-pixel.png");
    // Create minimal 1x1 PNG
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testFile, pngHeader);

    const outPath = path.resolve(__dirname, "test-pixel-transparent.png");
    const out = execSync(`node ${cliPath} bg-remover "${testFile}" "${outPath}"`).toString();
    assert.match(out, /Saved transparent image/);
    assert.ok(fs.existsSync(outPath));

    // Cleanup
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });
});
