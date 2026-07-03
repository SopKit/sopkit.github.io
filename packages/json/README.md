# `@sopkit/json`

Premium, lightweight JSON formatter, validator, and minifier for both Browser and Node.js. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit JSON Formatter](https://sopkit.github.io/json-formatter/).

## Features
- Robust JSON validation with detailed syntax error reporting (including line and column numbers).
- Beautiful JSON formatting (custom spaces or tabs).
- Fast JSON minification (collapses whitespaces).
- Zero dependencies.
- ESM and CommonJS support.

## Installation
```bash
npm install @sopkit/json
```

## Quick Start

### ESM
```typescript
import { validate, format, minify } from "@sopkit/json";

const rawJson = '{"name": "SopKit", "active": true}';

// Validation
const res = validate(rawJson);
if (res.valid) {
  console.log("Valid!", res.data);
} else {
  console.log(`Failed at line ${res.line}, col ${res.column}: ${res.error}`);
}

// Formatting
const pretty = format(rawJson, { space: 4 });

// Minification
const mini = minify(pretty); // '{"name":"SopKit","active":true}'
```

### CommonJS
```javascript
const { validate, format } = require("@sopkit/json");

const pretty = format('{"status":"ok"}');
```

## License
MIT © [SopKit](https://sopkit.github.io/)
