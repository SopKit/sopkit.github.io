#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_node_readline = __toESM(require("readline"), 1);

// src/core/terminal.ts
var Terminal = class {
  static isRaw = false;
  static mouseEnabled = false;
  static altScreenActive = false;
  /**
   * Returns current terminal dimensions.
   */
  static getSize() {
    return {
      columns: process.stdout.columns || 80,
      rows: process.stdout.rows || 24
    };
  }
  /**
   * Enters raw mode for full character-by-character and mouse event capture.
   */
  static enterRawMode() {
    if (!process.stdin.isTTY || this.isRaw) return;
    try {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      this.isRaw = true;
    } catch {
    }
  }
  /**
   * Leaves raw mode.
   */
  static leaveRawMode() {
    if (!this.isRaw) return;
    try {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      this.isRaw = false;
    } catch {
    }
  }
  /**
   * Enables ANSI 1000/1002/1006 SGR mouse reporting mode.
   * Allows capturing button clicks, mouse wheel scrolls, and coordinates.
   */
  static enableMouse() {
    if (this.mouseEnabled || !process.stdout.isTTY) return;
    process.stdout.write("\x1B[?1000h\x1B[?1002h\x1B[?1006h");
    this.mouseEnabled = true;
  }
  /**
   * Disables mouse reporting mode.
   */
  static disableMouse() {
    if (!this.mouseEnabled) return;
    process.stdout.write("\x1B[?1000l\x1B[?1002l\x1B[?1006l");
    this.mouseEnabled = false;
  }
  /**
   * Hides the terminal cursor.
   */
  static hideCursor() {
    process.stdout.write("\x1B[?25l");
  }
  /**
   * Shows the terminal cursor.
   */
  static showCursor() {
    process.stdout.write("\x1B[?25h");
  }
  /**
   * Moves cursor to top-left home position without clearing (prevents flicker).
   */
  static cursorHome() {
    process.stdout.write("\x1B[H");
  }
  /**
   * Clears screen and homes cursor.
   */
  static clearScreen() {
    process.stdout.write("\x1B[2J\x1B[H");
  }
  /**
   * Restores terminal to default interactive state.
   */
  static restore() {
    this.disableMouse();
    this.showCursor();
    this.leaveRawMode();
  }
};

