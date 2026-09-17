/**
 * @file packages/cli/src/ui.ts
 * @description World-class terminal UI engine for SopKit CLI with TrueColor gradients,
 * rounded cards, visual meters, color swatches, and keyboard navigation.
 */

import readline from "node:readline";

// TrueColor RGB codes
export function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}

export function bgRgb(r: number, g: number, b: number): string {
  return `\x1b[48;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}

// Preset modern color palette (Radix / Tailwind 2026 tuned)
export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Sleek TrueColor Foregrounds
  violet: rgb(168, 85, 247),
  purple: rgb(192, 132, 252),
  indigo: rgb(99, 102, 241),
  blue: rgb(59, 130, 246),
  cyan: rgb(6, 182, 212),
  teal: rgb(20, 184, 166),
  emerald: rgb(16, 185, 129),
  green: rgb(34, 197, 94),
  amber: rgb(245, 158, 11),
  rose: rgb(244, 63, 94),
  red: rgb(239, 68, 68),
  white: rgb(255, 255, 255),
  muted: rgb(148, 163, 184),
  darkGray: rgb(71, 85, 105),

  // Fallback ANSI Standard
  brightWhite: "\x1b[97m",
  brightCyan: "\x1b[96m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightRed: "\x1b[91m",
};

// Preset horizontal gradient stops: Cyberpunk / Aurora Borealis
export const GRADIENT_CYBERPUNK: [number, number, number][] = [
  [168, 85, 247], // Violet
  [129, 140, 248], // Indigo
  [59, 130, 246], // Blue
  [6, 182, 212], // Cyan
  [16, 185, 129], // Emerald
];

export const GRADIENT_SUNSET: [number, number, number][] = [
  [244, 63, 94], // Rose
  [245, 158, 11], // Amber
  [234, 179, 8], // Yellow
];

/**
 * Applies a smooth horizontal TrueColor gradient across any string.
 */
export function gradient(text: string, colors = GRADIENT_CYBERPUNK): string {
  // Strip ANSI before calculating length for smooth interpolation
  const clean = text.replace(/\x1b\[[0-9;]*m/g, "");
  const n = clean.length;
  if (n <= 1) return text;

  let out = "";
  let cleanIdx = 0;

  for (let i = 0; i < text.length; i++) {
    // If encounter escape sequence, preserve it directly
    if (text[i] === "\x1b") {
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

/**
 * Renders a pill badge with custom styling.
 */
export function badge(text: string, bg: [number, number, number], fg: [number, number, number] = [255, 255, 255]): string {
  return `${bgRgb(bg[0], bg[1], bg[2])}${rgb(fg[0], fg[1], fg[2])}${c.bold} ${text} ${c.reset}`;
}

/**
 * Prints the world-class SopKit Hero Banner.
 */
export function printBanner(): void {
  const asciiLines = [
    "  ███████╗  ██████╗  ██████╗  ██╗  ██╗ ██╗ ████████╗",
    "  ██╔════╝ ██╔═══██╗ ██╔══██╗ ██║ ██╔╝ ██║ ╚══██╔══╝",
    "  ███████╗ ██║   ██║ ██████╔╝ █████╔╝  ██║    ██║   ",
    "  ╚════██║ ██║   ██║ ██╔═══╝  ██╔═██╗  ██║    ██║   ",
    "  ███████║ ╚██████╔╝ ██║      ██║  ██╗ ██║    ██║   ",
    "  ╚══════╝  ╚═════╝  ╚═╝      ╚═╝  ╚═╝ ╚═╝    ╚═╝   ",
  ];

  console.log();
  for (const line of asciiLines) {
    console.log(gradient(line, GRADIENT_CYBERPUNK));
  }

  const b1 = badge("600+ Web Tools", [99, 102, 241]);
  const b2 = badge("100% Client-Side Private", [16, 185, 129]);
  const b3 = badge("v1.0.2", [6, 182, 212]);
  const url = `${c.dim}https://${c.reset}${c.bold}${c.cyan}sopkit.space${c.reset}`;

  console.log(`\n  ${c.bold}${c.brightWhite}S O P K I T${c.reset}  ${c.dim}— Privacy-First Developer Utility Suite${c.reset}`);
  console.log(`  ${b1}  ${b2}  ${b3}  ${url}\n`);
}

