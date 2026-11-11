# Redirect manifests

Each JSON file here is an array of `{ "from": "/old-path", "to": "/new-path", "reason": "..." }`.
`scripts/generate-redirects.cjs` merges every `*.json` in this directory into
`public/_redirects` (Cloudflare `_redirects` format, 301) at build time. Paths are
emitted both with and without a trailing slash because the site is a static
export with `trailingSlash: true`.

Keep one file per consolidation area so changes stay reviewable:

- `tools.json` – duplicate tool routes folded into a canonical tool
- `opportunities.json` – retired long-tail "SEO opportunity" pages folded into their parent tool
- `blog.json` – retired thin blog posts folded into the tool they promoted
