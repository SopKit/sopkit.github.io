# SopKit NPM Ecosystem

SopKit exposes its core utility logic as independent, reusable, and lightweight NPM packages under the `@sopkit` scope. 

Developers can use the same clean, zero-dependency code that powers the SopKit website inside their own Node.js, Web, or command-line projects.

---

## Central CLI

### `@sopkit/cli`
An interactive prompt-driven terminal interface to use all SopKit utilities directly from your terminal.

- **Usage**:
  ```bash
  npx @sopkit/cli
  ```
- **Global Installation**:
  ```bash
  npm install -g @sopkit/cli
  sopkit
  ```

---

## Standard Packages

| Package | Purpose | Installation | Live Tool Link |
|---------|---------|--------------|----------------|
| **`@sopkit/base64`** | Full Unicode and URL-Safe Base64 encoding & decoding | `npm install @sopkit/base64` | [Base64 Encoder](https://sopkit.github.io/base64-encode/) |
| **`@sopkit/uuid`** | Secure UUID v4 (random) and v1 (timestamp) generation & validation | `npm install @sopkit/uuid` | [UUID Generator](https://sopkit.github.io/uuid-generator/) |
| **`@sopkit/slug`** | Accent-normalized, multilingual URL slug generator | `npm install @sopkit/slug` | [Slug Generator](https://sopkit.github.io/slug-generator/) |
| **`@sopkit/json`** | JSON syntax validator with line/column checks, pretty formatting, and minification | `npm install @sopkit/json` | [JSON Formatter](https://sopkit.github.io/json-formatter/) |
| **`@sopkit/color`** | Color space conversions supporting HEX, RGB, and HSL formats | `npm install @sopkit/color` | [Color Converter](https://sopkit.github.io/color-converter/) |

---

## Local Development & Compilation

To build all packages, run `npm run build` inside their respective subdirectories:

```bash
# Build @sopkit/base64
cd packages/base64 && npm run build

# Build @sopkit/uuid
cd packages/uuid && npm run build

# Build @sopkit/slug
cd packages/slug && npm run build

# Build @sopkit/json
cd packages/json && npm run build

# Build @sopkit/color
cd packages/color && npm run build

# Build @sopkit/cli
cd packages/cli && npm run build
```

Each package compiles to both CommonJS (`.cjs`) and ES Modules (`.js`), includes full declaration types (`.d.ts`), and supports tree-shaking out-of-the-box.