/**
 * Prints an aesthetic rounded card with optional status timing and badge.
 */
export function printCard(
  title: string,
  content: string,
  status?: string,
  categoryBadge?: string
): void {
  const lines = content.split("\n");
  const cleanTitle = title.replace(/\x1b\[[0-9;]*m/g, "");
  const cleanBadge = (categoryBadge || "").replace(/\x1b\[[0-9;]*m/g, "");
  const titleTotal = cleanTitle.length + (cleanBadge ? cleanBadge.length + 3 : 0);

  const cleanLengths = lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length);
  const maxLineLen = Math.max(titleTotal + 8, ...cleanLengths, 48);

  const topBorderText = `── ${c.bold}${c.cyan}${title}${c.reset}${
    categoryBadge ? ` ${c.dim}[${c.reset}${c.violet}${categoryBadge}${c.dim}]${c.reset}` : ""
  } `;
  const topBorderPlainLen = titleTotal + 4;
  const remainingDashes = Math.max(0, maxLineLen - topBorderPlainLen);

  const topBorder = `╭${topBorderText}${"─".repeat(remainingDashes)}╮`;
  const bottomBorder = `╰${"─".repeat(maxLineLen + 1)}╯`;

  console.log(`\n${c.darkGray}${topBorder}${c.reset}`);
  for (const line of lines) {
    console.log(`  ${line}`);
  }
  console.log(`${c.darkGray}${bottomBorder}${c.reset}`);

  if (status) {
    console.log(`  ${c.emerald}✔${c.reset} ${c.muted}${status}${c.reset}\n`);
  } else {
    console.log();
  }
}

/**
 * Renders a visual color block preview with HEX, RGB, HSL table.
 */
export function printColorCard(hex: string, rgbStr: string, hslStr: string, r: number, g: number, b: number): void {
  const block = `${bgRgb(r, g, b)}          ${c.reset}`;
  const blockTall = `${bgRgb(r, g, b)}          ${c.reset}`;

  const content = [
    `  ${block}   ${c.bold}HEX${c.reset}  ${c.cyan}${hex.toUpperCase()}${c.reset}`,
    `  ${blockTall}   ${c.bold}RGB${c.reset}  ${c.emerald}${rgbStr}${c.reset}`,
    `  ${block}   ${c.bold}HSL${c.reset}  ${c.purple}${hslStr}${c.reset}`,
  ].join("\n");

  printCard("Color Preview & Conversion", content, undefined, "PALETTE");
}

/**
 * Renders an entropy strength meter for generated passwords.
 */
export function printPasswordCard(
  passwordText: string,
  length: number,
  entropyBits: number,
  score: number,
  durationMs: string
): void {
  const maxBars = 16;
  const filledBars = Math.min(Math.round((score / 4) * maxBars), maxBars);
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

  const meter = `${meterColor}${"█".repeat(filledBars)}${c.darkGray}${"░".repeat(emptyBars)}${c.reset}`;

  const content = [
    `  ${c.bold}${c.brightWhite}${passwordText}${c.reset}`,
    ``,
    `  ${c.muted}Entropy:${c.reset}   ${meter} ${c.bold}${meterColor}${strengthLabel}${c.reset} ${c.dim}(${entropyBits.toFixed(1)} bits)${c.reset}`,
    `  ${c.muted}Length:${c.reset}    ${c.cyan}${length} characters${c.reset}`,
  ].join("\n");

  printCard("Generated Secure Password", content, `Generated in ${durationMs}ms`, "SECURITY");
}

export interface SelectChoice {
  title: string;
  value: string;
  desc?: string;
  tag?: string;
  shortcut?: string;
}

/**
 * Highly interactive, keyboard-responsive selection menu with hotkeys (1-9, q),
 * visual indicators, category tags, and instant response.
 */
export async function select(message: string, choices: SelectChoice[]): Promise<string> {
  if (!process.stdin.isTTY) {
    return choices[0]?.value || "";
  }

  let selectedIndex = 0;
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  function render() {
    stdout.write(`\x1b[?25l`); // Hide cursor
    stdout.write(`\r\x1b[K${c.bold}${c.cyan}?${c.reset} ${c.bold}${c.brightWhite}${message}${c.reset}\n`);

    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      const isSelected = i === selectedIndex;
      const shortcutNum = choice.shortcut || (i < 9 ? String(i + 1) : i === 9 ? "0" : "");
      const shortcutDisplay = shortcutNum ? `${c.dim}[${c.reset}${c.cyan}${shortcutNum}${c.dim}]${c.reset} ` : "    ";

      const pointer = isSelected ? `${c.bold}${c.cyan}❯${c.reset}` : " ";
      const tag = choice.tag ? ` ${c.dim}[${c.reset}${c.violet}${choice.tag}${c.dim}]${c.reset}` : "";
      const text = isSelected
        ? `${c.bold}${c.cyan}${choice.title}${c.reset}`
        : `${c.muted}${choice.title}${c.reset}`;
      const desc = choice.desc ? ` ${c.dim}— ${choice.desc}${c.reset}` : "";

      stdout.write(`\r\x1b[K  ${pointer} ${shortcutDisplay}${text}${tag}${desc}\n`);
    }

    // Hint footer
    const hints = `${c.darkGray}  ─ ↑/↓ navigate • 1-9 quick-key • Enter select • q / Ctrl+C quit ─${c.reset}`;
    stdout.write(`\r\x1b[K${hints}\n`);
  }

  render();

  return new Promise<string>((resolve) => {
    function onData(key: string) {
      if (key === "\u0003" || key === "q" || key === "Q") {
        // Ctrl+C or 'q'
        cleanup();
        stdout.write(`\n${c.muted}Session ended. Visit ${c.cyan}https://sopkit.space${c.muted} for more.${c.reset}\n\n`);
        process.exit(0);
      }

      if (key === "\r" || key === "\n") {
        // Enter
        cleanup();
        resolve(choices[selectedIndex].value);
        return;
      }

      // Check number shortcut keys (1-9, 0)
      if (key >= "1" && key <= "9") {
        const numIdx = parseInt(key, 10) - 1;
        if (numIdx < choices.length) {
          cleanup();
          resolve(choices[numIdx].value);
          return;
        }
      } else if (key === "0" && choices.length >= 10) {
        cleanup();
        resolve(choices[9].value);
        return;
      }

      if (key === "\u001b[A" || key === "k") {
        // Up arrow or 'k'
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
      } else if (key === "\u001b[B" || key === "j") {
        // Down arrow or 'j'
        selectedIndex = (selectedIndex + 1) % choices.length;
      }

      // Move cursor back up to re-render (choices.length + 2 lines: header + choices + hint footer)
      stdout.write(`\x1b[${choices.length + 2}A`);
      render();
    }

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write(`\x1b[?25h`); // Show cursor
    }

    stdin.on("data", onData);
  });
}

/**
 * Modern formatted prompt with placeholder and default indicator.
 */
export async function promptText(message: string, defaultValue = ""): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptMsg = defaultValue
    ? `  ${c.bold}${c.cyan}?${c.reset} ${c.brightWhite}${message}${c.reset} ${c.dim}(default: ${defaultValue})${c.reset}: `
    : `  ${c.bold}${c.cyan}?${c.reset} ${c.brightWhite}${message}${c.reset}: `;

  return new Promise((resolve) => {
    rl.question(promptMsg, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}
