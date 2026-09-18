# `@sopkit/cli`

> **SopKit CLI — Fast, privacy-first developer utilities in your terminal with mouse navigation & search.**

[![npm version](https://img.shields.io/npm/v/@sopkit/cli.svg?style=flat-square&color=06b6d4)](https://www.npmjs.com/package/@sopkit/cli)
<a href="https://visitorbadge.io/status?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40sopkit%2Fcli"><img src="https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40sopkit%2Fcli&countColor=%23263759&style=flat" alt="Visitors" /></a>
[![license](https://img.shields.io/npm/l/@sopkit/cli.svg?style=flat-square)](https://github.com/SopKit/sopkit.github.io/blob/main/LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://sopkit.space/packages/cli)

Zero-dependency, standalone terminal application and developer toolkit. Operates both as an **interactive mouse-and-keyboard driven TUI app** (with live search and spatial hit testing) and as **direct scriptable CLI commands** for shell pipelines and CI workflows.

<div align="center">
  <img src="assets/demo.gif" alt="SopKit CLI Interactive Terminal Demo" width="760" style="border-radius: 8px;" />
</div>

Full web version with 600+ tools available at: **[sopkit.space](https://sopkit.space/)**

---

## ⚡ Key Highlights (v1.2.0)

- 🖱️ **Full Mouse Navigation**: Click on any tool, button, or search bar using SGR 1006 terminal mouse reporting. Use mouse wheel to scroll.
- 🔍 **Real-Time Tool Search Bar**: Instant filtering as you type or click to focus.
- 📄 **PDF Inspector & Merge**: Read page count, PDF version, encryption status, and combine PDFs without external binaries.
- 🖼️ **Image Inspector & ASCII Art**: Instant dimensions and format identification + TrueColor terminal ASCII art rendering.
- ✂️ **Background Remover**: Pure Node.js alpha transparency keying with configurable tolerance.
- ✨ **JSON Workbench**: Format with TrueColor syntax highlighting, minify, validate with line-pointers, and generate TypeScript interfaces.
- 🔑 **Cryptographic Suite**: SHA-256, SHA-512, MD5, and HMAC hashing.
- 📦 **Encoding & Text**: Base64, UUID v4/v1, URL slugs, password generator with entropy meter, and color converter.

---

## 🚀 Quickstart

### Option 1: Instant Run (Zero Installation via `npx`)
Run without installing anything:
```bash
# Launch visual interactive terminal app:
npx @sopkit/cli

# Run direct commands:
npx @sopkit/cli hash sha256 "secret"
npx @sopkit/cli pdf info sample.pdf
npx @sopkit/cli img info photo.png
npx @sopkit/cli bg-remover photo.png output.png --tolerance 25
npx @sopkit/cli json format input.json
npx @sopkit/cli json ts '{"user":"sopkit","active":true}'
npx @sopkit/cli uuid
npx @sopkit/cli password 24
```

### Option 2: Global Install (Enables `sopkit` command)
```bash
npm install -g @sopkit/cli

# Now run 'sopkit' anywhere:
sopkit
```

---

## 🛠️ Direct CLI Commands

```bash
# 📄 PDF Utilities
sopkit pdf info document.pdf            # Page count, version, encryption, metadata
sopkit pdf merge doc1.pdf doc2.pdf -o merged.pdf

# 🖼️ Image Utilities
sopkit img info photo.png               # Dimensions, format (PNG/JPEG/WEBP/GIF/SVG), size
sopkit img ascii photo.png 48           # Render TrueColor ASCII art preview in terminal

# ✂️ Background Remover
sopkit bg-remover photo.png transparent.png --tolerance 20
sopkit bg-remover logo.png out.png --color "#ffffff"

# ✨ JSON Workbench
sopkit json format data.json            # Pretty-print with syntax highlighting
sopkit json minify data.json            # Minify to single line
sopkit json validate data.json          # Syntax checker with line/column pointer
sopkit json ts data.json                # Generate TypeScript interfaces
sopkit json query ".users[0].name" data.json

# 🔑 Cryptographic Hashing
sopkit hash sha256 "my-token"
sopkit hash sha512 "data"
sopkit hash md5 "checksum"

# 📦 Base64
sopkit base64 encode "Hello World"
sopkit base64 decode "SGVsbG8gV29ybGQ="

# 🆔 UUID & Passwords
sopkit uuid                             # Generate UUID v4
sopkit password 32                      # 32-character high-entropy password

# 🎨 Design & Colors
sopkit color "#06b6d4"                  # HEX, RGB, HSL conversion

# 🔗 Text & Slugs
sopkit slug "Top 10 Developer Utilities 2026"
```

---

## 🎨 Interactive Terminal App Navigation

When executed without arguments (`sopkit`), the CLI launches the full interactive application:

- **Mouse Clicks**: Click any tool to select and launch it immediately. Click the search bar to focus and type.
- **Mouse Wheel**: Scroll through the tool catalog smoothly.
- **Search Bar**: Press `/` or `Tab` (or click with mouse) to search through tools in real-time.
- **Arrow Keys**: `↑` and `↓` navigate highlighted tools; `Enter` launches.
- **Shortcuts**: Press `1`-`9`, `0`, or letter shortcuts (`c` for case, `s` for slug, `p` for password, `q` to quit).

---

## 📄 License
MIT © [SopKit](https://sopkit.space/)