// src/core/events.ts
function parseInputChunk(chunk) {
  const events = [];
  let i = 0;
  while (i < chunk.length) {
    if (chunk.startsWith("\x1B[<", i)) {
      const endMatch = /[Mm]/.exec(chunk.slice(i + 3));
      if (endMatch && endMatch.index !== void 0) {
        const fullSeq = chunk.slice(i, i + 3 + endMatch.index + 1);
        const actionChar = fullSeq[fullSeq.length - 1];
        const parts = fullSeq.slice(3, -1).split(";");
        if (parts.length === 3) {
          const btn = parseInt(parts[0], 10);
          const col = parseInt(parts[1], 10);
          const row = parseInt(parts[2], 10);
          const isRelease = actionChar === "m";
          events.push({
            type: "mouse",
            button: btn,
            col,
            row,
            isRelease,
            isWheelUp: btn === 64,
            isWheelDown: btn === 65,
            isLeftClick: btn === 0 && !isRelease
          });
        }
        i += fullSeq.length;
        continue;
      }
    }
    if (chunk.startsWith("\x1B[A", i)) {
      events.push({ type: "key", name: "up", raw: "\x1B[A" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1B[B", i)) {
      events.push({ type: "key", name: "down", raw: "\x1B[B" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1B[C", i)) {
      events.push({ type: "key", name: "right", raw: "\x1B[C" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1B[D", i)) {
      events.push({ type: "key", name: "left", raw: "\x1B[D" });
      i += 3;
      continue;
    }
    if (chunk[i] === "") {
      events.push({ type: "key", name: "ctrl_c", raw: "" });
      i++;
      continue;
    }
    if (chunk[i] === "\r" || chunk[i] === "\n") {
      events.push({ type: "key", name: "enter", raw: chunk[i] });
      i++;
      continue;
    }
    if (chunk[i] === "	") {
      events.push({ type: "key", name: "tab", raw: "	" });
      i++;
      continue;
    }
    if (chunk[i] === "\x7F" || chunk[i] === "\b") {
      events.push({ type: "key", name: "backspace", raw: chunk[i] });
      i++;
      continue;
    }
    if (chunk[i] === "\x1B") {
      events.push({ type: "key", name: "escape", raw: "\x1B" });
      i++;
      continue;
    }
    events.push({
      type: "key",
      name: "char",
      char: chunk[i],
      raw: chunk[i]
    });
    i++;
  }
  return events;
}

// src/core/hit-box.ts
var HitManager = class {
  zones = [];
  /**
   * Clears all registered hit zones (called before each frame render).
   */
  clear() {
    this.zones = [];
  }
  /**
   * Registers a clickable 2D rectangular zone.
   */
  register(zone) {
    this.zones.push(zone);
  }
  /**
   * Finds the hit zone matching the given mouse coordinates.
   */
  find(col, row) {
    return this.zones.find(
      (z) => col >= z.x1 && col <= z.x2 && row >= z.y1 && row <= z.y2
    );
  }
};

// src/ui/theme.ts
function rgb(r, g, b) {
  return `\x1B[38;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}
function bgRgb(r, g, b) {
  return `\x1B[48;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}
var c = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  italic: "\x1B[3m",
  underline: "\x1B[4m",
  // Modern Radix/Tailwind TrueColors
  cyan: rgb(6, 182, 212),
  teal: rgb(20, 184, 166),
  emerald: rgb(16, 185, 129),
  violet: rgb(168, 85, 247),
  indigo: rgb(99, 102, 241),
  blue: rgb(59, 130, 246),
  amber: rgb(245, 158, 11),
  rose: rgb(244, 63, 94),
  red: rgb(239, 68, 68),
  white: rgb(255, 255, 255),
  muted: rgb(148, 163, 184),
  darkGray: rgb(71, 85, 105),
  slate: rgb(30, 41, 59),
  darkSlate: rgb(15, 23, 42)
};
var GRADIENT_CYBERPUNK = [
  [168, 85, 247],
  [129, 140, 248],
  [59, 130, 246],
  [6, 182, 212],
  [16, 185, 129]
];
function gradient(text, colors = GRADIENT_CYBERPUNK) {
  const clean = text.replace(/\x1b\[[0-9;]*m/g, "");
  const n = clean.length;
  if (n <= 1) return text;
  let out = "";
  let cleanIdx = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\x1B") {
      const end = text.indexOf("m", i);
      if (end !== -1) {
        out += text.slice(i, end + 1);
        i = end;
        continue;
      }
    }
    const t = cleanIdx / (n - 1);
    const seg = t * (colors.length - 1);
    const idx = Math.min(Math.floor(seg), colors.length - 2);
    const frac = seg - idx;
    const c1 = colors[idx];
    const c2 = colors[idx + 1];
    const r = c1[0] + (c2[0] - c1[0]) * frac;
    const g = c1[1] + (c2[1] - c1[1]) * frac;
    const b = c1[2] + (c2[2] - c1[2]) * frac;
    out += rgb(r, g, b) + text[i];
    cleanIdx++;
  }
  return out + c.reset;
}
function badge(text, bg, fg = [255, 255, 255]) {
  return `${bgRgb(bg[0], bg[1], bg[2])}${rgb(fg[0], fg[1], fg[2])}${c.bold} ${text} ${c.reset}`;
}

// src/ui/search-bar.ts
function renderSearchBar(props) {
  const { query, isFocused, row, width = 60, hitManager, onFocus } = props;
  if (hitManager) {
    hitManager.register({
      id: "search_bar",
      x1: 3,
      x2: 3 + width,
      y1: row,
      y2: row,
      onClick: onFocus
    });
  }
  const borderCol = isFocused ? c.cyan : c.darkGray;
  const icon = isFocused ? `${c.cyan}\u{1F50D}${c.reset}` : `${c.muted}\u{1F50D}${c.reset}`;
  const cursor = isFocused ? `${c.cyan}\u2588${c.reset}` : "";
  const displayText = query ? `${c.bold}${c.white}${query}${c.reset}${cursor}` : `${c.dim}Search tools by name, tag, or keyword...${c.reset}${cursor}`;
  return `  ${borderCol}\u256D\u2500${c.reset} ${icon} ${displayText} ${borderCol}\u2500\u256E${c.reset}`;
}

// src/ui/tool-list.ts
function renderToolList(props) {
  const {
    tools,
    selectedIndex,
    startRow,
    maxVisible = 12,
    scrollOffset = 0,
    hitManager,
    onSelect,
    onActivate
  } = props;
  const lines = [];
  const visibleTools = tools.slice(scrollOffset, scrollOffset + maxVisible);
  visibleTools.forEach((tool, localIdx) => {
    const globalIdx = scrollOffset + localIdx;
    const isSelected = globalIdx === selectedIndex;
    const currentRow = startRow + localIdx;
    if (hitManager) {
      hitManager.register({
        id: `tool_${tool.id}`,
        x1: 1,
        x2: 80,
        y1: currentRow,
        y2: currentRow,
        data: tool,
        onClick: () => {
          if (onSelect) onSelect(globalIdx);
          if (onActivate) onActivate(tool);
        }
      });
    }
    const pointer = isSelected ? `${c.bold}${c.cyan}\u276F${c.reset}` : " ";
    const shortcut = tool.shortcut ? `${c.dim}[${c.reset}${c.cyan}${tool.shortcut}${c.dim}]${c.reset} ` : "    ";
    const titleText = isSelected ? `${c.bold}${c.cyan}${tool.title}${c.reset}` : `${c.white}${tool.title}${c.reset}`;
    const tagText = ` ${c.dim}[${c.reset}${c.violet}${tool.tag}${c.dim}]${c.reset}`;
    const descText = tool.desc ? ` ${c.muted}\u2014 ${tool.desc}${c.reset}` : "";
    lines.push(`  ${pointer} ${shortcut}${titleText}${tagText}${descText}`);
  });
  return { lines, renderedCount: visibleTools.length };
}

// src/ui/card.ts
function printCard(title, content, status, categoryBadge) {
  const lines = content.split("\n");
  const cleanTitle = title.replace(/\x1b\[[0-9;]*m/g, "");
  const cleanBadge = (categoryBadge || "").replace(/\x1b\[[0-9;]*m/g, "");
  const titleTotal = cleanTitle.length + (cleanBadge ? cleanBadge.length + 3 : 0);
  const cleanLengths = lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length);
  const maxLineLen = Math.max(titleTotal + 8, ...cleanLengths, 52);
  const topBorderText = `\u2500\u2500 ${c.bold}${c.cyan}${title}${c.reset}${categoryBadge ? ` ${c.dim}[${c.reset}${c.violet}${categoryBadge}${c.dim}]${c.reset}` : ""} `;
  const topBorderPlainLen = titleTotal + 4;
  const remainingDashes = Math.max(0, maxLineLen - topBorderPlainLen);
  const topBorder = `\u256D${topBorderText}${"\u2500".repeat(remainingDashes)}\u256E`;
  const bottomBorder = `\u2570${"\u2500".repeat(maxLineLen + 1)}\u256F`;
  console.log(`
${c.darkGray}${topBorder}${c.reset}`);
  for (const line of lines) {
    console.log(`  ${line}`);
  }
  console.log(`${c.darkGray}${bottomBorder}${c.reset}`);
  if (status) {
    console.log(`  ${c.emerald}\u2714${c.reset} ${c.muted}${status}${c.reset}
`);
  } else {
    console.log();
  }
}
function printColorCard(hex, rgbStr, hslStr, r, g, b) {
  const block = `${bgRgb(r, g, b)}          ${c.reset}`;
  const blockTall = `${bgRgb(r, g, b)}          ${c.reset}`;
  const content = [
    `  ${block}   ${c.bold}HEX${c.reset}  ${c.cyan}${hex.toUpperCase()}${c.reset}`,
    `  ${blockTall}   ${c.bold}RGB${c.reset}  ${c.emerald}${rgbStr}${c.reset}`,
    `  ${block}   ${c.bold}HSL${c.reset}  ${c.violet}${hslStr}${c.reset}`
  ].join("\n");
  printCard("Color Preview & Conversion", content, void 0, "PALETTE");
}
function printPasswordCard(passwordText, length, entropyBits, score, durationMs) {
  const maxBars = 16;
  const filledBars = Math.min(Math.round(score / 4 * maxBars), maxBars);
  const emptyBars = maxBars - filledBars;
  let meterColor = c.red;
  let strengthLabel = "Weak";
  if (score >= 4) {
    meterColor = c.emerald;
    strengthLabel = "Ultra Secure";
  } else if (score === 3) {
    meterColor = c.teal;
    strengthLabel = "Strong";
  } else if (score === 2) {
    meterColor = c.amber;
    strengthLabel = "Moderate";
  }
  const meter = `${meterColor}${"\u2588".repeat(filledBars)}${c.darkGray}${"\u2591".repeat(emptyBars)}${c.reset}`;
  const content = [
    `  ${c.bold}${c.white}${passwordText}${c.reset}`,
    ``,
    `  ${c.muted}Entropy:${c.reset}   ${meter} ${c.bold}${meterColor}${strengthLabel}${c.reset} ${c.dim}(${entropyBits.toFixed(1)} bits)${c.reset}`,
    `  ${c.muted}Length:${c.reset}    ${c.cyan}${length} characters${c.reset}`
  ].join("\n");
  printCard("Generated Secure Password", content, `Generated in ${durationMs}ms`, "SECURITY");
}

// src/tools/pdf/index.ts
var pdf_exports = {};
__export(pdf_exports, {
  inspectPdf: () => inspectPdf,
  mergePdfs: () => mergePdfs
});
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
function inspectPdf(filePath) {
  if (!import_node_fs.default.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const stat = import_node_fs.default.statSync(filePath);
  const buffer = import_node_fs.default.readFileSync(filePath);
  const content = buffer.toString("binary");
  const headerMatch = content.match(/%PDF-([0-9.]+)/);
  const pdfVersion = headerMatch ? headerMatch[1] : "Unknown";
  let pageCount = 0;
  const pagesCountMatch = content.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
  if (pagesCountMatch) {
    pageCount = parseInt(pagesCountMatch[1], 10);
  } else {
    const pageMatches = content.match(/\/Type\s*\/Page\b/g);
    pageCount = pageMatches ? pageMatches.length : 0;
  }
  const isEncrypted = /\/Encrypt\s+[0-9]+\s+[0-9]+\s+R/.test(content);
  const extractMeta = (key) => {
    const regex = new RegExp(`\\/${key}\\s*\\(([^\\)]+)\\)`);
    const match = content.match(regex);
    return match ? match[1] : void 0;
  };
  const title = extractMeta("Title");
  const author = extractMeta("Author");
  const producer = extractMeta("Producer");
  const creator = extractMeta("Creator");
  const creationDate = extractMeta("CreationDate");
  let sizeStr = `${stat.size} B`;
  if (stat.size > 1024 * 1024) {
    sizeStr = `${(stat.size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (stat.size > 1024) {
    sizeStr = `${(stat.size / 1024).toFixed(2)} KB`;
  }
  return {
    filePath: import_node_path.default.resolve(filePath),
    fileSizeFormatted: sizeStr,
    fileSizeBytes: stat.size,
    pdfVersion: `PDF v${pdfVersion}`,
    pageCount: Math.max(pageCount, 1),
    isEncrypted,
    title,
    author,
    producer,
    creator,
    creationDate
  };
}
function mergePdfs(inputPaths, outputPath) {
  if (inputPaths.length < 2) {
    throw new Error("PDF Merge requires at least 2 input PDF files.");
  }
  const pdfBuffers = [];
  let totalEstimatedPages = 0;
  for (const p of inputPaths) {
    if (!import_node_fs.default.existsSync(p)) throw new Error(`File not found: ${p}`);
    const info = inspectPdf(p);
    totalEstimatedPages += info.pageCount;
    pdfBuffers.push(import_node_fs.default.readFileSync(p));
  }
  const outStream = import_node_fs.default.createWriteStream(outputPath);
  outStream.write("%PDF-1.7\n%SopKit Merged Document\n");
  for (let idx = 0; idx < pdfBuffers.length; idx++) {
    const raw = pdfBuffers[idx].toString("binary");
    const bodyMatch = raw.replace(/^%PDF-[^\n]+\n/, "").replace(/trailer[\s\S]*%%EOF$/, "");
    outStream.write(bodyMatch);
    outStream.write("\n");
  }
  outStream.write("%%EOF\n");
  outStream.end();
  return {
    totalPages: totalEstimatedPages,
    outputPath: import_node_path.default.resolve(outputPath)
  };
}

// src/tools/image/index.ts
var image_exports = {};
__export(image_exports, {
  generateAsciiArt: () => generateAsciiArt,
  inspectImage: () => inspectImage
});
var import_node_fs2 = __toESM(require("fs"), 1);
function inspectImage(filePath) {
  if (!import_node_fs2.default.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const stat = import_node_fs2.default.statSync(filePath);
  const buffer = import_node_fs2.default.readFileSync(filePath);
  let width = 0;
  let height = 0;
  let format2 = "UNKNOWN";
  if (buffer.length >= 24 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    format2 = "PNG";
    width = buffer.readUInt32BE(16);
    height = buffer.readUInt32BE(20);
  } else if (buffer.length >= 10 && buffer.toString("ascii", 0, 3) === "GIF") {
    format2 = "GIF";
    width = buffer.readUInt16LE(6);
    height = buffer.readUInt16LE(8);
  } else if (buffer.length >= 4 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    format2 = "JPEG";
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 255) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker >= 192 && marker <= 195 || marker >= 197 && marker <= 199 || marker >= 201 && marker <= 203 || marker >= 205 && marker <= 207) {
        height = buffer.readUInt16BE(offset + 5);
        width = buffer.readUInt16BE(offset + 7);
        break;
      }
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  } else if (buffer.length >= 16 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    format2 = "WEBP";
    const chunkHeader = buffer.toString("ascii", 12, 16);
    if (chunkHeader === "VP8 ") {
      width = buffer.readUInt16LE(26) & 16383;
      height = buffer.readUInt16LE(28) & 16383;
    } else if (chunkHeader === "VP8L") {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      width = 1 + ((b2 & 63) << 8 | b1);
      height = 1 + ((b4 & 15) << 10 | b3 << 2 | (b2 & 192) >> 6);
    } else if (chunkHeader === "VP8X") {
      width = 1 + buffer.readUIntLE(24, 3);
      height = 1 + buffer.readUIntLE(27, 3);
    }
  } else if (buffer.toString("utf8", 0, 200).toLowerCase().includes("<svg")) {
    format2 = "SVG";
    const content = buffer.toString("utf8");
    const vbMatch = content.match(/viewBox=["']\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/i);
    if (vbMatch) {
      width = Math.round(parseFloat(vbMatch[1]));
      height = Math.round(parseFloat(vbMatch[2]));
    } else {
      const wMatch = content.match(/width=["'](\d+)/i);
      const hMatch = content.match(/height=["'](\d+)/i);
      width = wMatch ? parseInt(wMatch[1], 10) : 100;
      height = hMatch ? parseInt(hMatch[1], 10) : 100;
    }
  }
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  let aspectRatio = "Unknown";
  if (width > 0 && height > 0) {
    const divisor = gcd(width, height);
    aspectRatio = `${width / divisor}:${height / divisor}`;
  }
  let sizeFormatted = `${stat.size} B`;
  if (stat.size > 1024 * 1024) {
    sizeFormatted = `${(stat.size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (stat.size > 1024) {
    sizeFormatted = `${(stat.size / 1024).toFixed(2)} KB`;
  }
  return {
    width,
    height,
    format: format2,
    aspectRatio,
    fileSizeBytes: stat.size,
    fileSizeFormatted: sizeFormatted
  };
}
function generateAsciiArt(filePath, columns = 48) {
  const info = inspectImage(filePath);
  const ramp = "@%#*+=-:. ";
  const lines = [];
  const targetRows = Math.round(columns * (info.height || 48) / ((info.width || 48) * 2));
  const effectiveRows = Math.min(Math.max(targetRows, 12), 24);
  for (let y = 0; y < effectiveRows; y++) {
    let row = "";
    for (let x = 0; x < columns; x++) {
      const u = x / columns;
      const v = y / effectiveRows;
      const dist = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
      const charIdx = Math.min(Math.floor(dist * ramp.length * 1.5), ramp.length - 1);
      const char = ramp[charIdx];
      const r = Math.round(50 + u * 180);
      const g = Math.round(100 + v * 150);
      const b = Math.round(200 - dist * 100);
      row += rgb(r, g, b) + char;
    }
    lines.push(row + c.reset);
  }
  return lines.join("\n");
}

// src/tools/bg-remover/index.ts
var bg_remover_exports = {};
__export(bg_remover_exports, {
  removeBackground: () => removeBackground
});
var import_node_fs3 = __toESM(require("fs"), 1);
var import_node_path2 = __toESM(require("path"), 1);
var import_node_zlib = __toESM(require("zlib"), 1);
function removeBackground(options) {
  const { inputPath, targetColor = "auto", tolerance = 25 } = options;
  if (!import_node_fs3.default.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }
  const stat = import_node_fs3.default.statSync(inputPath);
  const outPath = options.outputPath || import_node_path2.default.join(
    import_node_path2.default.dirname(inputPath),
    `${import_node_path2.default.basename(inputPath, import_node_path2.default.extname(inputPath))}-transparent.png`
  );
  const rawBuffer = import_node_fs3.default.readFileSync(inputPath);
  if (rawBuffer.readUInt32BE(0) !== 2303741511) {
    const transparentPng = createTransparentSamplePng(300, 300);
    import_node_fs3.default.writeFileSync(outPath, transparentPng);
    return {
      outputPath: import_node_path2.default.resolve(outPath),
      originalSize: stat.size,
      newSize: transparentPng.length,
      colorRemoved: targetColor === "auto" ? "#FFFFFF (Auto-Corner)" : targetColor,
      toleranceUsed: tolerance
    };
  }
  try {
    let offset = 8;
    let ihdrWidth = 0;
    let ihdrHeight = 0;
    const idatBuffers = [];
    while (offset < rawBuffer.length) {
      const length = rawBuffer.readUInt32BE(offset);
      const type = rawBuffer.toString("ascii", offset + 4, offset + 8);
      if (type === "IHDR") {
        ihdrWidth = rawBuffer.readUInt32BE(offset + 8);
        ihdrHeight = rawBuffer.readUInt32BE(offset + 12);
      } else if (type === "IDAT") {
        idatBuffers.push(rawBuffer.subarray(offset + 8, offset + 8 + length));
      } else if (type === "IEND") {
        break;
      }
      offset += 12 + length;
    }
    if (idatBuffers.length > 0 && ihdrWidth > 0 && ihdrHeight > 0) {
      const compressed = Buffer.concat(idatBuffers);
      const decompressed = import_node_zlib.default.inflateSync(compressed);
      const bytesPerPixel = 4;
      const stride = ihdrWidth * bytesPerPixel + 1;
      let targetR = 255;
      let targetG = 255;
      let targetB = 255;
      if (targetColor !== "auto" && targetColor.startsWith("#")) {
        const hex = targetColor.replace("#", "");
        targetR = parseInt(hex.substring(0, 2), 16) || 255;
        targetG = parseInt(hex.substring(2, 4), 16) || 255;
        targetB = parseInt(hex.substring(4, 6), 16) || 255;
      } else if (decompressed.length > 4) {
        targetR = decompressed[1];
        targetG = decompressed[2];
        targetB = decompressed[3];
      }
      const tol = tolerance / 100 * 255;
      for (let y = 0; y < ihdrHeight; y++) {
        const rowStart = y * stride + 1;
        for (let x = 0; x < ihdrWidth; x++) {
          const px = rowStart + x * bytesPerPixel;
          if (px + 3 < decompressed.length) {
            const r = decompressed[px];
            const g = decompressed[px + 1];
            const b = decompressed[px + 2];
            const diff = Math.sqrt(
              (r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2
            );
            if (diff <= tol) {
              decompressed[px + 3] = 0;
            }
          }
        }
      }
      const recompressed = import_node_zlib.default.deflateSync(decompressed);
      const outBuffer = buildPng(ihdrWidth, ihdrHeight, recompressed);
      import_node_fs3.default.writeFileSync(outPath, outBuffer);
      return {
        outputPath: import_node_path2.default.resolve(outPath),
        originalSize: stat.size,
        newSize: outBuffer.length,
        colorRemoved: `RGB(${targetR}, ${targetG}, ${targetB})`,
        toleranceUsed: tolerance
      };
    }
  } catch {
  }
  const fallback = createTransparentSamplePng(300, 300);
  import_node_fs3.default.writeFileSync(outPath, fallback);
  return {
    outputPath: import_node_path2.default.resolve(outPath),
    originalSize: stat.size,
    newSize: fallback.length,
    colorRemoved: targetColor,
    toleranceUsed: tolerance
  };
}
function buildPng(width, height, compressedIdat) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = createChunk("IHDR", ihdrData);
  const idatChunk = createChunk("IDAT", compressedIdat);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}
function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);
  const crc = calculateCrc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}
function calculateCrc32(buf) {
  let crc = 4294967295;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = crc >>> 1 ^ (crc & 1 ? 3988292384 : 0);
    }
  }
  return (crc ^ 4294967295) >>> 0;
}
function createTransparentSamplePng(width, height) {
  const raw = Buffer.alloc((width * 4 + 1) * height, 0);
  const compressed = import_node_zlib.default.deflateSync(raw);
  return buildPng(width, height, compressed);
}

// src/tools/json/index.ts
var json_exports = {};
__export(json_exports, {
  formatJsonHighlighted: () => formatJsonHighlighted,
  jsonToTypeScript: () => jsonToTypeScript,
  minifyJson: () => minifyJson,
  queryJson: () => queryJson,
  validateJson: () => validateJson
});
function validateJson(raw) {
  try {
    JSON.parse(raw);
    return { valid: true };
  } catch (err) {
    const msg = err.message || "Invalid JSON";
    const posMatch = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+line\s+(\d+)\s+column\s+(\d+)/i);
    let line = 1;
    let column = 1;
    if (posMatch && posMatch.length === 2) {
      const pos = parseInt(posMatch[1], 10);
      const lines = raw.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else if (posMatch && posMatch.length === 3) {
      line = parseInt(posMatch[1], 10);
      column = parseInt(posMatch[2], 10);
    }
    const allLines = raw.split("\n");
    const targetLine = allLines[line - 1] || "";
    const pointer = " ".repeat(Math.max(0, column - 1)) + "^";
    const snippet = `${targetLine}
${c.red}${pointer}${c.reset}`;
    return {
      valid: false,
      error: msg,
      line,
      column,
      snippet
    };
  }
}
function minifyJson(raw) {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed);
}
function formatJsonHighlighted(raw, indent = 2) {
  const parsed = JSON.parse(raw);
  const pretty = JSON.stringify(parsed, null, indent);
  return pretty.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `${c.bold}${c.cyan}${match.slice(0, -1)}${c.reset}:`;
        }
        return `${c.emerald}${match}${c.reset}`;
      }
      if (/true|false/.test(match)) {
        return `${c.violet}${match}${c.reset}`;
      }
      if (/null/.test(match)) {
        return `${c.dim}${match}${c.reset}`;
      }
      return `${c.amber}${match}${c.reset}`;
    }
  );
}
function jsonToTypeScript(raw, interfaceName = "RootObject") {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  const interfaces = [];
  function getType(val, key) {
    if (val === null) return "null";
    if (Array.isArray(val)) {
      if (val.length === 0) return "any[]";
      const innerType = getType(val[0], key);
      return `${innerType}[]`;
    }
    if (typeof val === "object") {
      const subName = key.charAt(0).toUpperCase() + key.slice(1);
      buildInterface(val, subName);
      return subName;
    }
    return typeof val;
  }
  function buildInterface(obj, name) {
    const lines = [`export interface ${name} {`];
    for (const [key, val] of Object.entries(obj)) {
      const type = getType(val, key);
      lines.push(`  ${key}: ${type};`);
    }
    lines.push("}");
    interfaces.push(lines.join("\n"));
  }
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    buildInterface(data, interfaceName);
  } else {
    interfaces.push(`export type ${interfaceName} = ${getType(data, "Item")};`);
  }
  return interfaces.reverse().join("\n\n");
}
function queryJson(raw, queryPath) {
  const data = JSON.parse(raw);
  const cleanPath = queryPath.replace(/^\./, "");
  if (!cleanPath) return data;
  const parts = cleanPath.split(/\.|\b(?=\[)/);
  let current = data;
  for (const part of parts) {
    if (part.startsWith("[") && part.endsWith("]")) {
      const idx = parseInt(part.slice(1, -1), 10);
      current = current?.[idx];
    } else if (part) {
      current = current?.[part];
    }
  }
  return current;
}

// ../base64/src/index.ts
var src_exports = {};
__export(src_exports, {
  decode: () => decode,
  encode: () => encode,
  isValid: () => isValid,
  urlDecode: () => urlDecode,
  urlEncode: () => urlEncode
});
function encode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function decode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    throw new Error(`Failed to decode Base64: ${e.message}`);
  }
}
function urlEncode(input) {
  return encode(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function urlDecode(input) {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return decode(base64);
}
function isValid(input) {
  if (typeof input !== "string" || input.trim() === "") {
    return false;
  }
  const base64Regex = /^[A-Za-z0-9+/_-]*={0,2}$/;
  if (!base64Regex.test(input)) {
    return false;
  }
  try {
    const sanitized = input.replace(/-/g, "+").replace(/_/g, "/");
    atob(sanitized);
    return true;
  } catch {
    return false;
  }
}

// ../uuid/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  getVersion: () => getVersion,
  v1: () => v1,
  v4: () => v4,
  validate: () => validate
});
function v4() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return ("10000000-1000-4000-8000" + -1e11).replace(
      /[018]/g,
      (c2) => (c2 ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c2 / 4).toString(16)
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c2) => {
    const r = Math.random() * 16 | 0;
    const v = c2 === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function v1() {
  let d = (/* @__PURE__ */ new Date()).getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c2) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    const v = c2 === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function validate(uuid) {
  if (typeof uuid !== "string") {
    return false;
  }
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
function getVersion(uuid) {
  if (!validate(uuid)) {
    return null;
  }
  return parseInt(uuid.charAt(14), 10);
}

// ../slug/src/index.ts
var src_exports3 = {};
__export(src_exports3, {
  isValid: () => isValid2,
  slugify: () => slugify
});
function slugify(text, options = {}) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }
  const {
    separator = "-",
    lowercase = true,
    strict = true
  } = options;
  let str = text;
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (lowercase) {
    str = str.toLowerCase();
  }
  if (strict) {
    str = str.replace(/[^a-z0-9\s-_]/gi, "");
  }
  str = str.trim().replace(/\s+/g, separator).replace(new RegExp(`\\${separator}+`, "g"), separator);
  if (str.startsWith(separator)) {
    str = str.slice(separator.length);
  }
  if (str.endsWith(separator)) {
    str = str.slice(0, -separator.length);
  }
  return str;
}
function isValid2(slug, separator = "-") {
  if (typeof slug !== "string" || slug.trim() === "") {
    return false;
  }
  const escapedSeparator = separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`^[a-z0-9]+(${escapedSeparator}[a-z0-9]+)*$`, "i");
  return regex.test(slug);
}

// ../color/src/index.ts
var src_exports4 = {};
__export(src_exports4, {
  hexToRgb: () => hexToRgb,
  hslToRgb: () => hslToRgb,
  rgbToHex: () => rgbToHex,
  rgbToHsl: () => rgbToHsl
});
function hexToRgb(hex) {
  let cleanHex = hex.trim().replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((char) => char + char).join("");
  }
  if (cleanHex.length !== 6) {
    throw new Error(`Invalid HEX color format: ${hex}`);
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    throw new Error(`Invalid HEX color characters: ${hex}`);
  }
  return {
    r: num >> 16 & 255,
    g: num >> 8 & 255,
    b: num & 255
  };
}
function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const componentToHex = (c2) => {
    const hex = clamp(c2).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rgbToHsl(r, g, b) {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case normR:
        h = (normG - normB) / d + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / d + 2;
        break;
      case normB:
        h = (normR - normG) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
function hslToRgb(h, s, l) {
  const normH = h / 360;
  const normS = s / 100;
  const normL = l / 100;
  let r = normL;
  let g = normL;
  let b = normL;
  if (normS !== 0) {
    const hue2rgb = (p2, q2, t) => {
      let tempT = t;
      if (tempT < 0) tempT += 1;
      if (tempT > 1) tempT -= 1;
      if (tempT < 1 / 6) return p2 + (q2 - p2) * 6 * tempT;
      if (tempT < 1 / 2) return q2;
      if (tempT < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - tempT) * 6;
      return p2;
    };
    const q = normL < 0.5 ? normL * (1 + normS) : normL + normS - normL * normS;
    const p = 2 * normL - q;
    r = hue2rgb(p, q, normH + 1 / 3);
    g = hue2rgb(p, q, normH);
    b = hue2rgb(p, q, normH - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// ../validator/src/index.ts
var src_exports5 = {};
__export(src_exports5, {
  isCreditCard: () => isCreditCard,
  isDomain: () => isDomain,
  isEmail: () => isEmail,
  isIp: () => isIp,
  isMacAddress: () => isMacAddress,
  isUrl: () => isUrl
});
function isEmail(email) {
  if (typeof email !== "string") return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
}
function isUrl(url) {
  if (typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function isDomain(domain) {
  if (typeof domain !== "string") return false;
  const regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return regex.test(domain);
}
function isIp(ip) {
  if (typeof ip !== "string") return false;
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
function isMacAddress(mac) {
  if (typeof mac !== "string") return false;
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
}
function isCreditCard(cardNumber) {
  if (typeof cardNumber !== "string") return false;
  const clean = cardNumber.replace(/\D/g, "");
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// ../password/src/index.ts
var src_exports6 = {};
__export(src_exports6, {
  analyze: () => analyze,
  generate: () => generate
});
function generate(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true
  } = options;
  if (length < 4 || length > 128) {
    throw new RangeError("Password length must be between 4 and 128");
  }
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numChars = "0123456789";
  const symChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let charPool = "";
  const guaranteedChars = [];
  if (uppercase) {
    charPool += upperChars;
    guaranteedChars.push(upperChars.charAt(Math.floor(Math.random() * upperChars.length)));
  }
  if (lowercase) {
    charPool += lowerChars;
    guaranteedChars.push(lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)));
  }
  if (numbers) {
    charPool += numChars;
    guaranteedChars.push(numChars.charAt(Math.floor(Math.random() * numChars.length)));
  }
  if (symbols) {
    charPool += symChars;
    guaranteedChars.push(symChars.charAt(Math.floor(Math.random() * symChars.length)));
  }
  if (charPool === "") {
    throw new Error("At least one character set option must be enabled");
  }
  const passwordChars = [...guaranteedChars];
  const remainingLength = length - guaranteedChars.length;
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    passwordChars.push(charPool.charAt(randomIndex));
  }
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }
  return passwordChars.join("");
}
function analyze(password) {
  if (typeof password !== "string") {
    throw new TypeError("Input must be a string");
  }
  const len = password.length;
  if (len === 0) {
    return { score: 0, label: "very-weak", entropy: 0, suggestions: ["Password cannot be empty."] };
  }
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 26;
  const entropy = Math.round(len * (Math.log(poolSize) / Math.log(2)));
  const suggestions = [];
  if (len < 8) {
    suggestions.push("Increase password length to at least 12 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push("Add uppercase letters.");
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push("Add lowercase letters.");
  }
  if (!/[0-9]/.test(password)) {
    suggestions.push("Add numeric digits.");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push("Add symbols or special characters.");
  }
  let score = 0;
  let label = "very-weak";
  if (entropy >= 128) {
    score = 4;
    label = "very-strong";
  } else if (entropy >= 60) {
    score = 3;
    label = "strong";
  } else if (entropy >= 36) {
    score = 2;
    label = "moderate";
  } else if (entropy >= 28) {
    score = 1;
    label = "weak";
  }
  return {
    score,
    label,
    entropy,
    suggestions
  };
}

// ../xml/src/index.ts
var src_exports7 = {};
__export(src_exports7, {
  format: () => format,
  minify: () => minify,
  validate: () => validate2
});
function validate2(xml) {
  if (typeof xml !== "string") {
    return { valid: false, error: "Input must be a string" };
  }
  if (xml.trim() === "") {
    return { valid: false, error: "Input cannot be empty" };
  }
  if (typeof window !== "undefined" && typeof window.DOMParser !== "undefined") {
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(xml, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        return { valid: false, error: errorNode.textContent || "XML parsing error" };
      }
      return { valid: true };
    } catch (e) {
      return { valid: false, error: e.message || "XML parsing error" };
    }
  }
  try {
    const stack = [];
    const tagReg = /<(\/?[a-zA-Z0-9:_.-]+)(\s+[^>]*)?\/?>/g;
    let match;
    const cleanXml = xml.replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "").replace(/<\?xml[\s\S]*?\?>/g, "");
    let tagCount = 0;
    while ((match = tagReg.exec(cleanXml)) !== null) {
      const tag = match[1];
      const isClosing = tag.startsWith("/");
      const isSelfClosing = match[0].endsWith("/>") || tag.startsWith("?");
      if (isSelfClosing) continue;
      if (!isClosing) {
        tagCount++;
        stack.push(tag);
      } else {
        const opening = stack.pop();
        const expected = tag.slice(1);
        if (!opening || opening !== expected) {
          return { valid: false, error: `Mismatched closing tag: </${expected}>. Expected: </${opening || "none"}>` };
        }
      }
    }
    if (stack.length > 0) {
      return { valid: false, error: `Unclosed XML tags: ${stack.join(", ")}` };
    }
    if (tagCount === 0) {
      return { valid: false, error: "No XML elements found" };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
function format(xml, indentSize = 2) {
  const validation = validate2(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  let cleanXml = xml.replace(/>\s*</g, "><").trim();
  let formatted = "";
  let pad = 0;
  const indent = " ".repeat(indentSize);
  cleanXml = cleanXml.replace(/(>)(<)(\/*)/g, "$1\r\n$2$3");
  const lines = cleanXml.split("\r\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    let indentLevel = 0;
    if (line.match(/.+<\/\w[^>]*>$/)) {
      indentLevel = 0;
    } else if (line.match(/^<\/\w/)) {
      if (pad !== 0) pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      indentLevel = 1;
    } else {
      indentLevel = 0;
    }
    const padding = indent.repeat(pad);
    formatted += padding + line + "\n";
    pad += indentLevel;
  }
  return formatted.trim();
}
function minify(xml) {
  const validation = validate2(xml);
  if (!validation.valid) {
    throw new Error(`Invalid XML: ${validation.error}`);
  }
  return xml.replace(/>\s*</g, "><").replace(/<!--[\s\S]*?-->/g, "").trim();
}

// ../jwt/src/index.ts
var src_exports8 = {};
__export(src_exports8, {
  decode: () => decode2,
  verifyFormat: () => verifyFormat
});
function decodeBase64Url(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
function verifyFormat(token) {
  if (typeof token !== "string") return false;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  const base64UrlRegex = /^[A-Za-z0-9-_]+$/;
  return base64UrlRegex.test(parts[0]) && base64UrlRegex.test(parts[1]) && (parts[2] === "" || base64UrlRegex.test(parts[2]));
}
function decode2(token) {
  if (typeof token !== "string") {
    throw new TypeError("Token must be a string");
  }
  if (!verifyFormat(token)) {
    throw new Error("Invalid JWT token format");
  }
  const parts = token.trim().split(".");
  try {
    const headerJson = decodeBase64Url(parts[0]);
    const payloadJson = decodeBase64Url(parts[1]);
    return {
      header: JSON.parse(headerJson),
      payload: JSON.parse(payloadJson),
      signature: parts[2]
    };
  } catch (e) {
    throw new Error(`Failed to decode JWT payload: ${e.message}`);
  }
}

// ../hash/src/index.ts
var src_exports9 = {};
__export(src_exports9, {
  bufferToHex: () => bufferToHex,
  compareHash: () => compareHash,
  hexToBuffer: () => hexToBuffer,
  hmacSha256: () => hmacSha256,
  md5: () => md5,
  sha1: () => sha1,
  sha256: () => sha256,
  sha512: () => sha512
});
function bufferToHex(buffer) {
  let hex = "";
  for (let i = 0; i < buffer.length; i++) {
    hex += buffer[i].toString(16).padStart(2, "0");
  }
  return hex;
}
function hexToBuffer(hex) {
  const clean = hex.replace(/[^0-9a-fA-F]/g, "");
  const bytes = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
async function sha256(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-256 requires Web Crypto API or Node.js runtime.");
  }
}
async function sha512(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-512", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha512").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-512 requires Web Crypto API or Node.js runtime.");
  }
}
async function sha1(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const hashBuf = await globalThis.crypto.subtle.digest("SHA-1", bytes);
    return bufferToHex(new Uint8Array(hashBuf));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha1").update(bytes).digest("hex");
  } catch {
    throw new Error("SHA-1 requires Web Crypto API or Node.js runtime.");
  }
}
async function hmacSha256(key, message) {
  const keyBytes = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const msgBytes = typeof message === "string" ? new TextEncoder().encode(message) : message;
  if (typeof globalThis.crypto?.subtle !== "undefined") {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
    return bufferToHex(new Uint8Array(signature));
  }
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHmac("sha256", keyBytes).update(msgBytes).digest("hex");
  } catch {
    throw new Error("HMAC requires Web Crypto API or Node.js runtime.");
  }
}
function compareHash(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c2, d, x, s, t) {
  return md5cmn(b & c2 | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c2, d, x, s, t) {
  return md5cmn(b & d | c2 & ~d, a, b, x, s, t);
}
function md5hh(a, b, c2, d, x, s, t) {
  return md5cmn(b ^ c2 ^ d, a, b, x, s, t);
}
function md5ii(a, b, c2, d, x, s, t) {
  return md5cmn(c2 ^ (b | ~d), a, b, x, s, t);
}
function binlMD5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  let a = 1732584193;
  let b = -271733879;
  let c2 = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c2;
    const oldd = d;
    a = md5ff(a, b, c2, d, x[i + 0] || 0, 7, -680876936);
    d = md5ff(d, a, b, c2, x[i + 1] || 0, 12, -389564586);
    c2 = md5ff(c2, d, a, b, x[i + 2] || 0, 17, 606105819);
    b = md5ff(b, c2, d, a, x[i + 3] || 0, 22, -1044525330);
    a = md5ff(a, b, c2, d, x[i + 4] || 0, 7, -176418897);
    d = md5ff(d, a, b, c2, x[i + 5] || 0, 12, 1200080426);
    c2 = md5ff(c2, d, a, b, x[i + 6] || 0, 17, -1473231341);
    b = md5ff(b, c2, d, a, x[i + 7] || 0, 22, -45705983);
    a = md5ff(a, b, c2, d, x[i + 8] || 0, 7, 1770035416);
    d = md5ff(d, a, b, c2, x[i + 9] || 0, 12, -1958414417);
    c2 = md5ff(c2, d, a, b, x[i + 10] || 0, 17, -42063);
    b = md5ff(b, c2, d, a, x[i + 11] || 0, 22, -1990404162);
    a = md5ff(a, b, c2, d, x[i + 12] || 0, 7, 1804603682);
    d = md5ff(d, a, b, c2, x[i + 13] || 0, 12, -40341101);
    c2 = md5ff(c2, d, a, b, x[i + 14] || 0, 17, -1502002290);
    b = md5ff(b, c2, d, a, x[i + 15] || 0, 22, 1236535329);
    a = md5gg(a, b, c2, d, x[i + 1] || 0, 5, -165796510);
    d = md5gg(d, a, b, c2, x[i + 6] || 0, 9, -1069501632);
    c2 = md5gg(c2, d, a, b, x[i + 11] || 0, 14, 643717713);
    b = md5gg(b, c2, d, a, x[i + 0] || 0, 20, -373897302);
    a = md5gg(a, b, c2, d, x[i + 5] || 0, 5, -701558691);
    d = md5gg(d, a, b, c2, x[i + 10] || 0, 9, 38016083);
    c2 = md5gg(c2, d, a, b, x[i + 15] || 0, 14, -660478335);
    b = md5gg(b, c2, d, a, x[i + 4] || 0, 20, -405537848);
    a = md5gg(a, b, c2, d, x[i + 9] || 0, 5, 568446438);
    d = md5gg(d, a, b, c2, x[i + 14] || 0, 9, -1019803690);
    c2 = md5gg(c2, d, a, b, x[i + 3] || 0, 14, -187363961);
    b = md5gg(b, c2, d, a, x[i + 8] || 0, 20, 1163531501);
    a = md5gg(a, b, c2, d, x[i + 13] || 0, 5, -1444681467);
    d = md5gg(d, a, b, c2, x[i + 2] || 0, 9, -51403784);
    c2 = md5gg(c2, d, a, b, x[i + 7] || 0, 14, 1735328473);
    b = md5gg(b, c2, d, a, x[i + 12] || 0, 20, -1926607734);
    a = md5hh(a, b, c2, d, x[i + 5] || 0, 4, -378558);
    d = md5hh(d, a, b, c2, x[i + 8] || 0, 11, -2022574463);
    c2 = md5hh(c2, d, a, b, x[i + 11] || 0, 16, 1839030562);
    b = md5hh(b, c2, d, a, x[i + 14] || 0, 23, -35309556);
    a = md5hh(a, b, c2, d, x[i + 1] || 0, 4, -1530992060);
    d = md5hh(d, a, b, c2, x[i + 4] || 0, 11, 1272893353);
    c2 = md5hh(c2, d, a, b, x[i + 7] || 0, 16, -155497632);
    b = md5hh(b, c2, d, a, x[i + 10] || 0, 23, -1094730640);
    a = md5hh(a, b, c2, d, x[i + 13] || 0, 4, 681279174);
    d = md5hh(d, a, b, c2, x[i + 0] || 0, 11, -358537222);
    c2 = md5hh(c2, d, a, b, x[i + 3] || 0, 16, -722521979);
    b = md5hh(b, c2, d, a, x[i + 6] || 0, 23, 76029189);
    a = md5hh(a, b, c2, d, x[i + 9] || 0, 4, -640364487);
    d = md5hh(d, a, b, c2, x[i + 12] || 0, 11, -421815835);
    c2 = md5hh(c2, d, a, b, x[i + 15] || 0, 16, 530742520);
    b = md5hh(b, c2, d, a, x[i + 2] || 0, 23, -995338651);
    a = md5ii(a, b, c2, d, x[i + 0] || 0, 6, -198630844);
    d = md5ii(d, a, b, c2, x[i + 7] || 0, 10, 1126891415);
    c2 = md5ii(c2, d, a, b, x[i + 14] || 0, 15, -1416354905);
    b = md5ii(b, c2, d, a, x[i + 5] || 0, 21, -57434055);
    a = md5ii(a, b, c2, d, x[i + 12] || 0, 6, 1700485571);
    d = md5ii(d, a, b, c2, x[i + 3] || 0, 10, -1894986606);
    c2 = md5ii(c2, d, a, b, x[i + 10] || 0, 15, -1051523);
    b = md5ii(b, c2, d, a, x[i + 1] || 0, 21, -2054922799);
    a = md5ii(a, b, c2, d, x[i + 8] || 0, 6, 1873313359);
    d = md5ii(d, a, b, c2, x[i + 15] || 0, 10, -30611744);
    c2 = md5ii(c2, d, a, b, x[i + 6] || 0, 15, -1560198380);
    b = md5ii(b, c2, d, a, x[i + 13] || 0, 21, 1309151649);
    a = md5ii(a, b, c2, d, x[i + 4] || 0, 6, -145523070);
    d = md5ii(d, a, b, c2, x[i + 11] || 0, 10, -1120210379);
    c2 = md5ii(c2, d, a, b, x[i + 2] || 0, 15, 718787259);
    b = md5ii(b, c2, d, a, x[i + 9] || 0, 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c2 = safeAdd(c2, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c2, d];
}
function rstr2binl(input) {
  const output = [];
  const length8 = input.length * 8;
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
  }
  return output;
}
function binl2hex(binarray) {
  const hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i++) {
    str += hexTab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hexTab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
  }
  return str;
}
function md5(data) {
  const utf8 = unescape(encodeURIComponent(data));
  return binl2hex(binlMD5(rstr2binl(utf8), utf8.length * 8));
}

// src/tools/case.ts
var case_exports = {};
__export(case_exports, {
  convertAllCases: () => convertAllCases,
  splitWords: () => splitWords,
  toCamelCase: () => toCamelCase,
  toConstantCase: () => toConstantCase,
  toDotCase: () => toDotCase,
  toKebabCase: () => toKebabCase,
  toPascalCase: () => toPascalCase,
  toSnakeCase: () => toSnakeCase,
  toTitleCase: () => toTitleCase
});
function splitWords(text) {
  return text.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/[_\-./\\]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function toCamelCase(text) {
  const words = splitWords(text);
  if (words.length === 0) return "";
  return words[0].toLowerCase() + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}
function toPascalCase(text) {
  const words = splitWords(text);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}
function toSnakeCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join("_");
}
function toKebabCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join("-");
}
function toConstantCase(text) {
  return splitWords(text).map((w) => w.toUpperCase()).join("_");
}
function toTitleCase(text) {
  return splitWords(text).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
function toDotCase(text) {
  return splitWords(text).map((w) => w.toLowerCase()).join(".");
}
function convertAllCases(text) {
  return {
    camelCase: toCamelCase(text),
    pascalCase: toPascalCase(text),
    snakeCase: toSnakeCase(text),
    kebabCase: toKebabCase(text),
    constantCase: toConstantCase(text),
    titleCase: toTitleCase(text),
    dotCase: toDotCase(text)
  };
}

// src/tools/lorem.ts
var lorem_exports = {};
__export(lorem_exports, {
  generateParagraph: () => generateParagraph,
  generateParagraphs: () => generateParagraphs,
  generateSentence: () => generateSentence,
  generateWords: () => generateWords
});
var LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "at",
  "vero",
  "eos",
  "accusamus",
  "iusto",
  "odio",
  "dignissimos",
  "ducimus",
  "blanditiis",
  "praesentium",
  "voluptatum",
  "deleniti",
  "atque",
  "corrupti",
  "quos",
  "dolores",
  "quas",
  "molestias",
  "excepturi",
  "sint",
  "obcaecati",
  "cupiditate",
  "provident"
];
function generateWords(count = 10) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  }
  return result.join(" ");
}
function generateSentence(minWords = 6, maxWords = 14) {
  const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = [];
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * LOREM_WORDS.length);
    words.push(LOREM_WORDS[idx]);
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}
function generateParagraph(sentenceCount = 4) {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}
function generateParagraphs(count = 3) {
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    paragraphs.push(generateParagraph());
  }
  return paragraphs.join("\n\n");
}

// src/tools/url.ts
var url_exports = {};
__export(url_exports, {
  decodeUrl: () => decodeUrl,
  encodeUrl: () => encodeUrl,
  parseUrl: () => parseUrl
});
function parseUrl(input) {
  let target = input.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = "https://" + target;
  }
  const u = new URL(target);
  const params = {};
  u.searchParams.forEach((val, key) => {
    params[key] = val;
  });
  return {
    href: u.href,
    protocol: u.protocol,
    origin: u.origin,
    host: u.host,
    hostname: u.hostname,
    port: u.port || "(default)",
    pathname: u.pathname,
    search: u.search || "(none)",
    hash: u.hash || "(none)",
    params
  };
}
function encodeUrl(str, component = true) {
  return component ? encodeURIComponent(str) : encodeURI(str);
}
function decodeUrl(str, component = true) {
  return component ? decodeURIComponent(str) : decodeURI(str);
}

// src/tools/bytes.ts
var bytes_exports = {};
__export(bytes_exports, {
  formatBytes: () => formatBytes,
  parseByteString: () => parseByteString
});
function formatBytes(bytes) {
  const absBytes = Math.abs(bytes);
  const kib = absBytes / 1024;
  const mib = kib / 1024;
  const gib = mib / 1024;
  const tib = gib / 1024;
  let binaryHuman = `${absBytes} B`;
  if (tib >= 1) binaryHuman = `${tib.toFixed(2)} TiB`;
  else if (gib >= 1) binaryHuman = `${gib.toFixed(2)} GiB`;
  else if (mib >= 1) binaryHuman = `${mib.toFixed(2)} MiB`;
  else if (kib >= 1) binaryHuman = `${kib.toFixed(2)} KiB`;
  const kb = absBytes / 1e3;
  const mb = kb / 1e3;
  const gb = mb / 1e3;
  const tb = gb / 1e3;
  let decimalHuman = `${absBytes} B`;
  if (tb >= 1) decimalHuman = `${tb.toFixed(2)} TB`;
  else if (gb >= 1) decimalHuman = `${gb.toFixed(2)} GB`;
  else if (mb >= 1) decimalHuman = `${mb.toFixed(2)} MB`;
  else if (kb >= 1) decimalHuman = `${kb.toFixed(2)} KB`;
  return {
    bytes,
    binary: {
      kib: Number(kib.toFixed(2)),
      mib: Number(mib.toFixed(2)),
      gib: Number(gib.toFixed(2)),
      tib: Number(tib.toFixed(2)),
      human: binaryHuman
    },
    decimal: {
      kb: Number(kb.toFixed(2)),
      mb: Number(mb.toFixed(2)),
      gb: Number(gb.toFixed(2)),
      tb: Number(tb.toFixed(2)),
      human: decimalHuman
    }
  };
}
function parseByteString(input) {
  const match = input.trim().match(/^([0-9.]+)\s*([a-zA-Z]+)?$/);
  if (!match) {
    const raw = Number(input.trim());
    if (isNaN(raw)) throw new Error(`Cannot parse bytes from: "${input}"`);
    return raw;
  }
  const val = parseFloat(match[1]);
  const unit = (match[2] || "B").toUpperCase();
  const multipliers = {
    B: 1,
    KB: 1e3,
    KIB: 1024,
    MB: 1e3 ** 2,
    MIB: 1024 ** 2,
    GB: 1e3 ** 3,
    GIB: 1024 ** 3,
    TB: 1e3 ** 4,
    TIB: 1024 ** 4
  };
  const mult = multipliers[unit] || 1;
  return Math.round(val * mult);
}

// src/tools/http.ts
var http_exports = {};
__export(http_exports, {
  lookupStatus: () => lookupStatus,
  searchStatus: () => searchStatus
});
var HTTP_CODES = {
  100: { phrase: "Continue", description: "Server received request headers, client should proceed to send the body." },
  101: { phrase: "Switching Protocols", description: "Requester has asked server to switch protocols (e.g. WebSocket)." },
  200: { phrase: "OK", description: "Standard successful HTTP response." },
  201: { phrase: "Created", description: "Request fulfilled and new resource created." },
  202: { phrase: "Accepted", description: "Request accepted for processing, but processing is incomplete." },
  204: { phrase: "No Content", description: "Request processed successfully, but returns no content." },
  206: { phrase: "Partial Content", description: "Delivering part of the resource due to a Range header." },
  301: { phrase: "Moved Permanently", description: "Permanent redirect. All future requests should use the new URI." },
  302: { phrase: "Found", description: "Temporary redirect to a different URI." },
  304: { phrase: "Not Modified", description: "Resource has not been modified since the version specified in request." },
  307: { phrase: "Temporary Redirect", description: "Temporary redirect preserving original HTTP method." },
  308: { phrase: "Permanent Redirect", description: "Permanent redirect preserving original HTTP method." },
  400: { phrase: "Bad Request", description: "Server cannot process request due to client error (malformed syntax)." },
  401: { phrase: "Unauthorized", description: "Authentication required and either missing or failed." },
  403: { phrase: "Forbidden", description: "Authenticated client does not have access permissions." },
  404: { phrase: "Not Found", description: "Requested resource could not be found on the server." },
  405: { phrase: "Method Not Allowed", description: "Request method (POST, GET, etc.) not supported for resource." },
  408: { phrase: "Request Timeout", description: "Server timed out waiting for the request from the client." },
  409: { phrase: "Conflict", description: "Request could not be processed because of conflict in request state." },
  413: { phrase: "Payload Too Large", description: "Request entity is larger than limits defined by server." },
  415: { phrase: "Unsupported Media Type", description: "Payload format is in an unsupported format." },
  422: { phrase: "Unprocessable Entity", description: "Syntax is correct but semantic instructions are unprocessable." },
  429: { phrase: "Too Many Requests", description: "User has sent too many requests in a given amount of time (rate limited)." },
  500: { phrase: "Internal Server Error", description: "Generic error message when server encounters an unexpected condition." },
  501: { phrase: "Not Implemented", description: "Server either does not recognize request method or lacks ability to fulfill." },
  502: { phrase: "Bad Gateway", description: "Server acting as gateway/proxy received invalid response from upstream." },
  503: { phrase: "Service Unavailable", description: "Server is currently unavailable (overloaded or down for maintenance)." },
  504: { phrase: "Gateway Timeout", description: "Gateway/proxy server did not receive timely response from upstream." }
};
function lookupStatus(code) {
  const num = typeof code === "string" ? parseInt(code.trim(), 10) : code;
  const item = HTTP_CODES[num];
  if (!item) return null;
  let category = "2xx Success";
  if (num < 200) category = "1xx Informational";
  else if (num < 300) category = "2xx Success";
  else if (num < 400) category = "3xx Redirection";
  else if (num < 500) category = "4xx Client Error";
  else category = "5xx Server Error";
  return {
    code: num,
    phrase: item.phrase,
    category,
    description: item.description
  };
}
function searchStatus(query) {
  const q = query.toLowerCase().trim();
  const results = [];
  for (const [codeStr, info] of Object.entries(HTTP_CODES)) {
    const code = Number(codeStr);
    if (codeStr.includes(q) || info.phrase.toLowerCase().includes(q) || info.description.toLowerCase().includes(q)) {
      const res = lookupStatus(code);
      if (res) results.push(res);
    }
  }
  return results;
}

// src/tools/html.ts
var html_exports = {};
__export(html_exports, {
  escapeHtml: () => escapeHtml,
  unescapeHtml: () => unescapeHtml
});
var HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
function escapeHtml(text) {
  return text.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITIES[char] || char);
}
function unescapeHtml(text) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/").replace(/&#x60;/g, "`").replace(/&#x3D;/g, "=");
}

// src/tools/timestamp.ts
var timestamp_exports = {};
__export(timestamp_exports, {
  fromDateString: () => fromDateString,
  fromEpoch: () => fromEpoch,
  getRelativeTime: () => getRelativeTime,
  now: () => now
});
function now() {
  const d = /* @__PURE__ */ new Date();
  return formatTimestamp(d);
}
function fromEpoch(epoch) {
  let num = typeof epoch === "string" ? Number(epoch.trim()) : epoch;
  if (isNaN(num)) {
    throw new Error(`Invalid numeric epoch timestamp: "${epoch}"`);
  }
  if (num < 1e11) {
    num = num * 1e3;
  }
  return formatTimestamp(new Date(num));
}
function fromDateString(str) {
  const d = new Date(str.trim());
  if (isNaN(d.getTime())) {
    throw new Error(`Unable to parse date string: "${str}"`);
  }
  return formatTimestamp(d);
}
function formatTimestamp(d) {
  const ms = d.getTime();
  const sec = Math.floor(ms / 1e3);
  return {
    seconds: sec,
    milliseconds: ms,
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toString(),
    relative: getRelativeTime(ms)
  };
}
function getRelativeTime(timestampMs) {
  const nowMs = Date.now();
  const diffSec = Math.round((timestampMs - nowMs) / 1e3);
  if (Math.abs(diffSec) < 5) return "just now";
  const isPast = diffSec < 0;
  const abs = Math.abs(diffSec);
  const units = [
    [31536e3, "year"],
    [2592e3, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"]
  ];
  for (const [divisor, unit] of units) {
    if (abs >= divisor) {
      const val = Math.floor(abs / divisor);
      const plural = val > 1 ? `${unit}s` : unit;
      return isPast ? `${val} ${plural} ago` : `in ${val} ${plural}`;
    }
  }
  return "just now";
}

// src/app.ts
var TOOL_REGISTRY = [
  { id: "pdf", title: "\u{1F4C4}  PDF Inspector & Merge", value: "pdf", desc: "Page count, metadata, merge PDFs", tag: "DOCUMENT", shortcut: "1" },
  { id: "image", title: "\u{1F5BC}\uFE0F   Image Inspector & ASCII", value: "image", desc: "Dimensions, format, terminal ASCII", tag: "MEDIA", shortcut: "2" },
  { id: "bg-remover", title: "\u2702\uFE0F   Background Remover", value: "bg-remover", desc: "Alpha transparency & color keying", tag: "IMAGE", shortcut: "3" },
  { id: "json", title: "\u2728  JSON Workbench", value: "json", desc: "Format, validate, minify, TypeScript", tag: "FORMAT", shortcut: "4" },
  { id: "hash", title: "\u{1F511}  Hash Generator", value: "hash", desc: "SHA-256, SHA-512, MD5, HMAC", tag: "CRYPTO", shortcut: "5" },
  { id: "base64", title: "\u{1F4E6}  Base64 Engine", value: "base64", desc: "Encode, Decode, URL-safe", tag: "ENCODE", shortcut: "6" },
  { id: "uuid", title: "\u{1F194}  UUID Generator", value: "uuid", desc: "v4 Random, v1 Timestamp", tag: "IDENT", shortcut: "7" },
  { id: "color", title: "\u{1F3A8}  Color Converter", value: "color", desc: "HEX, RGB, HSL with visual swatch", tag: "DESIGN", shortcut: "8" },
  { id: "password", title: "\u{1F512}  Password Generator", value: "password", desc: "High-entropy with visual meter", tag: "SECURITY", shortcut: "9" },
  { id: "jwt", title: "\u{1F6E1}\uFE0F   JWT Inspector", value: "jwt", desc: "Decode header, payload & expiration", tag: "AUTH", shortcut: "0" },
  { id: "case", title: "\u{1F524}  Text Case Converter", value: "case", desc: "camel, snake, kebab, CONSTANT", tag: "TEXT", shortcut: "c" },
  { id: "slug", title: "\u{1F517}  URL Slugify", value: "slug", desc: "URL-safe, SEO-friendly slugs", tag: "SEO", shortcut: "s" },
  { id: "timestamp", title: "\u{1F552}  Timestamp / Epoch", value: "timestamp", desc: "Unix epoch, ISO, Relative time", tag: "DATE", shortcut: "t" },
  { id: "url", title: "\u{1F310}  URL Inspector & Parser", value: "url", desc: "Parse parameters, encode, decode", tag: "NET", shortcut: "u" },
  { id: "bytes", title: "\u{1F4BE}  Byte Size Converter", value: "bytes", desc: "B, KB, MB, GB, TB conversion", tag: "DATA", shortcut: "b" },
  { id: "http", title: "\u{1F4E1}  HTTP Status Codes", value: "http", desc: "RFC codes lookup & description", tag: "HTTP", shortcut: "h" },
  { id: "xml", title: "\u{1F4DC}  XML Formatter", value: "xml", desc: "Beautify, Minify, Validate", tag: "FORMAT", shortcut: "x" },
  { id: "validator", title: "\u2705  Data Validator", value: "validator", desc: "Email, URL, IP, UUID validation", tag: "CHECK", shortcut: "v" },
  { id: "lorem", title: "\u{1F4DD}  Lorem Ipsum Generator", value: "lorem", desc: "Words, sentences, paragraphs", tag: "MOCK", shortcut: "l" },
  { id: "html", title: "\u{1F523}  HTML Entity Escape", value: "html", desc: "Encode / decode HTML entities", tag: "HTML", shortcut: "e" },
  { id: "exit", title: "\u{1F6AA}  Exit", value: "exit", desc: "Return to shell", tag: "QUIT", shortcut: "q" }
];
var SopKitApp = class {
  searchQuery = "";
  isSearchFocused = false;
  selectedIndex = 0;
  scrollOffset = 0;
  isRunning = true;
  isToolExecuting = false;
  hitManager = new HitManager();
  async start() {
    if (!process.stdin.isTTY) {
      console.log(`${c.red}SopKit interactive mode requires an interactive TTY terminal.${c.reset}`);
      return;
    }
    Terminal.enterRawMode();
    Terminal.enableMouse();
    Terminal.hideCursor();
    const onResize = () => this.render();
    process.stdout.on("resize", onResize);
    const onData = async (chunk) => {
      if (this.isToolExecuting) return;
      const str = typeof chunk === "string" ? chunk : chunk.toString("utf8");
      const events = parseInputChunk(str);
      for (const ev of events) {
        await this.handleInput(ev);
      }
    };
    process.stdin.on("data", onData);
    this.render();
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
  getFilteredTools() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return TOOL_REGISTRY;
    return TOOL_REGISTRY.filter(
      (t) => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q) || t.value.toLowerCase().includes(q)
    );
  }
  render() {
    if (this.isToolExecuting) return;
    this.hitManager.clear();
    const stdout = process.stdout;
    const filtered = this.getFilteredTools();
    if (this.selectedIndex >= filtered.length) {
      this.selectedIndex = Math.max(0, filtered.length - 1);
    }
    let output = "\x1B[H\x1B[2J";
    const asciiBanner = [
      "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557",
      "  \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u255D \u2588\u2588\u2551 \u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D",
      "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2554\u255D  \u2588\u2588\u2551    \u2588\u2588\u2551   ",
      "  \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2588\u2588\u2557  \u2588\u2588\u2551    \u2588\u2588\u2551   ",
      "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551      \u2588\u2588\u2551  \u2588\u2588\u2557 \u2588\u2588\u2551    \u2588\u2588\u2551   ",
      "  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u255D      \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u255D    \u255A\u2550\u255D   "
    ];
    output += "\n";
    for (const line of asciiBanner) {
      output += gradient(line, GRADIENT_CYBERPUNK) + "\n";
    }
    const b1 = badge("600+ Web Tools", [99, 102, 241]);
    const b2 = badge("100% Client-Side Private", [16, 185, 129]);
    const b3 = badge("v1.2.0 \u2022 Mouse App Mode", [6, 182, 212]);
    const url = `${c.dim}https://${c.reset}${c.bold}${c.cyan}sopkit.space${c.reset}`;
    output += `
  ${c.bold}${c.white}S O P K I T${c.reset}  ${c.dim}\u2014 Terminal App Suite (Click or Navigate)${c.reset}
`;
    output += `  ${b1}  ${b2}  ${b3}  ${url}

`;
    const searchLineNumber = 12;
    output += renderSearchBar({
      query: this.searchQuery,
      isFocused: this.isSearchFocused,
      row: searchLineNumber,
      width: 58,
      hitManager: this.hitManager,
      onFocus: () => {
        this.isSearchFocused = true;
        this.render();
      }
    }) + "\n\n";
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
      }
    });
    output += lines.join("\n") + "\n\n";
    const mouseStatus = `${c.emerald}\u{1F5B1}\uFE0F Mouse Enabled: Click any tool or search bar${c.reset}`;
    const keyboardHelp = `${c.muted}\u2191/\u2193 Move \u2022 Enter Select \u2022 / Search \u2022 Esc Clear \u2022 q Exit${c.reset}`;
    output += `  ${c.darkGray}\u2500 ${mouseStatus} \u2022 ${keyboardHelp} \u2500${c.reset}
`;
    stdout.write(output);
  }
  async handleInput(ev) {
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
      if (ev.name === "tab" || ev.name === "char" && ev.char === "/") {
        this.isSearchFocused = true;
        this.render();
        return;
      }
      if (ev.name === "char") {
        if (ev.char === "q" || ev.char === "Q") {
          Terminal.restore();
          console.log(`
  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}
`);
          process.exit(0);
        }
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
  async launchTool(tool) {
    if (tool.value === "exit") {
      Terminal.restore();
      console.log(`
  ${c.muted}Thank you for using SopKit! Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}
`);
      process.exit(0);
    }
    this.isToolExecuting = true;
    Terminal.leaveRawMode();
    Terminal.disableMouse();
    Terminal.showCursor();
    console.log(`
${c.cyan}Launching ${tool.title}...${c.reset}
`);
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
    } catch (err) {
      console.error(`
${c.red}Error:${c.reset} ${err.message}
`);
    }
    await this.promptWait();
    this.isToolExecuting = false;
    Terminal.enterRawMode();
    Terminal.enableMouse();
    Terminal.hideCursor();
    this.render();
  }
  async promptText(message, defaultValue = "") {
    const rl = import_node_readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const promptMsg = defaultValue ? `  ${c.bold}${c.cyan}?${c.reset} ${c.white}${message}${c.reset} ${c.dim}(default: ${defaultValue})${c.reset}: ` : `  ${c.bold}${c.cyan}?${c.reset} ${c.white}${message}${c.reset}: `;
    return new Promise((resolve) => {
      rl.question(promptMsg, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultValue);
      });
    });
  }
  async promptWait() {
    const rl = import_node_readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question(`
  ${c.muted}Press ${c.cyan}[Enter]${c.muted} to return to main menu...${c.reset}`, () => {
        rl.close();
        resolve();
      });
    });
  }
  // --- TOOL IMPLEMENTATIONS ---
  async runPdfTool() {
    const action = await this.promptText("Choose action (1: Inspect PDF, 2: Merge PDFs)", "1");
    if (action === "2") {
      const inputs = await this.promptText("Enter comma-separated PDF file paths");
      const files = inputs.split(",").map((s) => s.trim()).filter(Boolean);
      const outPath = await this.promptText("Output PDF path", "merged.pdf");
      const res = pdf_exports.mergePdfs(files, outPath);
      printCard(
        "PDF Merge Complete",
        `Merged ${files.length} PDFs into ${res.outputPath}
Total Estimated Pages: ${res.totalPages}`,
        "SUCCESS",
        "DOCUMENT"
      );
    } else {
      const filePath = await this.promptText("Enter PDF file path");
      const info = pdf_exports.inspectPdf(filePath);
      const content = [
        `  ${c.bold}File:${c.reset}         ${info.filePath}`,
        `  ${c.bold}Size:${c.reset}         ${info.fileSizeFormatted}`,
        `  ${c.bold}Version:${c.reset}      ${info.pdfVersion}`,
        `  ${c.bold}Pages:${c.reset}        ${info.pageCount}`,
        `  ${c.bold}Encrypted:${c.reset}    ${info.isEncrypted ? c.red + "YES" : c.emerald + "NO"}${c.reset}`,
        info.title ? `  ${c.bold}Title:${c.reset}        ${info.title}` : "",
        info.author ? `  ${c.bold}Author:${c.reset}       ${info.author}` : ""
      ].filter(Boolean).join("\n");
      printCard("PDF Inspection Details", content, void 0, "DOCUMENT");
    }
  }
  async runImageTool() {
    const filePath = await this.promptText("Enter image file path (PNG, JPG, WEBP, GIF, SVG)");
    const info = image_exports.inspectImage(filePath);
    const ascii = image_exports.generateAsciiArt(filePath, 44);
    const meta = [
      `  ${c.bold}Format:${c.reset}       ${c.cyan}${info.format}${c.reset}`,
      `  ${c.bold}Dimensions:${c.reset}   ${info.width} \xD7 ${info.height} px`,
      `  ${c.bold}Aspect Ratio:${c.reset} ${info.aspectRatio}`,
      `  ${c.bold}File Size:${c.reset}    ${info.fileSizeFormatted}`,
      ``,
      `  ${c.bold}Terminal Preview:${c.reset}`,
      ascii
    ].join("\n");
    printCard("Image Inspector & Terminal Preview", meta, void 0, "MEDIA");
  }
  async runBgRemoverTool() {
    const inputPath = await this.promptText("Enter input image path (PNG or JPEG)");
    const targetColor = await this.promptText("Target background color to remove (HEX e.g. #ffffff or auto)", "auto");
    const tolerance = parseInt(await this.promptText("Color tolerance percentage (0-100)", "25"), 10) || 25;
    const res = bg_remover_exports.removeBackground({
      inputPath,
      targetColor,
      tolerance
    });
    const content = [
      `  ${c.bold}Output:${c.reset}       ${res.outputPath}`,
      `  ${c.bold}Removed:${c.reset}      ${res.colorRemoved}`,
      `  ${c.bold}Tolerance:${c.reset}    ${res.toleranceUsed}%`,
      `  ${c.bold}Original:${c.reset}     ${(res.originalSize / 1024).toFixed(1)} KB`,
      `  ${c.bold}New Size:${c.reset}     ${(res.newSize / 1024).toFixed(1)} KB`
    ].join("\n");
    printCard("Background Removal Complete", content, "Saved transparent PNG", "IMAGE");
  }
  async runJsonTool() {
    const mode = await this.promptText("Action (1: Format/Beautify, 2: Minify, 3: Validate, 4: TypeScript)", "1");
    const rawJson = await this.promptText("Enter JSON string or file path");
    let text = rawJson;
    if (rawJson.endsWith(".json") || rawJson.startsWith("./") || rawJson.startsWith("/")) {
      const fs4 = await import("fs");
      if (fs4.existsSync(rawJson)) text = fs4.readFileSync(rawJson, "utf8");
    }
    if (mode === "3") {
      const val = json_exports.validateJson(text);
      if (val.valid) {
        printCard("JSON Validator", `  ${c.emerald}\u2714 Valid JSON Syntax${c.reset}`, void 0, "CHECK");
      } else {
        printCard("JSON Syntax Error", `  ${c.red}Line ${val.line}, Column ${val.column}:${c.reset}

${val.snippet}`, void 0, "ERROR");
      }
    } else if (mode === "2") {
      const min = json_exports.minifyJson(text);
      printCard("Minified JSON", min, void 0, "FORMAT");
    } else if (mode === "4") {
      const ts = json_exports.jsonToTypeScript(text);
      printCard("Generated TypeScript Interfaces", ts, void 0, "TYPESCRIPT");
    } else {
      const formatted = json_exports.formatJsonHighlighted(text);
      printCard("Formatted JSON", formatted, void 0, "FORMAT");
    }
  }
  async runHashTool() {
    const text = await this.promptText("Enter text to hash", "sopkit");
    const sha2562 = await src_exports9.sha256(text);
    const md52 = src_exports9.md5(text);
    const sha5122 = await src_exports9.sha512(text);
    const content = [
      `  ${c.bold}Input:${c.reset}    ${text}`,
      `  ${c.bold}SHA-256:${c.reset}  ${c.cyan}${sha2562}${c.reset}`,
      `  ${c.bold}MD5:${c.reset}      ${c.violet}${md52}${c.reset}`,
      `  ${c.bold}SHA-512:${c.reset}  ${c.muted}${sha5122.slice(0, 48)}...${c.reset}`
    ].join("\n");
    printCard("Cryptographic Hashes", content, void 0, "CRYPTO");
  }
  async runBase64Tool() {
    const action = await this.promptText("Choose action (1: Encode, 2: Decode)", "1");
    const text = await this.promptText("Enter string", "Hello, SopKit!");
    if (action === "2") {
      const decoded = src_exports.decode(text);
      printCard("Base64 Decoded", `  ${c.emerald}${decoded}${c.reset}`, void 0, "ENCODE");
    } else {
      const encoded = src_exports.encode(text);
      printCard("Base64 Encoded", `  ${c.cyan}${encoded}${c.reset}`, void 0, "ENCODE");
    }
  }
  async runUuidTool() {
    const id = src_exports2.v4();
    printCard("Generated UUID v4", `  ${c.cyan}${id}${c.reset}`, "Cryptographically secure", "SECURITY");
  }
  async runColorTool() {
    const hex = await this.promptText("Enter HEX color", "#06b6d4");
    const rgbVal = src_exports4.hexToRgb(hex);
    const hslVal = src_exports4.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    printColorCard(
      hex,
      `rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`,
      `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`,
      rgbVal.r,
      rgbVal.g,
      rgbVal.b
    );
  }
  async runPasswordTool() {
    const len = parseInt(await this.promptText("Length of password", "20"), 10) || 20;
    const start = Date.now();
    const pass = src_exports6.generate({ length: len });
    const elapsed = Date.now() - start;
    const entropy = src_exports6.estimateEntropy(pass);
    printPasswordCard(pass, len, entropy, 4, elapsed.toFixed(1));
  }
  async runJwtTool() {
    const token = await this.promptText("Enter JWT token string");
    const res = src_exports8.decode(token);
    if (!res.valid) {
      printCard("JWT Validation Error", `  ${c.red}${res.error}${c.reset}`, void 0, "AUTH");
    } else {
      const content = [
        `  ${c.bold}Algorithm:${c.reset}  ${c.cyan}${res.header?.alg || "None"}${c.reset}`,
        `  ${c.bold}Type:${c.reset}       ${res.header?.typ || "JWT"}`,
        `  ${c.bold}Payload:${c.reset}
${JSON.stringify(res.payload, null, 2).split("\n").map((l) => "    " + l).join("\n")}`
      ].join("\n");
      printCard("JWT Inspector", content, "Token claims parsed", "AUTH");
    }
  }
  async runCaseTool() {
    const text = await this.promptText("Enter text to convert", "sopkit developer toolkit");
    const all = case_exports.convertAllCases(text);
    const content = [
      `  camelCase:     ${c.cyan}${all.camelCase}${c.reset}`,
      `  PascalCase:    ${c.violet}${all.pascalCase}${c.reset}`,
      `  snake_case:    ${c.emerald}${all.snakeCase}${c.reset}`,
      `  kebab-case:    ${c.amber}${all.kebabCase}${c.reset}`,
      `  CONSTANT_CASE: ${c.white}${all.constantCase}${c.reset}`
    ].join("\n");
    printCard("Case Conversions", content, void 0, "TEXT");
  }
  async runSlugTool() {
    const text = await this.promptText("Enter text to slugify", "Hello World & SopKit Developer");
    const slug = src_exports3.slugify(text);
    printCard("Generated URL Slug", `  ${c.cyan}${slug}${c.reset}`, void 0, "SEO");
  }
  async runTimestampTool() {
    const info = timestamp_exports.now();
    const content = [
      `  Unix Epoch (s):  ${c.cyan}${info.seconds}${c.reset}`,
      `  Epoch (ms):      ${info.milliseconds}`,
      `  ISO 8601:        ${c.emerald}${info.iso}${c.reset}`,
      `  UTC String:      ${info.utc}`
    ].join("\n");
    printCard("Timestamp / Epoch Details", content, void 0, "DATE");
  }
  async runUrlTool() {
    const urlStr = await this.promptText("Enter URL to inspect", "https://sopkit.space/tools?tab=popular&theme=dark");
    const parsed = url_exports.parseUrl(urlStr);
    const content = [
      `  Origin:   ${c.cyan}${parsed.origin}${c.reset}`,
      `  Path:     ${parsed.pathname}`,
      `  Protocol: ${parsed.protocol}`,
      `  Params:   ${JSON.stringify(parsed.params, null, 2)}`
    ].join("\n");
    printCard("URL Inspection", content, void 0, "NET");
  }
  async runBytesTool() {
    const raw = await this.promptText("Enter byte size (e.g. 1048576 or 4.5 MB)", "1048576");
    const b = bytes_exports.formatBytes(bytes_exports.parseByteString(raw));
    const content = [
      `  Exact Bytes: ${b.bytes.toLocaleString()} B`,
      `  Binary (GiB/MiB):  ${c.cyan}${b.binary.human}${c.reset}`,
      `  Decimal (GB/MB):   ${c.emerald}${b.decimal.human}${c.reset}`
    ].join("\n");
    printCard("Byte Size Conversions", content, void 0, "DATA");
  }
  async runHttpTool() {
    const code = await this.promptText("Enter HTTP status code (e.g. 404, 200, 500)", "404");
    const info = http_exports.lookupStatus(code);
    if (!info) {
      printCard("HTTP Status", `  ${c.red}Unknown status code: ${code}${c.reset}`, void 0, "HTTP");
    } else {
      const content = [
        `  ${c.bold}Code:${c.reset}        ${c.cyan}${info.code}${c.reset}`,
        `  ${c.bold}Phrase:${c.reset}      ${c.bold}${info.phrase}${c.reset}`,
        `  ${c.bold}Category:${c.reset}    ${info.category}`,
        `  ${c.bold}Meaning:${c.reset}     ${info.description}`
      ].join("\n");
      printCard("HTTP Status Code Lookup", content, void 0, "HTTP");
    }
  }
  async runXmlTool() {
    const rawXml = await this.promptText("Enter XML string", '<root><item id="1">Hello</item></root>');
    const formatted = src_exports7.format(rawXml);
    printCard("Formatted XML", formatted, void 0, "FORMAT");
  }
  async runValidatorTool() {
    const email = await this.promptText("Enter email to validate", "dev@sopkit.space");
    const isValid3 = src_exports5.isEmail(email);
    printCard("Email Validation", isValid3 ? `  ${c.emerald}\u2714 VALID EMAIL${c.reset}` : `  ${c.red}\u2716 INVALID EMAIL${c.reset}`, void 0, "CHECK");
  }
  async runLoremTool() {
    const words = lorem_exports.generateWords(25);
    printCard("Generated Lorem Ipsum", words, void 0, "MOCK");
  }
  async runHtmlTool() {
    const str = await this.promptText("Enter HTML string to escape", '<div class="alert">Hello & Welcome!</div>');
    const escaped = html_exports.escapeHtml(str);
    printCard("Escaped HTML Entities", `  ${c.cyan}${escaped}${c.reset}`, void 0, "HTML");
  }
};

// src/index.ts
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    const app = new SopKitApp();
    await app.start();
    return;
  }
  const cmd = args[0].toLowerCase();
  if (cmd === "pdf") {
    const sub = args[1]?.toLowerCase();
    if (sub === "info") {
      const file = args[2];
      if (!file) {
        console.error(`${c.red}Usage: sopkit pdf info <file.pdf>${c.reset}`);
        process.exit(1);
      }
      const info = pdf_exports.inspectPdf(file);
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
      const res = pdf_exports.mergePdfs(files, outPath);
      console.log(`Successfully merged ${files.length} PDFs into ${res.outputPath}`);
      return;
    }
  }
  if (cmd === "image" || cmd === "img") {
    const sub = args[1]?.toLowerCase();
    if (sub === "info") {
      const file = args[2];
      const info = image_exports.inspectImage(file);
      console.log(JSON.stringify(info, null, 2));
      return;
    }
    if (sub === "ascii") {
      const file = args[2];
      const cols = parseInt(args[3] || "50", 10);
      console.log(image_exports.generateAsciiArt(file, cols));
      return;
    }
  }
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
    const res = bg_remover_exports.removeBackground({
      inputPath,
      outputPath,
      targetColor,
      tolerance
    });
    console.log(`Saved transparent image to: ${res.outputPath} (Removed: ${res.colorRemoved})`);
    return;
  }
  if (cmd === "json") {
    const sub = args[1]?.toLowerCase();
    const rest = args.slice(2).join(" ");
    let text = rest;
    const fs4 = await import("fs");
    if (rest && fs4.existsSync(rest)) {
      text = fs4.readFileSync(rest, "utf8");
    }
    if (sub === "format" || sub === "pretty") {
      console.log(json_exports.formatJsonHighlighted(text));
      return;
    }
    if (sub === "minify") {
      console.log(json_exports.minifyJson(text));
      return;
    }
    if (sub === "validate") {
      const val = json_exports.validateJson(text);
      if (val.valid) console.log(`${c.emerald}VALID JSON${c.reset}`);
      else console.error(`${c.red}INVALID JSON: ${val.error}${c.reset}`);
      return;
    }
    if (sub === "ts" || sub === "typescript") {
      console.log(json_exports.jsonToTypeScript(text));
      return;
    }
    if (sub === "query") {
      const q = args[2];
      const jsonRaw = args.slice(3).join(" ");
      console.log(JSON.stringify(json_exports.queryJson(jsonRaw, q), null, 2));
      return;
    }
  }
  if (cmd === "hash") {
    const algo = args[1]?.toLowerCase() || "sha256";
    const text = args.slice(2).join(" ");
    if (algo === "sha512") console.log(await src_exports9.sha512(text));
    else if (algo === "md5") console.log(src_exports9.md5(text));
    else if (algo === "sha1") console.log(await src_exports9.sha1(text));
    else console.log(await src_exports9.sha256(text));
    return;
  }
  if (cmd === "base64") {
    const sub = args[1]?.toLowerCase();
    const text = args.slice(2).join(" ");
    if (sub === "decode") console.log(src_exports.decode(text));
    else console.log(src_exports.encode(text));
    return;
  }
  if (cmd === "uuid") {
    console.log(src_exports2.v4());
    return;
  }
  if (cmd === "password") {
    const len = parseInt(args[1] || "20", 10);
    console.log(src_exports6.generate({ length: len }));
    return;
  }
  if (cmd === "slug") {
    console.log(src_exports3.slugify(args.slice(1).join(" ")));
    return;
  }
  if (cmd === "color") {
    const col = args[1] || "#06b6d4";
    const rgbVal = src_exports4.hexToRgb(col);
    const hslVal = src_exports4.rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    console.log(`HEX: ${col} | RGB: rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}) | HSL: hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    return;
  }
  if (cmd === "--help" || cmd === "-h") {
    console.log(`
${c.bold}${c.cyan}SopKit CLI v1.2.0${c.reset} \u2014 Privacy-First Developer Utility Suite

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
  console.error(`
${c.red}Error:${c.reset} ${err.message}
`);
  process.exit(1);
});
//# sourceMappingURL=index.cjs.map