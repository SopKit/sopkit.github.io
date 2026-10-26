// Validates that no non-indexable or redirect-only URL is listed in either
// sitemap. A sitemap must list URLs a crawler can index: a noindex page
// or a 308 redirect listed there is a contradictory signal (Google
// reports both as sitemap errors) and wastes crawl budget.
//
// Why this exists: static sitemap entries bypass the monetization
// indexable filter. In src/app/sitemap.ts the static list is prepended
// and wins the first-registration dedup, and in
// scripts/generate-sitemap.ts static pages are registered before tools,
// so a static entry for a noindex hub or a redirect page is listed even
// though the same route's tool-page path is correctly filtered out.
// That is exactly how /video-tools and /api-key-tester (hub pages whose
// generateToolMetadata call renders robots noindex) and /api-key-testers,
// /pro and /hire (bare permanentRedirect pages, 308, no indexable
// content) ended up in both sitemaps at 755 URLs. The pages themselves
// stay live and internally linked; only their listings were wrong.
//
// How it works (fs + regex over committed source, plus the real decision
// function imported by relative path — the same pattern
// scripts/generate-sitemap.ts already uses; the risky slug/category
// rules are NOT duplicated here, so a policy change flows through):
//   1. Forbidden set, from source:
//      a. Every literal-route generateToolMetadata call whose decision
//         (registry id + props.category or registry category, exactly
//         as constructToolMetadata computes it) is non-indexable.
//      b. Every non-dynamic page file with literal
//         `robots: { index: false }` metadata.
//      c. Every non-dynamic redirect-only page: it calls
//         permanentRedirect/redirect and contains no JSX tag, so it
//         serves a redirect and nothing else.
//      Dynamic [slug] pages are skipped throughout: their routes are
//      templates, and conditional redirects there (e.g. blog archive
//      page 1, intent extra-slug redirects) also serve real content.
//   2. Listed set: public/sitemap.xml <loc> paths, plus the static
//      entry lists in src/app/sitemap.ts and scripts/generate-sitemap.ts
//      (entry lines only — the comments naming excluded routes are not
//      entries and are ignored by the entry patterns).
//   3. Fail loudly (non-zero exit, listing every violation) if any
//      forbidden route is listed anywhere.
//
// Scope limits, stated plainly:
//   - This checks listings, not rendering: it trusts that
//     generateToolMetadata's robots output is what the page serves
//     (page metadata overrides layout metadata in Next.js), and that
//     a redirect-only file serves a redirect for its whole route.
//   - Tool-page listings are already decision-filtered in both
//     sitemaps, so they cannot regress through the static lists; the
//     static lists are where this validator looks.
//   - If a hub is deliberately flipped to indexable by a policy
//     change, its entry must be re-added by hand — this validator
//     forbids bad listings, it never adds good ones.
//
// Run: bun run validate:sitemap-indexable (also wired into `prebuild`,
// AFTER generate-sitemap, so it checks the just-generated file).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function fail(message: string): never {
  console.error(`\u274c ${message}`);
  process.exit(1);
}

// The real decision function, imported the way generate-sitemap.ts does.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { getMonetizationDecision } = await import("../src/data/monetization");

// --- Registry (same derivation as generate-sitemap.ts: raw tools.json
// entries carry no category field, so the category is the entry's own
// category or its parent category slug) ---
const toolsJsonPath = path.join(rootDir, "src", "constants", "tools.json");
if (!fs.existsSync(toolsJsonPath)) fail(`tools.json not found: ${toolsJsonPath}`);
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, "utf8"));
const byRoute = new Map<string, { id: string; category: string }>();
const byId = new Map<string, { id: string; category: string }>();
for (const [catKey, category] of Object.entries(
  toolsData.categories || {},
) as any[]) {
  if (!category || !Array.isArray(category.tools)) continue;
  const catSlug = category.slug || catKey;
  for (const tool of category.tools) {
    const entry = { id: tool.id, category: tool.category || catSlug };
    if (tool.route) byRoute.set(tool.route, entry);
    if (tool.id) byId.set(tool.id, entry);
  }
}

// --- Walk page files ---
const appDir = path.join(rootDir, "src", "app");
const pageFiles: string[] = [];
(function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === "page.tsx") pageFiles.push(p);
  }
})(appDir);

function routeFromFile(file: string): string {
  const rel = path.relative(appDir, file);
  const segments = rel.split(path.sep).filter((s) => s !== "page.tsx");
  const kept = segments.filter((s) => !/^\(.*\)$/.test(s));
  return kept.length === 0 ? "/" : `/${kept.join("/")}`;
}

