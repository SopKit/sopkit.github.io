/**
 * @file packages/cli/src/index.ts
 * @description Main entry point for @sopkit/cli supporting both interactive
 * TUI App mode (with mouse clicking & search) and direct scriptable CLI execution.
 */

import { SopKitApp } from "./app.js";
import * as tools from "./tools/index.js";
import { c } from "./ui/theme.js";

async function main() {
  const args = process.argv.slice(2);

  // If no arguments, launch the interactive TUI app
  if (args.length === 0) {
    const app = new SopKitApp();
    await app.start();
    return;
  }

  const cmd = args[0].toLowerCase();

  // 1. PDF CLI Commands
  if (cmd === "pdf") {
    const sub = args[1]?.toLowerCase();
    if (sub === "info") {
      const file = args[2];
      if (!file) {
        console.error(`${c.red}Usage: sopkit pdf info <file.pdf>${c.reset}`);
        process.exit(1);
      }
      const info = tools.pdf.inspectPdf(file);
      console.log(JSON.stringify(info, null, 2));
      return;
    }
    if (sub === "merge") {
      const outIdx = args.indexOf("-o") !== -1 ? args.indexOf("-o") : args.indexOf("--output");
      let outPath = "merged.pdf";
      let files = args.slice(2);
      if (outIdx !== -1) {
        outPath = args[outIdx + 1] || "merged.pdf";
        files = args.slice(2, outIdx);
      }
      const res = tools.pdf.mergePdfs(files, outPath);
      console.log(`Successfully merged ${files.length} PDFs into ${res.outputPath}`);
      return;
    }
  }

  // 2. Image CLI Commands
  if (cmd === "image" || cmd === "img") {
    const sub = args[1]?.toLowerCase();
    if (sub === "info") {
      const file = args[2];
      const info = tools.image.inspectImage(file);
      console.log(JSON.stringify(info, null, 2));
      return;
    }
    if (sub === "ascii") {
      const file = args[2];
      const cols = parseInt(args[3] || "50", 10);
      console.log(tools.image.generateAsciiArt(file, cols));
      return;
    }
  }

  // 3. Background Remover CLI Command
  if (cmd === "bg-remover" || cmd === "remove-bg") {
    const inputPath = args[1];
    const outputPath = args[2];
    if (!inputPath) {
      console.error(`${c.red}Usage: sopkit bg-remover <input.png> [output.png] [--color #ffffff] [--tolerance 25]${c.reset}`);
      process.exit(1);
    }
    const colorIdx = args.indexOf("--color");
    const targetColor = colorIdx !== -1 ? args[colorIdx + 1] : "auto";
    const tolIdx = args.indexOf("--tolerance");
    const tolerance = tolIdx !== -1 ? parseInt(args[tolIdx + 1], 10) : 25;

    const res = tools.bgRemover.removeBackground({
      inputPath,
      outputPath,
      targetColor,
      tolerance,
    });
    console.log(`Saved transparent image to: ${res.outputPath} (Removed: ${res.colorRemoved})`);
    return;
  }

  // 4. JSON CLI Commands
  if (cmd === "json") {
    const sub = args[1]?.toLowerCase();
    const rest = args.slice(2).join(" ");
    let text = rest;
    const fs = await import("node:fs");
    if (rest && fs.existsSync(rest)) {
      text = fs.readFileSync(rest, "utf8");
    }

    if (sub === "format" || sub === "pretty") {
      console.log(tools.jsonTool.formatJsonHighlighted(text));
      return;
    }
    if (sub === "minify") {
      console.log(tools.jsonTool.minifyJson(text));
      return;
    }
    if (sub === "validate") {
      const val = tools.jsonTool.validateJson(text);
      if (val.valid) console.log(`${c.emerald}VALID JSON${c.reset}`);
      else console.error(`${c.red}INVALID JSON: ${val.error}${c.reset}`);
      return;
    }
    if (sub === "ts" || sub === "typescript") {
      console.log(tools.jsonTool.jsonToTypeScript(text));
      return;
    }
    if (sub === "query") {
      const q = args[2];
      const jsonRaw = args.slice(3).join(" ");
      console.log(JSON.stringify(tools.jsonTool.queryJson(jsonRaw, q), null, 2));
      return;
    }
  }

  // 5. Crypto Hash Commands
  if (cmd === "hash") {
    const algo = args[1]?.toLowerCase() || "sha256";
    const text = args.slice(2).join(" ");
    if (algo === "sha512") console.log(await tools.hash.sha512(text));
    else if (algo === "md5") console.log(tools.hash.md5(text));
    else if (algo === "sha1") console.log(await tools.hash.sha1(text));
    else console.log(await tools.hash.sha256(text));
    return;
  }

  // 6. Base64
  if (cmd === "base64") {
    const sub = args[1]?.toLowerCase();
    const text = args.slice(2).join(" ");
    if (sub === "decode") console.log(tools.base64.decode(text));
    else console.log(tools.base64.encode(text));
    return;
  }

  // 7. UUID
  if (cmd === "uuid") {
    console.log(tools.uuid.v4());
    return;
  }

  // 8. Password
  if (cmd === "password") {
    const len = parseInt(args[1] || "20", 10);
    console.log(tools.password.generate({ length: len }));
    return;
  }

  // 9. Slug
  if (cmd === "slug") {
    console.log(tools.slug.slugify(args.slice(1).join(" ")));
    return;
  }

  // 10. Color
  if (cmd === "color") {
    const col = args[1] || "#06b6d4";
    const rgbVal = tools.color.hexToRgb(col);
    const hslVal = tools.color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    console.log(`HEX: ${col} | RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}) | HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    return;
  }

  // 11. Help / Fallback
  if (cmd === "--help" || cmd === "-h") {
    console.log(`
${c.bold}${c.cyan}SopKit CLI v1.2.0${c.reset} — Privacy-First Developer Utility Suite

${c.bold}USAGE:${c.reset}
  sopkit                        ${c.dim}# Launch interactive TUI app (supports mouse click & search)${c.reset}
  sopkit pdf info <file>        ${c.dim}# Inspect PDF page count and metadata${c.reset}
  sopkit pdf merge <files...>   ${c.dim}# Merge multiple PDFs${c.reset}
  sopkit img info <file>        ${c.dim}# Inspect image dimensions and format${c.reset}
  sopkit img ascii <file>       ${c.dim}# Generate colored terminal ASCII art${c.reset}
  sopkit bg-remover <in> [out]  ${c.dim}# Remove background to transparent PNG${c.reset}
  sopkit json format <input>    ${c.dim}# Beautify with TrueColor syntax highlighting${c.reset}
  sopkit json ts <input>        ${c.dim}# Generate TypeScript interfaces${c.reset}
  sopkit hash sha256 <text>     ${c.dim}# Generate SHA-256 digest${c.reset}
  sopkit base64 encode <text>   ${c.dim}# Base64 encoder${c.reset}
  sopkit uuid                   ${c.dim}# Generate UUID v4${c.reset}
  sopkit password [len]         ${c.dim}# High-entropy password generator${c.reset}

${c.dim}Visit https://sopkit.space for 600+ web developer utilities.${c.reset}
`);
    return;
  }

  console.log(`${c.red}Unknown command: ${cmd}${c.reset}. Run ${c.cyan}sopkit --help${c.reset} for options.`);
}

main().catch((err) => {
  console.error(`\n${c.red}Error:${c.reset} ${err.message}\n`);
  process.exit(1);
});
