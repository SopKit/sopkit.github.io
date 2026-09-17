# sopkit

> ⚡ **Official SopKit Developer Toolkit & Terminal Suite** — 17+ high-performance offline developer tools directly in your terminal.

[![npm version](https://img.shields.io/npm/v/sopkit.svg?style=flat-square&color=38bdf8)](https://www.npmjs.com/package/sopkit)
[![npm downloads](https://img.shields.io/npm/dm/sopkit.svg?style=flat-square&color=22c55e)](https://www.npmjs.com/package/sopkit)
[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsopkit&label=VISITORS&labelColor=%230f172a&countColor=%230284c7)](https://visitorbadge.io/status?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsopkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Run 17+ essential developer tools in your terminal without internet, zero tracking, and instant execution.

---

## ⚡ Instant Usage (No Installation Required)

```bash
npx sopkit
```

Or install globally:

```bash
npm install -g sopkit
```

Then run anywhere:

```bash
sopkit
```

---

## 🛠️ CLI Direct Command Usage

```bash
# 🆔 UUIDs
sopkit uuid v4 3                          # Generates 3 random UUID v4s
sopkit uuid v1                            # Generates timestamp-based UUID v1

# 🕒 Timestamp & Epoch
sopkit timestamp now                      # Current Unix epoch in seconds and milliseconds
sopkit timestamp 1789680000               # Converts epoch timestamp to human date
sopkit timestamp "2026-09-18T10:00:00Z"   # Converts ISO 8601 date to epoch

# 🔤 Text Case Converter
sopkit case "hello world sopkit"          # camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE

# 📝 Lorem Ipsum Generator
sopkit lorem 15 words                     # Generates 15 words of placeholder text
sopkit lorem 3 paragraphs                 # Generates 3 paragraphs

# 🌐 URL Inspector & Encoder
sopkit url "https://sopkit.space/tools?cat=image&page=1#top" # Inspects URL components & query parameters
sopkit url encode "hello world & foo=bar" # URL encodes string
sopkit url decode "hello%20world"         # URL decodes string

# 💾 Data Size & Byte Converter
sopkit bytes 10485760                     # Converts bytes to binary (MiB) and decimal (MB)
sopkit bytes 2.5GB                        # Parses human string to bytes

# 📡 HTTP Status Code Reference
sopkit http 429                           # Detailed lookup for HTTP 429 Too Many Requests
sopkit http 502                           # Detailed lookup for HTTP 502 Bad Gateway

# 🔣 HTML Entity Escape
sopkit html escape "<h1>SopKit & AI</h1>" # Escapes HTML entities
sopkit html unescape "&lt;h1&gt;"         # Unescapes HTML entities

# 📦 Base64
sopkit base64 encode "Hello SopKit"       # SGVsbG8gU29wS2l0
sopkit base64 decode "SGVsbG8gU29wS2l0"   # Hello SopKit

# 🔑 Cryptographic Hashes
sopkit hash sha256 "password123"          # Generates SHA-256 hash
sopkit hash sha512 "secure token"         # Generates SHA-512 hash
sopkit hash md5 "file content"            # Generates MD5 hash

# 🔗 URL Slugify
sopkit slug "Top 10 Free Image Tools"     # top-10-free-image-tools

# 🔒 Password Generator
sopkit password 24                        # Generates secure 24-character password

# 🎨 Color Converter
sopkit color "#38bdf8"                    # Converts to RGB, HSL with visual terminal swatch

# ✅ Format Validator
sopkit validator email "dev@sopkit.space" # Returns VALID or INVALID
sopkit validator url "https://sopkit.space"
sopkit validator ip "192.168.1.1"
```

---

## 🌐 Web Utilities

Looking for graphical browser-based tools? Visit [sopkit.space](https://sopkit.space) for 600+ free online utilities.

## License

MIT © [SopKit](https://sopkit.space)
