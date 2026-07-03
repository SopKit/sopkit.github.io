# `@sopkit/uuid`

Premium, lightweight UUID v4 and v1 generator and validator for Browser and Node.js. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit UUID Generator](https://sopkit.github.io/uuid-generator/).

## Features
- Cryptographically secure UUID v4 generation using Web Crypto API.
- Fully compatible UUID v1 generation.
- Highly optimized UUID validation.
- UUID version detection.
- Zero dependencies.
- ESM and CommonJS support.

## Installation
```bash
npm install @sopkit/uuid
```

## Quick Start

### ESM
```typescript
import { v4, v1, validate, getVersion } from "@sopkit/uuid";

// Generate UUID v4
const uuid4 = v4(); // "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"

// Generate UUID v1
const uuid1 = v1();

// Validate
validate(uuid4); // true
validate("not-a-uuid"); // false

// Get version
getVersion(uuid4); // 4
getVersion(uuid1); // 1
```

### CommonJS
```javascript
const { v4, validate } = require("@sopkit/uuid");

const id = v4();
console.log(validate(id)); // true
```

## License
MIT © [SopKit](https://sopkit.github.io/)
