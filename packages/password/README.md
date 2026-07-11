# `@sopkit/password`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.github.io/password-generator/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.github.io/password-generator/)

Premium, lightweight password generation and strength analysis library for Browser and Node.js. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit Password Generator](https://sopkit.github.io/password-generator/).

## Features
- Highly customizable password generator (custom length, character pool filters).
- Password strength analysis using Information Entropy (shannon entropy) thresholds.
- Security suggestions dynamically tailored to user inputs.
- Zero dependencies.
- ESM and CommonJS support.

## Installation
```bash
npm install @sopkit/password
```

## Quick Start

### ESM
```typescript
import { generate, analyze } from "@sopkit/password";

// Generate secure password
const pass = generate({ length: 16, uppercase: true, numbers: true, symbols: true });

// Strength Analysis
const analysis = analyze("P@ssw0rd123!");
console.log(`Entropy: ${analysis.entropy} bits`);
console.log(`Strength Score: ${analysis.score}/4 (${analysis.label})`);
console.log("Suggestions:", analysis.suggestions);
```

## License
MIT © [SopKit](https://sopkit.github.io/)
