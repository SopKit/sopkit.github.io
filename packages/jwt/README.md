# `@sopkit/jwt`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.github.io/jwt-decoder/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.github.io/jwt-decoder/)

Premium, lightweight JSON Web Token (JWT) decoder and format validator for both Browser and Node.js. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit JWT Decoder](https://sopkit.github.io/jwt-decoder/).

## Features
- Unicode/UTF-8 compliant decoding of token payloads (supports emjois and localized strings).
- Strictly parses and isolates Token Header, Payload, and Signature components.
- Zero dependencies.
- ESM and CommonJS support.

## Installation
```bash
npm install @sopkit/jwt
```

## Quick Start

### ESM
```typescript
import { decode, verifyFormat } from "@sopkit/jwt";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

if (verifyFormat(token)) {
  const { header, payload, signature } = decode(token);
  console.log("Header:", header); // { alg: "HS256", typ: "JWT" }
  console.log("Payload:", payload); // { sub: "1234567890", name: "John Doe", ... }
  console.log("Signature Hash:", signature);
}
```

### CommonJS
```javascript
const { decode } = require("@sopkit/jwt");

const { payload } = decode(token);
```

## License
MIT © [SopKit](https://sopkit.github.io/)
