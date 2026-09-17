# `@sopkit/slug`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.space/slug-generator/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.space/slug-generator/)
[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40sopkit%2Fslug&label=VISITORS&labelColor=%230f172a&countColor=%230284c7)](https://visitorbadge.io/status?path=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40sopkit%2Fslug)

Premium, lightweight URL slug generator and text clean-up utility with full Unicode/diacritics support. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit Slug Generator](https://sopkit.space/slug-generator/).

## Features
- Unicode normalization (decomposes accents and diacritics like `é` ➜ `e`)
- Custom separators (e.g. `-`, `_`, or custom characters)
- Case control (force lowercase/preserve case)
- Strict clean-up filters out special URL-breaking symbols
- Zero dependencies
- ESM and CommonJS support

## Installation
```bash
npm install @sopkit/slug
```

## Quick Start

### ESM
```typescript
import { slugify, isValid } from "@sopkit/slug";

// Standard slugification
slugify("Hello World & Universe!"); // "hello-world-universe"

// Accent normalization
slugify("Café & résumé"); // "cafe-resume"

// Custom options
slugify("User Profile ID", { separator: "_", lowercase: false }); // "User_Profile_ID"

// Validation
isValid("hello-world"); // true
isValid("hello world!"); // false
```

### CommonJS
```javascript
const { slugify } = require("@sopkit/slug");

const slug = slugify("SopKit Slugify"); // "sopkit-slugify"
```

## License
MIT © [SopKit](https://sopkit.space/)
