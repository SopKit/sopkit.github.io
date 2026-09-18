/**
 * @file packages/cli/src/app.ts
 * @description Modern interactive TUI Application Controller with full mouse clicking,
 * scroll wheel tracking, real-time tool search bar, and OpenCode-inspired modular structure.
 */

import readline from "node:readline";
import { Terminal } from "./core/terminal.js";
import { parseInputChunk, InputEvent } from "./core/events.js";
import { HitManager } from "./core/hit-box.js";
import { c, gradient, badge, GRADIENT_CYBERPUNK } from "./ui/theme.js";
import { renderSearchBar } from "./ui/search-bar.js";
import { renderToolList, ToolItem } from "./ui/tool-list.js";
import { printCard, printColorCard, printPasswordCard } from "./ui/card.js";
import * as tools from "./tools/index.js";

export const TOOL_REGISTRY: ToolItem[] = [
  { id: "pdf", title: "📄  PDF Inspector & Merge", value: "pdf", desc: "Page count, metadata, merge PDFs", tag: "DOCUMENT", shortcut: "1" },
  { id: "image", title: "🖼️   Image Inspector & ASCII", value: "image", desc: "Dimensions, format, terminal ASCII", tag: "MEDIA", shortcut: "2" },
  { id: "bg-remover", title: "✂️   Background Remover", value: "bg-remover", desc: "Alpha transparency & color keying", tag: "IMAGE", shortcut: "3" },
  { id: "json", title: "✨  JSON Workbench", value: "json", desc: "Format, validate, minify, TypeScript", tag: "FORMAT", shortcut: "4" },
  { id: "hash", title: "🔑  Hash Generator", value: "hash", desc: "SHA-256, SHA-512, MD5, HMAC", tag: "CRYPTO", shortcut: "5" },
  { id: "base64", title: "📦  Base64 Engine", value: "base64", desc: "Encode, Decode, URL-safe", tag: "ENCODE", shortcut: "6" },
  { id: "uuid", title: "🆔  UUID Generator", value: "uuid", desc: "v4 Random, v1 Timestamp", tag: "IDENT", shortcut: "7" },
  { id: "color", title: "🎨  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "8" },
  { id: "password", title: "🔒  Password Generator", value: "password", desc: "High-entropy with visual meter", tag: "SECURITY", shortcut: "9" },
  { id: "jwt", title: "🛡️   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "0" },
  { id: "case", title: "🔤  Text Case Converter", value: "case", desc: "camel, snake, kebab, CONSTANT", tag: "TEXT", shortcut: "c" },
  { id: "slug", title: "🔗  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "s" },
  { id: "timestamp", title: "🕒  Timestamp / Epoch", value: "timestamp", desc: "Unix epoch, ISO, Relative time", tag: "DATE", shortcut: "t" },
  { id: "url", title: "🌐  URL Inspector & Parser", value: "url", desc: "Parse parameters, encode, decode", tag: "NET", shortcut: "u" },
  { id: "bytes", title: "💾  Byte Size Converter", value: "bytes", desc: "B, KB, MB, GB, TB conversion", tag: "DATA", shortcut: "b" },
  { id: "http", title: "📡  HTTP Status Codes", value: "http", desc: "RFC codes lookup & description", tag: "HTTP", shortcut: "h" },
  { id: "xml", title: "📜  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "x" },
  { id: "validator", title: "✅  Data Validator", value: "validator", desc: "Email, URL, IP, UUID validation", tag: "CHECK", shortcut: "v" },
  { id: "lorem", title: "📝  Lorem Ipsum Generator", value: "lorem", desc: "Words, sentences, paragraphs", tag: "MOCK", shortcut: "l" },
  { id: "html", title: "🔣  HTML Entity Escape", value: "html", desc: "Encode / decode HTML entities", tag: "HTML", shortcut: "e" },
  { id: "exit", title: "🚪  Exit", value: "exit", desc: "Return to shell", tag: "QUIT", shortcut: "q" },
];

export class SopKitApp {
  private searchQuery = "";
  private isSearchFocused = false;
  private selectedIndex = 0;
  private scrollOffset = 0;
  private isRunning = true;
  private isToolExecuting = false;
  private hitManager = new HitManager();

  public async start(): Promise<void> {
    if (!process.stdin.isTTY) {
      console.log(`${c.red}SopKit interactive mode requires an interactive TTY terminal.${c.reset}`);
      return;
    }

    Terminal.enterRawMode();
    Terminal.enableMouse();
    Terminal.hideCursor();

    const onResize = () => this.render();
    process.stdout.on("resize", onResize);

    const onData = async (chunk: Buffer | string) => {
      if (this.isToolExecuting) return;
      const str = typeof chunk === "string" ? chunk : chunk.toString("utf8");
      const events = parseInputChunk(str);
      for (const ev of events) {
        await this.handleInput(ev);
      }
    };

    process.stdin.on("data", onData);

    // Initial draw
    this.render();

    // Clean exit listener
    const cleanup = () => {
      Terminal.restore();
      process.stdout.removeListener("resize", onResize);
      process.stdin.removeListener("data", onData);
    };

    process.on("exit", cleanup);
    process.on("SIGINT", () => {
      cleanup();
      process.exit(0);
    });
  }

  private getFilteredTools(): ToolItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return TOOL_REGISTRY;
    return TOOL_REGISTRY.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.value.toLowerCase().includes(q)
    );
  }

  private render(): void {
    if (this.isToolExecuting) return;

    this.hitManager.clear();
    const stdout = process.stdout;
    const filtered = this.getFilteredTools();

    // Keep selected index in bounds
    if (this.selectedIndex >= filtered.length) {
      this.selectedIndex = Math.max(0, filtered.length - 1);
    }

    let output = "\x1b[H\x1b[2J"; // Home and clear screen

    // 1. Hero Banner
    const asciiBanner = [
      "  ███████╗  ██████╗  ██████╗  ██╗  ██╗ ██╗ ████████╗",
      "  ██╔════╝ ██╔═══██╗ ██╔══██╗ ██║ ██╔╝ ██║ ╚══██╔══╝",
      "  ███████╗ ██║   ██║ ██████╔╝ █████╔╝  ██║    ██║   ",
      "  ╚════██║ ██║   ██║ ██╔═══╝  ██╔═██╗  ██║    ██║   ",
      "  ███████║ ╚██████╔╝ ██║      ██║  ██╗ ██║    ██║   ",
      "  ╚══════╝  ╚═════╝  ╚═╝      ╚═╝  ╚═╝ ╚═╝    ╚═╝   ",
    ];

    output += "\n";
    for (const line of asciiBanner) {
      output += gradient(line, GRADIENT_CYBERPUNK) + "\n";
    }

    const b1 = badge("600+ Web Tools", [99, 102, 241]);
    const b2 = badge("100% Client-Side Private", [16, 185, 129]);
    const b3 = badge("v1.2.0 • Mouse App Mode", [6, 182, 212]);
    const url = `${c.dim}https://${c.reset}${c.bold}${c.cyan}sopkit.space${c.reset}`;
    output += `\n  ${c.bold}${c.white}S O P K I T${c.reset}  ${c.dim}— Terminal App Suite (Click or Navigate)${c.reset}\n`;
    output += `  ${b1}  ${b2}  ${b3}  ${url}\n\n`;

    // 2. Interactive Search Bar (Line ~12)
    const searchLineNumber = 12;
    output +=
      renderSearchBar({
        query: this.searchQuery,
        isFocused: this.isSearchFocused,
        row: searchLineNumber,
        width: 58,
        hitManager: this.hitManager,
        onFocus: () => {
          this.isSearchFocused = true;
          this.render();
        },
      }) + "\n\n";

    // 3. Scrollable Tool List (Line ~14+)
    const listStartRow = 14;
    const maxVisible = Math.min(filtered.length, 12);
    const { lines } = renderToolList({
      tools: filtered,
      selectedIndex: this.selectedIndex,
      startRow: listStartRow,
      maxVisible,
      scrollOffset: this.scrollOffset,
      hitManager: this.hitManager,
      onSelect: (idx) => {
        this.selectedIndex = idx;
        this.render();
      },
      onActivate: (tool) => {
        this.launchTool(tool);
      },
    });

    output += lines.join("\n") + "\n\n";

    // 4. Footer Cheatsheet & Mouse Hint
    const mouseStatus = `${c.emerald}🖱️ Mouse Enabled: Click any tool or search bar${c.reset}`;
    const keyboardHelp = `${c.muted}↑/↓ Move • Enter Select • / Search • Esc Clear • q Exit${c.reset}`;
    output += `  ${c.darkGray}─ ${mouseStatus} • ${keyboardHelp} ─${c.reset}\n`;

    stdout.write(output);
  }

  private async handleInput(ev: InputEvent): Promise<void> {
    if (ev.type === "mouse") {
      if (ev.isWheelUp) {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
          if (this.selectedIndex < this.scrollOffset) {
            this.scrollOffset = this.selectedIndex;
          }
          this.render();
        }
        return;
      }

      if (ev.isWheelDown) {
        const filtered = this.getFilteredTools();
        if (this.selectedIndex < filtered.length - 1) {
          this.selectedIndex++;
          if (this.selectedIndex >= this.scrollOffset + 12) {
            this.scrollOffset = this.selectedIndex - 11;
          }
          this.render();
        }
        return;
      }

      if (ev.isLeftClick) {
        const hit = this.hitManager.find(ev.col, ev.row);
        if (hit && hit.onClick) {
          hit.onClick();
        }
        return;
      }
    }

    if (ev.type === "key") {
      if (ev.name === "ctrl_c") {
        Terminal.restore();
        process.exit(0);
      }

      // Search bar editing
      if (this.isSearchFocused) {
        if (ev.name === "escape") {
          this.isSearchFocused = false;
          this.render();
          return;
        }
        if (ev.name === "enter") {
          this.isSearchFocused = false;
          const filtered = this.getFilteredTools();
          if (filtered.length > 0) {
            await this.launchTool(filtered[this.selectedIndex]);
          }
          return;
        }
        if (ev.name === "backspace") {
          this.searchQuery = this.searchQuery.slice(0, -1);
          this.selectedIndex = 0;
          this.render();
          return;
        }
        if (ev.name === "tab") {
          this.isSearchFocused = false;
          this.render();
          return;
        }
        if (ev.name === "char" && ev.char) {
          this.searchQuery += ev.char;
          this.selectedIndex = 0;
          this.render();
          return;
        }
      }

      // Main Navigation Mode
      if (ev.name === "escape") {
        if (this.searchQuery) {
          this.searchQuery = "";
          this.render();
          return;
        }
        Terminal.restore();
        process.exit(0);
      }

      if (ev.name === "up") {
        const filtered = this.getFilteredTools();
        if (filtered.length > 0) {
          this.selectedIndex = (this.selectedIndex - 1 + filtered.length) % filtered.length;
          this.render();
        }
        return;
      }

      if (ev.name === "down") {
        const filtered = this.getFilteredTools();
        if (filtered.length > 0) {
          this.selectedIndex = (this.selectedIndex + 1) % filtered.length;
          this.render();
        }
        return;
      }

      if (ev.name === "enter") {
        const filtered = this.getFilteredTools();
        if (filtered.length > 0) {
          await this.launchTool(filtered[this.selectedIndex]);
        }
        return;
      }

      if (ev.name === "tab" || (ev.name === "char" && ev.char === "/")) {
        this.isSearchFocused = true;
        this.render();
        return;
      }

      if (ev.name === "char") {
        if (ev.char === "q" || ev.char === "Q") {
          Terminal.restore();
          console.log(`\n  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}\n`);
          process.exit(0);
        }

        // Quick numeric shortcut (1-9, 0)
        const num = parseInt(ev.char || "", 10);
        const filtered = this.getFilteredTools();
        if (!isNaN(num)) {
          const targetIdx = num === 0 ? 9 : num - 1;
          if (targetIdx < filtered.length) {
            await this.launchTool(filtered[targetIdx]);
            return;
          }
        }
      }
    }
  }

  private async launchTool(tool: ToolItem): Promise<void> {
    if (tool.value === "exit") {
      Terminal.restore();
      console.log(`\n  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}\n`);
      process.exit(0);
    }

    this.isToolExecuting = true;
    Terminal.leaveRawMode();
    Terminal.disableMouse();
    Terminal.showCursor();

    console.log(`\n${c.cyan}Launching ${tool.title}...${c.reset}\n`);

    try {
      switch (tool.value) {
        case "pdf":
          await this.runPdfTool();
          break;
        case "image":
          await this.runImageTool();
          break;
        case "bg-remover":
          await this.runBgRemoverTool();
          break;
        case "json":
          await this.runJsonTool();
          break;
        case "hash":
          await this.runHashTool();
          break;
        case "base64":
          await this.runBase64Tool();
          break;
        case "uuid":
          await this.runUuidTool();
          break;
        case "color":
          await this.runColorTool();
          break;
        case "password":
          await this.runPasswordTool();
          break;
        case "jwt":
          await this.runJwtTool();
          break;
        case "case":
          await this.runCaseTool();
          break;
        case "slug":
          await this.runSlugTool();
          break;
        case "timestamp":
          await this.runTimestampTool();
          break;
        case "url":
          await this.runUrlTool();
          break;
        case "bytes":
          await this.runBytesTool();
          break;
        case "http":
          await this.runHttpTool();
          break;
        case "xml":
          await this.runXmlTool();
          break;
        case "validator":
          await this.runValidatorTool();
          break;
        case "lorem":
          await this.runLoremTool();
          break;
        case "html":
          await this.runHtmlTool();
          break;
      }
    } catch (err: any) {
      console.error(`\n${c.red}Error:${c.reset} ${err.message}\n`);
    }

    await this.promptWait();

    this.isToolExecuting = false;
    Terminal.enterRawMode();
    Terminal.enableMouse();
    Terminal.hideCursor();
    this.render();
  }

  private async promptText(message: string, defaultValue = ""): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptMsg = defaultValue
      ? `  ${c.bold}${c.cyan}?${c.reset} ${c.white}${message}${c.reset} ${c.dim}(default: ${defaultValue})${c.reset}: `
      : `  ${c.bold}${c.cyan}?${c.reset} ${c.white}${message}${c.reset}: `;

    return new Promise((resolve) => {
      rl.question(promptMsg, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  private async promptWait(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(`\n  ${c.muted}Press ${c.cyan}[Enter]${c.muted} to return to main menu...${c.reset}`, () => {
        rl.close();
        resolve();
      });
    });
  }

  // --- TOOL IMPLEMENTATIONS ---

  private async runPdfTool(): Promise<void> {
    const action = await this.promptText("Choose action (1: Inspect PDF, 2: Merge PDFs)", "1");
    if (action === "2") {
      const inputs = await this.promptText("Enter comma-separated PDF file paths");
      const files = inputs.split(",").map((s) => s.trim()).filter(Boolean);
      const outPath = await this.promptText("Output PDF path", "merged.pdf");
      const res = tools.pdf.mergePdfs(files, outPath);
      printCard(
        "PDF Merge Complete",
        `Merged ${files.length} PDFs into ${res.outputPath}\nTotal Estimated Pages: ${res.totalPages}`,
        "SUCCESS",
        "DOCUMENT"
      );
    } else {
      const filePath = await this.promptText("Enter PDF file path");
      const info = tools.pdf.inspectPdf(filePath);
      const content = [
        `  ${c.bold}File:${c.reset}         ${info.filePath}`,
        `  ${c.bold}Size:${c.reset}         ${info.fileSizeFormatted}`,
        `  ${c.bold}Version:${c.reset}      ${info.pdfVersion}`,
        `  ${c.bold}Pages:${c.reset}        ${info.pageCount}`,
        `  ${c.bold}Encrypted:${c.reset}    ${info.isEncrypted ? c.red + "YES" : c.emerald + "NO"}${c.reset}`,
        info.title ? `  ${c.bold}Title:${c.reset}        ${info.title}` : "",
        info.author ? `  ${c.bold}Author:${c.reset}       ${info.author}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      printCard("PDF Inspection Details", content, undefined, "DOCUMENT");
    }
  }

  private async runImageTool(): Promise<void> {
    const filePath = await this.promptText("Enter image file path (PNG, JPG, WEBP, GIF, SVG)");
    const info = tools.image.inspectImage(filePath);
    const ascii = tools.image.generateAsciiArt(filePath, 44);

    const meta = [
      `  ${c.bold}Format:${c.reset}       ${c.cyan}${info.format}${c.reset}`,
      `  ${c.bold}Dimensions:${c.reset}   ${info.width} × ${info.height} px`,
      `  ${c.bold}Aspect Ratio:${c.reset} ${info.aspectRatio}`,
      `  ${c.bold}File Size:${c.reset}    ${info.fileSizeFormatted}`,
      ``,
      `  ${c.bold}Terminal Preview:${c.reset}`,
      ascii,
    ].join("\n");

    printCard("Image Inspector & Terminal Preview", meta, undefined, "MEDIA");
  }

  private async runBgRemoverTool(): Promise<void> {
    const inputPath = await this.promptText("Enter input image path (PNG or JPEG)");
    const targetColor = await this.promptText("Target background color to remove (HEX e.g. #ffffff or auto)", "auto");
    const tolerance = parseInt(await this.promptText("Color tolerance percentage (0-100)", "25"), 10) || 25;

    const res = tools.bgRemover.removeBackground({
      inputPath,
      targetColor,
      tolerance,
    });

    const content = [
      `  ${c.bold}Output:${c.reset}       ${res.outputPath}`,
      `  ${c.bold}Removed:${c.reset}      ${res.colorRemoved}`,
      `  ${c.bold}Tolerance:${c.reset}    ${res.toleranceUsed}%`,
      `  ${c.bold}Original:${c.reset}     ${(res.originalSize / 1024).toFixed(1)} KB`,
      `  ${c.bold}New Size:${c.reset}     ${(res.newSize / 1024).toFixed(1)} KB`,
    ].join("\n");

    printCard("Background Removal Complete", content, "Saved transparent PNG", "IMAGE");
  }

  private async runJsonTool(): Promise<void> {
    const mode = await this.promptText("Action (1: Format/Beautify, 2: Minify, 3: Validate, 4: TypeScript)", "1");
    const rawJson = await this.promptText("Enter JSON string or file path");

    let text = rawJson;
    if (rawJson.endsWith(".json") || rawJson.startsWith("./") || rawJson.startsWith("/")) {
      const fs = await import("node:fs");
      if (fs.existsSync(rawJson)) text = fs.readFileSync(rawJson, "utf8");
    }

    if (mode === "3") {
      const val = tools.jsonTool.validateJson(text);
      if (val.valid) {
        printCard("JSON Validator", `  ${c.emerald}✔ Valid JSON Syntax${c.reset}`, undefined, "CHECK");
      } else {
        printCard("JSON Syntax Error", `  ${c.red}Line ${val.line}, Column ${val.column}:${c.reset}\n\n${val.snippet}`, undefined, "ERROR");
      }
    } else if (mode === "2") {
      const min = tools.jsonTool.minifyJson(text);
      printCard("Minified JSON", min, undefined, "FORMAT");
    } else if (mode === "4") {
      const ts = tools.jsonTool.jsonToTypeScript(text);
      printCard("Generated TypeScript Interfaces", ts, undefined, "TYPESCRIPT");
    } else {
      const formatted = tools.jsonTool.formatJsonHighlighted(text);
      printCard("Formatted JSON", formatted, undefined, "FORMAT");
    }
  }

  private async runHashTool(): Promise<void> {
    const text = await this.promptText("Enter text to hash", "sopkit");
    const sha256 = await tools.hash.sha256(text);
    const md5 = tools.hash.md5(text);
    const sha512 = await tools.hash.sha512(text);

    const content = [
      `  ${c.bold}Input:${c.reset}    ${text}`,
      `  ${c.bold}SHA-256:${c.reset}  ${c.cyan}${sha256}${c.reset}`,
      `  ${c.bold}MD5:${c.reset}      ${c.violet}${md5}${c.reset}`,
      `  ${c.bold}SHA-512:${c.reset}  ${c.muted}${sha512.slice(0, 48)}...${c.reset}`,
    ].join("\n");

    printCard("Cryptographic Hashes", content, undefined, "CRYPTO");
  }

  private async runBase64Tool(): Promise<void> {
    const action = await this.promptText("Choose action (1: Encode, 2: Decode)", "1");
    const text = await this.promptText("Enter string", "Hello, SopKit!");
    if (action === "2") {
      const decoded = tools.base64.decode(text);
      printCard("Base64 Decoded", `  ${c.emerald}${decoded}${c.reset}`, undefined, "ENCODE");
    } else {
      const encoded = tools.base64.encode(text);
      printCard("Base64 Encoded", `  ${c.cyan}${encoded}${c.reset}`, undefined, "ENCODE");
    }
  }

  private async runUuidTool(): Promise<void> {
    const id = tools.uuid.v4();
    printCard("Generated UUID v4", `  ${c.cyan}${id}${c.reset}`, "Cryptographically secure", "SECURITY");
  }

  private async runColorTool(): Promise<void> {
    const hex = await this.promptText("Enter HEX color", "#06b6d4");
    const rgbVal = tools.color.hexToRgb(hex);
    const hslVal = tools.color.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    printColorCard(
      hex,
      `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`,
      `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`,
      rgbVal.r,
      rgbVal.g,
      rgbVal.b
    );
  }

  private async runPasswordTool(): Promise<void> {
    const len = parseInt(await this.promptText("Length of password", "20"), 10) || 20;
    const start = Date.now();
    const pass = tools.password.generate({ length: len });
    const elapsed = Date.now() - start;
    const entropy = tools.password.estimateEntropy(pass);
    printPasswordCard(pass, len, entropy, 4, elapsed.toFixed(1));
  }

  private async runJwtTool(): Promise<void> {
    const token = await this.promptText("Enter JWT token string");
    const res = tools.jwt.decode(token);
    if (!res.valid) {
      printCard("JWT Validation Error", `  ${c.red}${res.error}${c.reset}`, undefined, "AUTH");
    } else {
      const content = [
        `  ${c.bold}Algorithm:${c.reset}  ${c.cyan}${res.header?.alg || "None"}${c.reset}`,
        `  ${c.bold}Type:${c.reset}       ${res.header?.typ || "JWT"}`,
        `  ${c.bold}Payload:${c.reset}\n${JSON.stringify(res.payload, null, 2)
          .split("\n")
          .map((l) => "    " + l)
          .join("\n")}`,
      ].join("\n");
      printCard("JWT Inspector", content, "Token claims parsed", "AUTH");
    }
  }

  private async runCaseTool(): Promise<void> {
    const text = await this.promptText("Enter text to convert", "sopkit developer toolkit");
    const all = tools.caseUtil.convertAllCases(text);
    const content = [
      `  camelCase:     ${c.cyan}${all.camelCase}${c.reset}`,
      `  PascalCase:    ${c.violet}${all.pascalCase}${c.reset}`,
      `  snake_case:    ${c.emerald}${all.snakeCase}${c.reset}`,
      `  kebab-case:    ${c.amber}${all.kebabCase}${c.reset}`,
      `  CONSTANT_CASE: ${c.white}${all.constantCase}${c.reset}`,
    ].join("\n");
    printCard("Case Conversions", content, undefined, "TEXT");
  }

  private async runSlugTool(): Promise<void> {
    const text = await this.promptText("Enter text to slugify", "Hello World & SopKit Developer");
    const slug = tools.slug.slugify(text);
    printCard("Generated URL Slug", `  ${c.cyan}${slug}${c.reset}`, undefined, "SEO");
  }

  private async runTimestampTool(): Promise<void> {
    const info = tools.timestamp.now();
    const content = [
      `  Unix Epoch (s):  ${c.cyan}${info.seconds}${c.reset}`,
      `  Epoch (ms):      ${info.milliseconds}`,
      `  ISO 8601:        ${c.emerald}${info.iso}${c.reset}`,
      `  UTC String:      ${info.utc}`,
    ].join("\n");
    printCard("Timestamp / Epoch Details", content, undefined, "DATE");
  }

  private async runUrlTool(): Promise<void> {
    const urlStr = await this.promptText("Enter URL to inspect", "https://sopkit.space/tools?tab=popular&theme=dark");
    const parsed = tools.urlUtil.parseUrl(urlStr);
    const content = [
      `  Origin:   ${c.cyan}${parsed.origin}${c.reset}`,
      `  Path:     ${parsed.pathname}`,
      `  Protocol: ${parsed.protocol}`,
      `  Params:   ${JSON.stringify(parsed.params, null, 2)}`,
    ].join("\n");
    printCard("URL Inspection", content, undefined, "NET");
  }

  private async runBytesTool(): Promise<void> {
    const raw = await this.promptText("Enter byte size (e.g. 1048576 or 4.5 MB)", "1048576");
    const b = tools.bytesUtil.formatBytes(tools.bytesUtil.parseByteString(raw));
    const content = [
      `  Exact Bytes: ${b.bytes.toLocaleString()} B`,
      `  Binary (GiB/MiB):  ${c.cyan}${b.binary.human}${c.reset}`,
      `  Decimal (GB/MB):   ${c.emerald}${b.decimal.human}${c.reset}`,
    ].join("\n");
    printCard("Byte Size Conversions", content, undefined, "DATA");
  }

  private async runHttpTool(): Promise<void> {
    const code = await this.promptText("Enter HTTP status code (e.g. 404, 200, 500)", "404");
    const info = tools.httpUtil.lookupStatus(code);
    if (!info) {
      printCard("HTTP Status", `  ${c.red}Unknown status code: ${code}${c.reset}`, undefined, "HTTP");
    } else {
      const content = [
        `  ${c.bold}Code:${c.reset}        ${c.cyan}${info.code}${c.reset}`,
        `  ${c.bold}Phrase:${c.reset}      ${c.bold}${info.phrase}${c.reset}`,
        `  ${c.bold}Category:${c.reset}    ${info.category}`,
        `  ${c.bold}Meaning:${c.reset}     ${info.description}`,
      ].join("\n");
      printCard("HTTP Status Code Lookup", content, undefined, "HTTP");
    }
  }

  private async runXmlTool(): Promise<void> {
    const rawXml = await this.promptText("Enter XML string", "<root><item id=\"1\">Hello</item></root>");
    const formatted = tools.xml.format(rawXml);
    printCard("Formatted XML", formatted, undefined, "FORMAT");
  }

  private async runValidatorTool(): Promise<void> {
    const email = await this.promptText("Enter email to validate", "dev@sopkit.space");
    const isValid = tools.validator.isEmail(email);
    printCard("Email Validation", isValid ? `  ${c.emerald}✔ VALID EMAIL${c.reset}` : `  ${c.red}✖ INVALID EMAIL${c.reset}`, undefined, "CHECK");
  }

  private async runLoremTool(): Promise<void> {
    const words = tools.lorem.generateWords(25);
    printCard("Generated Lorem Ipsum", words, undefined, "MOCK");
  }

  private async runHtmlTool(): Promise<void> {
    const str = await this.promptText("Enter HTML string to escape", "<div class=\"alert\">Hello & Welcome!</div>");
    const escaped = tools.htmlUtil.escapeHtml(str);
    printCard("Escaped HTML Entities", `  ${c.cyan}${escaped}${c.reset}`, undefined, "HTML");
  }
}
