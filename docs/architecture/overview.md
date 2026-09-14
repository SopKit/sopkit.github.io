# SopKit Architecture Overview

## Mission & Principles
SopKit is designed to be the world's most performant, privacy-preserving, and developer-friendly online utility platform. 

The architecture is founded on five core pillars:
1. **Zero-Knowledge Browser Processing**: Heavy tools (PDF manipulation, image resizing, document conversion, audio generation) execute client-side using WebAssembly, Web Workers, and standard Canvas/Blob APIs. User data never leaves the client without explicit opt-in.
2. **Sub-Second Core Web Vitals**: Every route enforces strict budgets (LCP < 2.5s mobile, < 1.8s desktop; CLS < 0.05). Server components are the default; client components exist only at leaf interaction boundaries.
3. **Enterprise Security Hardening**: Built-in defenses against Server-Side Request Forgery (SSRF), decompression bombs (ZIP bombs), MIME-type spoofing, and malicious path traversal.
4. **Structured Organic Discoverability**: Systematic SEO/AEO/GEO architecture with automated Schema.org JSON-LD generation (`WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`, `HowTo`), canonical URL hygiene, and lightweight server-rendered HTML.
5. **Zero Layout Shifts (Zero-CLS Monetization)**: Monetization ad slots feature hard-coded intrinsic aspect ratios and layout containment, preventing ad layout shifts.
