# SopKit Backend (Cloudflare Workers API)

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FSopKit%2Fsopkit.github.io%2Fsopkit-backend&label=VISITORS&labelColor=%230f172a&countColor=%230284c7)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FSopKit%2Fsopkit.github.io%2Fsopkit-backend)

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
