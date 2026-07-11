# `@sopkit/validator`

[![Playground](https://img.shields.io/badge/SopKit-Playground-blueviolet?style=for-the-badge&logo=javascript)](https://sopkit.github.io/seotoolkit/)
[![Security](https://img.shields.io/badge/Sandbox-100%25%20Client--Side-emerald?style=for-the-badge)](https://sopkit.github.io/seotoolkit/)

Premium, ultra-fast validation library for email, URLs, domains, IP addresses, credit cards, and MAC addresses. Part of the SopKit utility ecosystem.

## Online Interactive Tool
You can use the browser-based interactive version of this tool at [SopKit SEO Toolkit](https://sopkit.github.io/seotoolkit/).

## Features
- Full RFC compliant Email validation
- Standard URL parsing checks
- Strict Domain name validation
- IPv4 & IPv6 format validation
- MAC address checks
- Luhn Algorithm for Credit Card validation
- Zero dependencies
- ESM and CommonJS support

## Installation
```bash
npm install @sopkit/validator
```

## Quick Start

### ESM
```typescript
import { isEmail, isUrl, isDomain, isIp, isMacAddress, isCreditCard } from "@sopkit/validator";

isEmail("shaswatraj3@gmail.com"); // true
isUrl("https://sopkit.github.io"); // true
isDomain("sopkit.github.io"); // true
isIp("192.168.1.1"); // true
isMacAddress("00:1A:2B:3C:4D:5E"); // true
isCreditCard("49927398716"); // true (or false based on Luhn check)
```

## License
MIT © [SopKit](https://sopkit.github.io/)
