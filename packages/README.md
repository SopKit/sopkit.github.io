# SopKit Utility Libraries Ecosystem

<a href="https://visitorbadge.io/status?path=https%3A%2F%2Fsopkit.space%2Fpackages%2F"><img src="https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fsopkit.space%2Fpackages%2F&countColor=%23263759&style=flat" /></a>

This directory hosts the standalone, reusable developer packages maintained by SopKit. Every package is written in strict TypeScript, compiled with `tsup` to both ESM and CommonJS formats, and includes full types (`.d.ts`).

## Packages List

- **[`@sopkit/cli`](./cli)**: Interactive CLI dashboard providing a terminal UI & direct scriptable commands (`npx @sopkit/cli`).
- **[`@sopkit/sopkit`](./sopkit)**: Official SopKit developer toolkit distribution package (`npx @sopkit/sopkit`).
- **[`@sopkit/base64`](./base64)**: Full Unicode & URL-Safe Base64 encoder and decoder.
- **[`@sopkit/uuid`](./uuid)**: Cryptographically secure UUID v4 & v1 generator and validator.
- **[`@sopkit/slug`](./slug)**: Multilingual URL slug generator with accent normalization.
- **[`@sopkit/json`](./json)**: JSON formatter, minifier, and syntax validator.
- **[`@sopkit/color`](./color)**: HEX, RGB, and HSL colorspace converter.
- **[`@sopkit/validator`](./validator)**: Fast validation suite for Email, URLs, Domains, IPs, MACs, and Credit Cards.
- **[`@sopkit/password`](./password)**: Customizable password generator and entropy analyzer.
- **[`@sopkit/xml`](./xml)**: XML formatter, minifier, and syntax validator.
- **[`@sopkit/jwt`](./jwt)**: Zero-dependency JWT inspector and token parser.
- **[`@sopkit/hash`](./hash)**: High-performance SHA-256, SHA-512, MD5, and HMAC hashing suite.

---

## How to Compile

To compile all packages in the workspace, run `npm run build` inside their respective directories, or run from the workspace root:

```bash
# Build a specific package (e.g., base64)
npm run build --prefix packages/base64
```

## How to Publish

To publish new versions to NPM, ensure you are logged in (`npm login`) and run:

```bash
npm run publish-all
```

The script will build and publish all packages under public access access.
