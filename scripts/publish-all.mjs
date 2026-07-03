import { execSync } from "node:child_process";
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

  console.log("\n🎉 All packages published successfully to the NPM registry!");
}

main().catch((err) => {
  console.error("💥 Uncaught publisher error:", err);
  process.exit(1);
});
