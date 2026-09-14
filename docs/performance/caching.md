# HTTP & Edge Caching Architecture

## Caching Matrix

| Asset Class | Browser Cache-Control | CDN / Cloudflare Cache-Control | Invalidation Strategy |
| :--- | :--- | :--- | :--- |
| **Immutable Assets** (`/_next/static/*`) | `public, max-age=31536000, immutable` | `public, max-age=31536000` | Content-hashed file paths |
| **Static Fonts** (`/fonts/*`) | `public, max-age=31536000, immutable` | `public, max-age=31536000` | Versioned file paths |
| **Optimized Media** (`/images/*`, icons) | `public, max-age=2592000, stale-while-revalidate=86400` | `public, max-age=31536000` | Content hash query or purge |
| **Public Static Pages** (SSG/ISR) | `public, max-age=3600, s-maxage=86400` | `public, max-age=86400, stale-while-revalidate=604800` | Deployment tag purge |
| **Metadata & Sitemaps** (`/sitemap.xml`, `robots.txt`) | `public, max-age=86400, s-maxage=86400` | `public, max-age=604800` | Daily revalidation |
| **Dynamic APIs** (`/api/*`) | `public, max-age=60, s-maxage=300` | None | Real-time stale-while-revalidate |
| **User Data / Processing** | `private, no-cache, no-store, must-revalidate` | None | Never cached |

## Cloudflare Edge Strategy
- **Edge Cache TTL**: 1 day default for static HTML with stale-while-revalidate for instantaneous edge responses.
- **Micro-caching**: 5–60s edge caching for read-heavy public APIs to protect origin from traffic spikes.
- **Zero Data Leakage**: User file uploads and converted output streams are processed client-side or streamed through ephemeral zero-knowledge workers without caching.
