---
name: sopkit-cli
description: Guidelines and architectural standards for developing, maintaining, and publishing the interactive SopKit CLI and its suite of terminal utilities.
---

# SopKit CLI Development & Architecture Guide

The SopKit CLI (`packages/cli`) is an interactive, zero-dependency, mouse-and-keyboard driven terminal application modeled after modern TUI applications like OpenCode and lazygit.

## Architecture & Codebase Structure

The CLI is structured into modular layers:

```
packages/cli/
├── bin/
│   └── sopkit.cjs           # Executable entrypoint (#!/usr/bin/env node)
├── src/
│   ├── core/
│   │   ├── terminal.ts      # ANSI escapes, screen buffer, TrueColor, raw mode
│   │   ├── mouse.ts         # SGR mouse tracking (1000/1002/1006 protocol)
│   │   └── keyboard.ts      # Keypress parser (arrows, shortcuts, typing)
│   ├── ui/
│   │   ├── banner.ts        # ASCII hero banner and metadata badges
│   │   ├── search-bar.ts    # Interactive search box with mouse focus & filter
│   │   ├── tool-menu.ts     # Scrollable menu with click hit-testing
│   │   ├── card.ts          # Rounded TrueColor borders, meters, badges
│   │   └── hit-zone.ts      # Spatial 2D click-coordinate registration & dispatch
│   ├── tools/
│   │   ├── pdf/             # PDF page count, metadata, split/merge
│   │   ├── image/           # Image dimensions, format conversion, terminal ASCII
│   │   ├── bg-remover/      # Pure-buffer background removal & alpha transparency
│   │   ├── json/            # Format, minify, validate, JSON-to-TypeScript, query
│   │   ├── hash/            # SHA-256, SHA-512, MD5, HMAC
│   │   ├── base64/          # Base64 encode/decode & file conversion
│   │   ├── password/        # Entropy evaluator & visual strength meter
│   │   ├── color/           # HEX, RGB, HSL converter & TrueColor visual swatch
│   │   └── ...              # Other modular tools
│   ├── app.ts               # Interactive TUI state machine & router
│   └── index.ts             # Direct CLI command dispatcher & TUI launcher
├── test/
│   └── cli.test.js          # Automated tests for tool functions
├── package.json
└── tsup.config.ts
```

## Mouse Navigation Support (SGR 1006 Protocol)

The SopKit CLI supports full mouse clicking and scroll wheel navigation:
1. **Enable Mouse Tracking**:
   ```ts
   // 1000: normal tracking, 1002: button-event tracking, 1006: SGR extended coordinates
   process.stdout.write("\x1b[?1000h\x1b[?1002h\x1b[?1006h");
   ```
2. **Disable Mouse Tracking on Exit**:
   ```ts
   process.stdout.write("\x1b[?1000l\x1b[?1002l\x1b[?1006l\x1b[?25h");
   ```
3. **Parse SGR Sequences**:
   - Format: `\x1b[<button;col;rowM` (press) or `\x1b[<button;col;rowm` (release).
   - `button = 0`: Left click.
   - `button = 64`: Wheel scroll up.
   - `button = 65`: Wheel scroll down.
   - Register interactive UI components with bounding rectangles `(x1, y1, x2, y2)` and dispatch clicks directly to the active item or search input.

## Interactive Search Bar

- Positioned above the tool listing.
- When focused, typing filters tools in real time across name, description, and tags.
- Mouse click on the search bar focuses it for immediate typing.
- Pressing `Escape` clears the query or returns focus to list navigation.

## Direct Command Mode

Every tool supports non-interactive execution for scripting and pipelines:
- `sopkit hash sha256 "my-secret"`
- `sopkit pdf info sample.pdf`
- `sopkit image ascii photo.png`
- `sopkit bg-remover photo.png output.png --tolerance 25`
- `sopkit json format input.json`
- `sopkit password 32`

## Building & Verification

```bash
# In packages/cli:
npm run build

# Run CLI locally:
node bin/sopkit.cjs
```
