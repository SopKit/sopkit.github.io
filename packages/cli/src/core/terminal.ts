/**
 * @file packages/cli/src/core/terminal.ts
 * @description Low-level terminal controller with SGR mouse tracking,
 * alternate screen buffer, raw mode, and TrueColor support.
 */

export interface TerminalSize {
  columns: number;
  rows: number;
}

export class Terminal {
  private static isRaw = false;
  private static mouseEnabled = false;
  private static altScreenActive = false;

  /**
   * Returns current terminal dimensions.
   */
  public static getSize(): TerminalSize {
    return {
      columns: process.stdout.columns || 80,
      rows: process.stdout.rows || 24,
    };
  }

  /**
   * Enters raw mode for full character-by-character and mouse event capture.
   */
  public static enterRawMode(): void {
    if (!process.stdin.isTTY || this.isRaw) return;
    try {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      this.isRaw = true;
    } catch {
      // Ignore if not a TTY
    }
  }

  /**
   * Leaves raw mode.
   */
  public static leaveRawMode(): void {
    if (!this.isRaw) return;
    try {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      this.isRaw = false;
    } catch {
      // Ignore
    }
  }

  /**
   * Enables ANSI 1000/1002/1006 SGR mouse reporting mode.
   * Allows capturing button clicks, mouse wheel scrolls, and coordinates.
   */
  public static enableMouse(): void {
    if (this.mouseEnabled || !process.stdout.isTTY) return;
    // 1000h: normal tracking, 1002h: button event tracking, 1006h: SGR extended coordinates
    process.stdout.write("\x1b[?1000h\x1b[?1002h\x1b[?1006h");
    this.mouseEnabled = true;
  }

  /**
   * Disables mouse reporting mode.
   */
  public static disableMouse(): void {
    if (!this.mouseEnabled) return;
    process.stdout.write("\x1b[?1000l\x1b[?1002l\x1b[?1006l");
    this.mouseEnabled = false;
  }

  /**
   * Hides the terminal cursor.
   */
  public static hideCursor(): void {
    process.stdout.write("\x1b[?25l");
  }

  /**
   * Shows the terminal cursor.
   */
  public static showCursor(): void {
    process.stdout.write("\x1b[?25h");
  }

  /**
   * Moves cursor to top-left home position without clearing (prevents flicker).
   */
  public static cursorHome(): void {
    process.stdout.write("\x1b[H");
  }

  /**
   * Clears screen and homes cursor.
   */
  public static clearScreen(): void {
    process.stdout.write("\x1b[2J\x1b[H");
  }

  /**
   * Restores terminal to default interactive state.
   */
  public static restore(): void {
    this.disableMouse();
    this.showCursor();
    this.leaveRawMode();
  }
}
