# `@sopkit/xml`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.github.io/xml-formatter/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.github.io/xml-formatter/)

Premium, lightweight XML formatter, validator, and minifier for both Browser and Node.js. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit XML Formatter](https://sopkit.github.io/xml-formatter/).

## Features
- XML syntax validation with nested tag mismatch checking.
- Clean hierarchical formatting (custom space indents).
- XML minification (removes comments and whitespace).
- Cross-compatible with Browser and Node.js.
- Zero dependencies.
- ESM and CommonJS support.

## Installation
```bash
npm install @sopkit/xml
```

## Quick Start

### ESM
```typescript
import { validate, format, minify } from "@sopkit/xml";

const rawXml = "<store><book id='1'><title>The Hobbit</title></book></store>";

// Validation
const res = validate(rawXml);
if (res.valid) {
  console.log("Valid XML!");
} else {
  console.log("Invalid:", res.error);
}

// Formatting
const pretty = format(rawXml, 4);

// Minification
const mini = minify(pretty);
```

### CommonJS
```javascript
const { format } = require("@sopkit/xml");

const pretty = format("<root><child>text</child></root>");
```

## License
MIT © [SopKit](https://sopkit.github.io/)
