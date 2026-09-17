# @sopkit/hash

<a href="https://visitorbadge.io/status?path=https%3A%2F%2Fsopkit.space%2Fhash-generator%2F"><img src="https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fsopkit.space%2Fhash-generator%2F&countColor=%23263759&style=flat" /></a>

Ultra-fast, zero-dependency cryptographic hashing utilities for modern JavaScript runtimes (Browser, Node.js, Cloudflare Workers, Bun, Deno).

## Features

- ⚡ **Zero Dependencies**: Pure standard Web Crypto API and optimized pure-JS algorithms.
- 🔒 **Comprehensive**: SHA-256, SHA-512, SHA-1, HMAC-SHA256, and synchronous MD5.
- 🌐 **Isomorphic**: Runs natively in browser and server environments.
- 🛡️ **Timing Attack Protection**: Built-in constant-time comparison helper `compareHash`.
- 📦 **Dual Output**: ESM and CommonJS with full TypeScript typings.

## Installation

```bash
npm install @sopkit/hash
```

## Quick Start

```typescript
import { sha256, md5, hmacSha256, compareHash } from "@sopkit/hash";

// Asynchronous SHA-256
const hash = await sha256("hello world");
console.log(hash); // "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"

// Synchronous MD5
const md5Hash = md5("hello world");
console.log(md5Hash); // "5eb63bbbe01eeed093cb22bb8f5acdc3"

// HMAC-SHA256
const signature = await hmacSha256("my-secret", "payload");
console.log(signature);

// Timing-safe comparison
const isValid = compareHash(hash, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
```

## License

MIT © [SopKit](https://sopkit.space/)
