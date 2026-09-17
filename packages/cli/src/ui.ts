/**
 * @file packages/cli/src/ui.ts
 * @description Beautiful zero-dependency terminal UI helpers for SopKit CLI.
 */

import readline from "node:readline";

// ANSI Color Codes
export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Foreground
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Bright
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",

  // Background
  bgCyan: "\x1b[46m",
  bgMagenta: "\x1b[45m",
  bgBlack: "\x1b[40m",
};

export function printBanner() {
  console.log(`
${c.cyan}╭─────────────────────────────────────────────────────────────╮${c.reset}
${c.cyan}│${c.reset}  ${c.bold}${c.brightWhite}S O P K I T${c.reset}  ${c.dim}— Privacy-First Developer CLI${c.reset}         ${c.cyan}│${c.reset}
${c.cyan}│${c.reset}  ${c.dim}600+ Browser & Terminal Utilities${c.reset}  ${c.cyan}https://sopkit.space${c.reset}    ${c.cyan}│${c.reset}
${c.cyan}╰─────────────────────────────────────────────────────────────╯${c.reset}
`);
}

export function printCard(title: string, content: string, status?: string) {
  const lines = content.split("\n");
  const maxLineLen = Math.max(
    title.length + 6,
    ...lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length),
    44
  );

  const topBorder = `╭── ${c.bold}${c.brightCyan}${title}${c.reset} ${"─".repeat(Math.max(0, maxLineLen - title.length - 2))}╮`;
  const bottomBorder = `╰${"─".repeat(maxLineLen + 3)}╯`;

  console.log(`\n${c.dim}${topBorder}${c.reset}`);
  for (const line of lines) {
    console.log(`  ${line}`);
  }
  console.log(`${c.dim}${bottomBorder}${c.reset}`);
  if (status) {
    console.log(`  ${c.green}✔${c.reset} ${c.dim}${status}${c.reset}\n`);
  } else {
    console.log();
  }
}

export interface SelectChoice {
  title: string;
  value: string;
  desc?: string;
}

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
    stdout.write(`\r\x1b[K${c.bold}${c.brightCyan}?${c.reset} ${c.bold}${message}${c.reset}\n`);
    for (let i = 0; i < choices.length; i++) {
      const choice = choices[i];
      const isSelected = i === selectedIndex;
      const pointer = isSelected ? `${c.brightCyan}❯${c.reset}` : " ";
      const text = isSelected
        ? `${c.bold}${c.brightCyan}${choice.title}${c.reset}`
        : `${c.dim}${choice.title}${c.reset}`;
      const desc = choice.desc ? ` ${c.dim}(${choice.desc})${c.reset}` : "";
      stdout.write(`\r\x1b[K  ${pointer} ${text}${desc}\n`);
    }
  }

  render();

  return new Promise<string>((resolve) => {
    function onData(key: string) {
      if (key === "\u0003") {
        // Ctrl+C
        stdout.write(`\x1b[?25h\n`);
        process.exit(0);
      }

      if (key === "\r" || key === "\n") {
        // Enter
        cleanup();
        resolve(choices[selectedIndex].value);
        return;
      }

      if (key === "\u001b[A" || key === "k") {
        // Up arrow
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
      } else if (key === "\u001b[B" || key === "j") {
        // Down arrow
        selectedIndex = (selectedIndex + 1) % choices.length;
      }

      // Move cursor back up to re-render
      stdout.write(`\x1b[${choices.length + 1}A`);
      render();
    }

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write(`\x1b[?25h\n`); // Show cursor
    }

    stdin.on("data", onData);
  });
}

export async function promptText(message: string, defaultValue = ""): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptMsg = defaultValue
    ? `${c.bold}${c.brightCyan}?${c.reset} ${message} ${c.dim}(${defaultValue})${c.reset}: `
    : `${c.bold}${c.brightCyan}?${c.reset} ${message}: `;

  return new Promise((resolve) => {
    rl.question(promptMsg, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}