// Extract the object literal passed to generateToolMetadata, honouring
// braces inside double-quoted strings, so nested values cannot cut the
// scan short.
function callBodies(src: string): string[] {
  const bodies: string[] = [];
  const marker = "generateToolMetadata({";
  let from = 0;
  for (;;) {
    const start = src.indexOf(marker, from);
    if (start === -1) break;
    let i = start + marker.length - 1; // at the opening brace
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (; i < src.length; i++) {
      const ch = src[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') inString = false;
      } else if (ch === '"') inString = true;
      else if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          bodies.push(src.slice(start + marker.length, i));
          break;
        }
      }
    }
    from = start + marker.length;
  }
  return bodies;
}

const forbidden = new Map<string, string>(); // route -> reason
const addForbidden = (route: string, reason: string) => {
  if (!forbidden.has(route)) forbidden.set(route, reason);
};

for (const file of pageFiles) {
  const src = fs.readFileSync(file, "utf8");
  const isDynamic = file.split(path.sep).some((s) => s.startsWith("["));
  const rel = path.relative(rootDir, file);

  // (a) generateToolMetadata noindex routes (literal routes only).
  for (const body of callBodies(src)) {
    const routeM = body.match(/route:\s*"([^"]+)"/);
    if (!routeM) continue;
    const route = routeM[1];
    if (route.includes("[") || route.includes("${")) continue;
    const catM = body.match(/category:\s*"([^"]+)"/);
    const idM = body.match(/\bid:\s*"([^"]+)"/);
    const reg = byRoute.get(route) || (idM ? byId.get(idM[1]) : undefined);
    const slug = reg?.id || route.replace(/^\//, "");
    const category = catM?.[1] || reg?.category || "utility";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const decision = getMonetizationDecision({ slug, category });
    if (!decision.indexable) {
      addForbidden(
        route,
        `generateToolMetadata renders noindex (slug=${slug}, category=${category}) in ${rel}`,
      );
    }
  }

  if (isDynamic) continue;

  // (b) Literal robots noindex pages.
  if (/robots:\s*\{\s*index:\s*false/.test(src)) {
    addForbidden(routeFromFile(file), `literal robots index:false in ${rel}`);
  }

  // (c) Redirect-only pages: a redirect call and no JSX tag anywhere.
  const hasRedirect =
    src.includes("permanentRedirect(") || /\bredirect\(/.test(src);
  const hasJsx = /<[A-Za-z][\w.]*(\s|\/?>)/.test(src);
  if (hasRedirect && !hasJsx) {
    addForbidden(routeFromFile(file), `redirect-only page in ${rel}`);
  }
}

// --- Listed sets ---
const listed = new Map<string, string[]>(); // path -> sources
const addListed = (urlPath: string, source: string) => {
  const p = urlPath === "" ? "/" : urlPath;
  const sources = listed.get(p) || [];
  if (!sources.includes(source)) sources.push(source);
  listed.set(p, sources);
};

const publicSitemap = path.join(rootDir, "public", "sitemap.xml");
if (!fs.existsSync(publicSitemap)) fail(`public/sitemap.xml not found`);
const xml = fs.readFileSync(publicSitemap, "utf8");
for (const m of xml.matchAll(/<loc>https:\/\/sopkit\.space([^<]*)<\/loc>/g)) {
  addListed(m[1] === "" ? "/" : m[1], "public/sitemap.xml");
}

const routeSitemap = path.join(rootDir, "src", "app", "sitemap.ts");
const routeSrc = fs.readFileSync(routeSitemap, "utf8");
// Entry lines only, with a literal path after SITE_URL: template entries
// such as `${SITE_URL}${tool.route}` are tool/blog/opportunity entries,
// not static entries, and their path characters keep them out here.
for (const m of routeSrc.matchAll(
  /\{\s*url:\s*`\$\{SITE_URL\}([A-Za-z0-9\-_/]*)`/g,
)) {
  addListed(m[1] === "" ? "/" : m[1], "src/app/sitemap.ts static list");
}

const generator = path.join(rootDir, "scripts", "generate-sitemap.ts");
const genSrc = fs.readFileSync(generator, "utf8");
for (const m of genSrc.matchAll(/path:\s*'([^']+)'/g)) {
  addListed(m[1], "scripts/generate-sitemap.ts static list");
}

// --- Verdict ---
const violations: string[] = [];
for (const [route, reason] of forbidden) {
  const sources = listed.get(route);
  if (sources) {
    violations.push(`${route} — ${reason} — listed in: ${sources.join(", ")}`);
  }
}

if (violations.length > 0) {
  console.error(
    `\u274c validate-sitemap-indexable: ${violations.length} non-indexable or redirect URL(s) listed in a sitemap:`,
  );
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(
  `\u2705 validate-sitemap-indexable: ${listed.size} listed URLs checked against ${forbidden.size} non-indexable/redirect routes — no violations.`,
);
