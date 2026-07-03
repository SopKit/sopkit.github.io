import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = [
  "base64",
  "uuid",
  "slug",
  "json",
  "color",
  "validator",
  "password",
  "cli"
];

async function main() {
  console.log("🚀 Starting SopKit NPM Ecosystem Publisher...\n");

  // 1. Verify NPM Login
  try {
    const whoami = execSync("npm whoami", { stdio: "pipe" }).toString().trim();
    console.log(`✅ Logged into NPM as: ${whoami}`);
  } catch (err) {
    console.error("❌ Error: You are not logged into NPM. Please run 'npm login' first, then run this script again.");
    process.exit(1);
  }

  // 2. Build and Publish each package
  for (const pkg of packages) {
    const pkgPath = path.resolve(__dirname, "../packages", pkg);
    console.log(`\n--- Processing Package: @sopkit/${pkg} ---`);

    const pkgJsonPath = path.resolve(pkgPath, "package.json");
    let pkgJson;
    try {
      pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    } catch (err) {
      console.error(`❌ Failed to read package.json for @sopkit/${pkg}: ${err.message}`);
      process.exit(1);
    }

    const version = pkgJson.version;
    const name = pkgJson.name;

    // Check registry
    let isAlreadyPublished = false;
    try {
      execSync(`npm view ${name}@${version} version`, { stdio: "pipe" });
      isAlreadyPublished = true;
    } catch (err) {
      // 404/not found indicates it is not published yet
    }

    if (isAlreadyPublished) {
      console.log(`⚠️  ${name}@${version} is already published. Skipping...`);
      continue;
    }

    // Run build
    console.log(`📦 Building @sopkit/${pkg}...`);
    try {
      execSync("npm run build", { cwd: pkgPath, stdio: "inherit" });
      console.log(`✅ Build succeeded for @sopkit/${pkg}`);
    } catch (err) {
      console.error(`❌ Build failed for @sopkit/${pkg}`);
      process.exit(1);
    }

    // Run publish
    console.log(`🚀 Publishing @sopkit/${pkg} to npm...`);
    try {
      execSync("npm publish --access public", { cwd: pkgPath, stdio: "inherit" });
      console.log(`✅ Published @sopkit/${pkg} successfully!`);
    } catch (err) {
      console.error(`❌ Publishing failed for @sopkit/${pkg}. Verify version or permissions.`);
      process.exit(1);
    }
  }

  console.log("\n🎉 All new/updated packages published successfully to the NPM registry!");
}

main().catch((err) => {
  console.error("💥 Uncaught publisher error:", err);
  process.exit(1);
});
