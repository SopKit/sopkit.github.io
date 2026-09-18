/**
 * @file packages/cli/src/ui/card.ts
 * @description Rounded card, status badge, and meter components for SopKit CLI.
 */

import { c, bgRgb } from "./theme.js";

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
  const maxLineLen = Math.max(titleTotal + 8, ...cleanLengths, 52);

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

export function printColorCard(
  hex: string,
  rgbStr: string,
  hslStr: string,
  r: number,
  g: number,
  b: number
): void {
  const block = `${bgRgb(r, g, b)}          ${c.reset}`;
  const blockTall = `${bgRgb(r, g, b)}          ${c.reset}`;

  const content = [
    `  ${block}   ${c.bold}HEX${c.reset}  ${c.cyan}${hex.toUpperCase()}${c.reset}`,
    `  ${blockTall}   ${c.bold}RGB${c.reset}  ${c.emerald}${rgbStr}${c.reset}`,
    `  ${block}   ${c.bold}HSL${c.reset}  ${c.violet}${hslStr}${c.reset}`,
  ].join("\n");

  printCard("Color Preview & Conversion", content, undefined, "PALETTE");
}

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
    `  ${c.bold}${c.white}${passwordText}${c.reset}`,
    ``,
    `  ${c.muted}Entropy:${c.reset}   ${meter} ${c.bold}${meterColor}${strengthLabel}${c.reset} ${c.dim}(${entropyBits.toFixed(1)} bits)${c.reset}`,
    `  ${c.muted}Length:${c.reset}    ${c.cyan}${length} characters${c.reset}`,
  ].join("\n");

  printCard("Generated Secure Password", content, `Generated in ${durationMs}ms`, "SECURITY");
}
