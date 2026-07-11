# `@sopkit/base64`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.github.io/base64-encode/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.github.io/base64-encode/)

Premium, lightweight Base64 encoder and decoder for both Browser and Node.js environments. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit Base64 Encoder/Decoder](https://sopkit.github.io/base64-encode/).

## Features
- Full Unicode/UTF-8 support (unlike standard `btoa`/`atob` which fail on emojis and special chars)
- URL-safe encoding/decoding (`+` ➜ `-`, `/` ➜ `_`, strips `=`)
- Zero dependencies
- Fully typed API with strict TypeScript
- ESM and CommonJS support

## Installation
```bash
npm install @sopkit/base64
```

## Quick Start

### ESM
```typescript
import { encode, decode, urlEncode, urlDecode, isValid } from "@sopkit/base64";

const text = "Hello World 🚀";

// Standard base64
const encoded = encode(text); // "SGVsbG8gV29ybGQg8J+Zog=="
const decoded = decode(encoded); // "Hello World 🚀"

// URL-safe base64
const urlSafeEncoded = urlEncode(text); // "SGVsbG8gV29ybGQg8J-Zog"
const urlSafeDecoded = urlDecode(urlSafeEncoded); // "Hello World 🚀"

// Validation
isValid("SGVsbG8gV29ybGQg8J+Zog=="); // true
isValid("invalid base64!"); // false
```

### CommonJS
```javascript
const { encode, decode } = require("@sopkit/base64");

const encoded = encode("Hello World");
const decoded = decode(encoded);
```

## License
MIT © [SopKit](https://sopkit.github.io/)
