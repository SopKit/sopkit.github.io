# Security Architecture & File Processing Hardening

## Overview
As a platform handling user documents, images, and remote URL utilities, SopKit implements multiple layers of defense-in-depth across client memory boundaries, remote HTTP fetches, and server endpoints.

```
src/server/
├── security/
│   ├── ssrf.ts                # Safe remote fetch blocking private networks and metadata APIs
│   ├── file-validation.ts     # Magic byte verification, ZIP bomb guard, path traversal defense
│   └── headers.ts             # Strict Content-Security-Policy & transport security
└── errors/                    # Operational error hierarchy (ValidationError, SecurityError)
```

## Core Defenses
1. **SSRF Mitigation (`safeFetch`)**:
   - Explicit protocol restrictions (HTTP & HTTPS only; no `file://`, `gopher://`, etc.).
   - Rejects loopback (`127.0.0.1`, `::1`), link-local (`169.254.169.254`), and private RFC 1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
   - Rejects cloud metadata hostnames (`metadata.google.internal`).
   - Disables automatic redirects (`redirect: "manual"`) to prevent open redirect SSRF bypasses.
2. **Decompression Bomb Protection**:
   - Detects abnormal compression ratios (>100:1).
   - Enforces a 50MB uncompressed ceiling on client-side and server-side archives.
   - Enforces a 500-entry maximum file count per archive.
3. **MIME Spoofing & Magic Bytes**:
   - Inspects raw buffer headers (PNG, JPEG, GIF, WebP, PDF, ZIP) rather than trusting client-provided file extensions.
4. **Path Traversal Defense**:
   - Sanitizes filenames by stripping null bytes, directory traversal patterns (`../`, `..\\`), and absolute path prefixes.
5. **Content Security Policy (CSP)**:
   - Grants `'wasm-unsafe-eval'` and `worker-src blob:` specifically for WebAssembly and Web Worker isolation without compromising overall script security.
