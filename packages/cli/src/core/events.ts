/**
 * @file packages/cli/src/core/events.ts
 * @description Event decoding for SGR terminal mouse reports and keyboard keystrokes.
 */

export interface MouseEvent {
  type: "mouse";
  button: number; // 0 = left, 1 = middle, 2 = right, 64 = wheel up, 65 = wheel down
  col: number; // 1-indexed column
  row: number; // 1-indexed row
  isRelease: boolean;
  isWheelUp: boolean;
  isWheelDown: boolean;
  isLeftClick: boolean;
}

export interface KeyEvent {
  type: "key";
  name:
    | "up"
    | "down"
    | "left"
    | "right"
    | "enter"
    | "escape"
    | "backspace"
    | "tab"
    | "ctrl_c"
    | "char";
  char?: string;
  raw: string;
}

export type InputEvent = MouseEvent | KeyEvent;

/**
 * Parses raw terminal chunk into one or more InputEvents.
 */
export function parseInputChunk(chunk: string): InputEvent[] {
  const events: InputEvent[] = [];

  let i = 0;
  while (i < chunk.length) {
    // SGR Mouse sequence: \x1b[<button;col;row(M|m)
    if (chunk.startsWith("\x1b[<", i)) {
      const endMatch = /[Mm]/.exec(chunk.slice(i + 3));
      if (endMatch && endMatch.index !== undefined) {
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
            isLeftClick: btn === 0 && !isRelease,
          });
        }
        i += fullSeq.length;
        continue;
      }
    }

    // Standard ANSI Arrow / Escape sequences
    if (chunk.startsWith("\x1b[A", i)) {
      events.push({ type: "key", name: "up", raw: "\x1b[A" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1b[B", i)) {
      events.push({ type: "key", name: "down", raw: "\x1b[B" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1b[C", i)) {
      events.push({ type: "key", name: "right", raw: "\x1b[C" });
      i += 3;
      continue;
    }
    if (chunk.startsWith("\x1b[D", i)) {
      events.push({ type: "key", name: "left", raw: "\x1b[D" });
      i += 3;
      continue;
    }

    // Ctrl+C
    if (chunk[i] === "\u0003") {
      events.push({ type: "key", name: "ctrl_c", raw: "\u0003" });
      i++;
      continue;
    }

    // Enter
    if (chunk[i] === "\r" || chunk[i] === "\n") {
      events.push({ type: "key", name: "enter", raw: chunk[i] });
      i++;
      continue;
    }

    // Tab
    if (chunk[i] === "\t") {
      events.push({ type: "key", name: "tab", raw: "\t" });
      i++;
      continue;
    }

    // Backspace
    if (chunk[i] === "\x7f" || chunk[i] === "\b") {
      events.push({ type: "key", name: "backspace", raw: chunk[i] });
      i++;
      continue;
    }

    // Standalone Escape
    if (chunk[i] === "\x1b") {
      events.push({ type: "key", name: "escape", raw: "\x1b" });
      i++;
      continue;
    }

    // Regular character keystroke
    events.push({
      type: "key",
      name: "char",
      char: chunk[i],
      raw: chunk[i],
    });
    i++;
  }

  return events;
}
