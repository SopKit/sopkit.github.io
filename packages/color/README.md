# `@sopkit/color`

Premium, lightweight colorspace conversion utility for HEX, RGB, and HSL. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit Color Converter](https://sopkit.github.io/color-converter/).

## Features
- Convert HEX to RGB
- Convert RGB to HEX
- Convert RGB to HSL
- Convert HSL to RGB
- Zero dependencies
- ESM and CommonJS support

## Installation
```bash
npm install @sopkit/color
```

## Quick Start

### ESM
```typescript
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "@sopkit/color";

// HEX to RGB
const rgb = hexToRgb("#3b82f6"); // { r: 59, g: 130, b: 246 }

// RGB to HEX
const hex = rgbToHex(59, 130, 246); // "#3b82f6"

// RGB to HSL
const hsl = rgbToHsl(59, 130, 246); // { h: 217, s: 91, l: 60 }

// HSL to RGB
const rgb2 = hslToRgb(217, 91, 60); // { r: 59, g: 130, b: 246 }
```

### CommonJS
```javascript
const { hexToRgb } = require("@sopkit/color");

const rgb = hexToRgb("ffffff");
```

## License
MIT © [SopKit](https://sopkit.github.io/)
