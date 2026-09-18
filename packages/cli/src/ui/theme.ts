/**
 * @file packages/cli/src/ui/theme.ts
 * @description Theme tokens, TrueColor gradients, and ANSI formatting for SopKit CLI.
 */

export function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}

export function bgRgb(r: number, g: number, b: number): string {
  return `\x1b[48;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}

export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

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
  darkSlate: rgb(15, 23, 42),
};

export const GRADIENT_CYBERPUNK: [number, number, number][] = [
  [168, 85, 247],
  [129, 140, 248],
  [59, 130, 246],
  [6, 182, 212],
  [16, 185, 129],
];

export function gradient(text: string, colors = GRADIENT_CYBERPUNK): string {
  const clean = text.replace(/\x1b\[[0-9;]*m/g, "");
  const n = clean.length;
  if (n <= 1) return text;

  let out = "";
  let cleanIdx = 0;

  for (let i = 0; i < text.length; i++) {
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

export function badge(
  text: string,
  bg: [number, number, number],
  fg: [number, number, number] = [255, 255, 255]
): string {
  return `${bgRgb(bg[0], bg[1], bg[2])}${rgb(fg[0], fg[1], fg[2])}${c.bold} ${text} ${c.reset}`;
}
