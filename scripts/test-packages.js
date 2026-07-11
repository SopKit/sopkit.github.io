import { exec } from "node:child_process";
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
  "xml",
  "jwt"
];

// Helper to run a command in a directory as a Promise
function runCmd(cmd, cwd) {
  return new Promise((resolve) => {
    const start = performance.now();
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      const duration = (performance.now() - start).toFixed(0);
      if (error) {
        resolve({ success: false, error: stderr || stdout || error.message, duration });
      } else {
        resolve({ success: true, duration });
      }
    });
  });
}

async function main() {
  console.log("🛠️  SopKit Package Verification Engine starting...\n");
  const overallStart = performance.now();

  // 1. Parallel compilation using tsup (which runs super fast using esbuild)
  console.log("📦 Compiling all packages in parallel...");
  const buildPromises = packages.map(async (pkg) => {
    const pkgPath = path.resolve(__dirname, "../packages", pkg);
    const result = await runCmd("npm run build", pkgPath);
    return { pkg, type: "Build", ...result };
  });

  const buildResults = await Promise.all(buildPromises);

  // Print build results
  let buildsFailed = false;
  console.log("\nBuild Status Table:");
  console.log("-----------------------------------------");
  for (const res of buildResults) {
    const status = res.success ? "✅ SUCCESS" : "❌ FAILED";
    console.log(`@sopkit/${res.pkg.padEnd(10)} | ${status.padEnd(10)} | ${res.duration}ms`);
    if (!res.success) {
      buildsFailed = true;
      console.error(`Error details for @sopkit/${res.pkg}:\n${res.error}\n`);
    }
  }
  console.log("-----------------------------------------");

  if (buildsFailed) {
    console.error("\n❌ Compilation failed on one or more packages. Aborting tests.");
    process.exit(1);
  }

  // 2. Parallel test executions using native Node.js runner
  console.log("\n🧪 Executing native Node.js tests in parallel...");
  const testPromises = packages.map(async (pkg) => {
    const pkgPath = path.resolve(__dirname, "../packages", pkg);
    const result = await runCmd("node --test test/index.test.js", pkgPath);
    return { pkg, type: "Test", ...result };
  });

  const testResults = await Promise.all(testPromises);

  // Print test results
  let testsFailed = false;
  console.log("\nTest Verification Table:");
  console.log("-----------------------------------------");
  for (const res of testResults) {
    const status = res.success ? "✅ PASSED" : "❌ FAILED";
    console.log(`@sopkit/${res.pkg.padEnd(10)} | ${status.padEnd(10)} | ${res.duration}ms`);
    if (!res.success) {
      testsFailed = true;
      console.error(`Error details for @sopkit/${res.pkg}:\n${res.error}\n`);
    }
  }
  console.log("-----------------------------------------");

  const overallDuration = ((performance.now() - overallStart) / 1000).toFixed(2);
  if (testsFailed) {
    console.error(`\n❌ Failed tests. Verification complete in ${overallDuration}s.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 All packages compiled and verified successfully in ${overallDuration}s!`);
  }
}

main().catch((err) => {
  console.error("💥 Runner error:", err);
  process.exit(1);
});
