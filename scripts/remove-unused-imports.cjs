#!/usr/bin/env node
/**
 * @file scripts/remove-unused-imports.cjs
 * @description Automatically removes all unused imports and fixes lintable patterns across the codebase.
 * Usage: npm run clean-imports or node scripts/remove-unused-imports.cjs
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🧹 Scanning codebase and removing unused imports...");

try {
  // Run eslint with --fix targeting TypeScript and TSX files in src/
  execSync('npx eslint "src/**/*.{ts,tsx}" --fix', {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, ESLINT_USE_FLAT_CONFIG: "true" }
  });
  console.log("\n✅ Successfully cleaned unused imports across src/**/*.{ts,tsx}");
} catch (error) {
  // ESLint exits with code 1 if there are remaining unfixable lint warnings/errors.
  // Many imports will have been automatically fixed and removed.
  console.log("\n⚠️ ESLint completed with some notices. Checking compilation...");
  try {
    execSync("npx tsc --noEmit", { stdio: "inherit", cwd: path.resolve(__dirname, "..") });
    console.log("✅ TypeScript typecheck passed cleanly with 0 errors!");
  } catch (tsErr) {
    console.error("❌ TypeScript errors detected after import cleanup:", tsErr.message);
    process.exit(1);
  }
}
