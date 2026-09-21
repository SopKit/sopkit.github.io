import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const toolsJsonPath = path.join(rootDir, 'src', 'constants', 'tools.json');
const blogDataPath = path.join(rootDir, 'src', 'constants', 'blog-data.ts');

const publicDir = path.join(rootDir, 'public');


const BASE_URL = 'https://sopkit.space';

const LAST_MODIFIED = new Date().toISOString().split('T')[0];

console.log('🚀 Generating unified static sitemap.xml and robots.txt...');

// 1. Read tools
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
const allTools: Array<{ id: string; name: string; route: string; popular?: boolean }> = [];

for (const category of Object.values(toolsData.categories || {}) as any[]) {
  if (category && Array.isArray(category.tools)) {
    allTools.push(...category.tools);
  }
}

// 2. Read blogs (parse slugs from blog-data.ts)
const blogFileContent = fs.readFileSync(blogDataPath, 'utf8');
const blogSlugMatches = blogFileContent.match(/slug:\s*["']([^"']+)["']/g) || [];
const blogSlugs = blogSlugMatches.map((m) => m.replace(/slug:\s*["']/, '').replace(/["']/, ''));

// 3. Static Hub & Landing Pages
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.95', changefreq: 'daily' },
  { path: '/dev-speed', priority: '0.90', changefreq: 'daily' },
  { path: '/architecture-canvas', priority: '0.90', changefreq: 'daily' },
  { path: '/image-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/pdf-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/developer-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/video-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/audio-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/text-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/seo-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/calculators', priority: '0.80', changefreq: 'weekly' },
  { path: '/calculator-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/converter-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/exam-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/exam-image-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/student-calculators', priority: '0.85', changefreq: 'weekly' },
  { path: '/student-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/small-business-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/local-business-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/business-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/finance-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/social-media-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/qr-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/ai-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/ai-writing-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/api-key-tester', priority: '0.90', changefreq: 'weekly' },
  { path: '/api-key-testers', priority: '0.85', changefreq: 'weekly' },
  { path: '/generators', priority: '0.80', changefreq: 'weekly' },
  { path: '/other-tools', priority: '0.75', changefreq: 'weekly' },
  { path: '/extraction-tools', priority: '0.90', changefreq: 'weekly' },
  { path: '/packages', priority: '0.90', changefreq: 'daily' },
  { path: '/startup-directories', priority: '0.85', changefreq: 'daily' },
  { path: '/new-tools', priority: '0.80', changefreq: 'daily' },
  { path: '/pro', priority: '0.85', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.70', changefreq: 'monthly' },
  { path: '/resources', priority: '0.70', changefreq: 'monthly' },
  { path: '/trust-center', priority: '0.70', changefreq: 'monthly' },
  { path: '/hire', priority: '0.70', changefreq: 'monthly' },
  { path: '/blog', priority: '0.80', changefreq: 'daily' },
  { path: '/tool-guides', priority: '0.70', changefreq: 'weekly' },
  { path: '/about', priority: '0.70', changefreq: 'monthly' },
  { path: '/editorial-policy', priority: '0.65', changefreq: 'monthly' },
  { path: '/contact', priority: '0.70', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.70', changefreq: 'monthly' },
  { path: '/terms', priority: '0.70', changefreq: 'monthly' },
  { path: '/dmca', priority: '0.60', changefreq: 'monthly' },
  { path: '/services', priority: '0.75', changefreq: 'monthly' },
  { path: '/advertise', priority: '0.70', changefreq: 'monthly' },
  { path: '/embed-tools', priority: '0.70', changefreq: 'monthly' },
  { path: '/online-tools', priority: '0.80', changefreq: 'weekly' },
  { path: '/best-free-alternative-to-chatgpt', priority: '0.65', changefreq: 'monthly' },
  { path: '/best-free-converters-in-2026', priority: '0.65', changefreq: 'monthly' },
  { path: '/best-free-tools-for-students', priority: '0.65', changefreq: 'monthly' },
  { path: '/how-to-format-json-properly', priority: '0.65', changefreq: 'monthly' },
  { path: '/seo-tools-free-online', priority: '0.65', changefreq: 'monthly' },
  { path: '/tools-for-developers', priority: '0.65', changefreq: 'monthly' },
  { path: '/top-10-free-online-tools-for-seo', priority: '0.65', changefreq: 'monthly' },
  { path: '/top-10-json-tools-online', priority: '0.65', changefreq: 'monthly' },
  { path: '/ai-tools-alternatives-free', priority: '0.65', changefreq: 'monthly' },
  { path: '/best-free-ilovepdf-alternatives', priority: '0.65', changefreq: 'monthly' },
  { path: '/best-free-adobe-acrobat-alternatives', priority: '0.65', changefreq: 'monthly' },
  { path: '/best-free-canva-alternatives', priority: '0.65', changefreq: 'monthly' },
];

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const entriesMap = new Map<string, SitemapEntry>();

function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url.startsWith('http')) {
    url = `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  if (!url.endsWith('/')) {
    url += '/';
  }
  return url;
}

function registerUrl(rawUrl: string, priority = '0.80', changefreq = 'weekly', lastmod = LAST_MODIFIED) {
  const url = normalizeUrl(rawUrl);
  if (!entriesMap.has(url)) {
    entriesMap.set(url, { url, lastmod, changefreq, priority });
  }
}

// 1. Add static pages
for (const p of staticPages) {
  registerUrl(p.path, p.priority, p.changefreq);
}

// 2. Add tools
for (const tool of allTools) {
  if (!tool.route || !tool.route.startsWith('/')) continue;
  const slug = tool.id || tool.route.replace(/^\//, '');
  const category = (tool as any).category || '';
  if (/downloader|media-saver|clip-saver|thumbnail-downloader|story-downloader|reel-downloader|api-key-tester|password|credential|token|secret-key|private-key|jwt|fake-chat-generator/i.test(slug)) continue;
  if (/youtube/i.test(category)) continue;
  if (tool.route.includes('?')) continue;
  if (tool.route.startsWith('/search')) continue;
  const priority = tool.popular ? '0.90' : '0.80';
  registerUrl(tool.route, priority, 'weekly');
}

// 3. Add blog archive pages and posts
const blogArchivePages = Math.max(1, Math.ceil(blogSlugs.length / 12));
for (let page = 2; page <= blogArchivePages; page++) {
  registerUrl(`/blog/page/${page}`, '0.75', 'daily');
}
for (const slug of blogSlugs) {
  registerUrl(`/blog/${slug}`, '0.70', 'monthly');
}

// 4. Add SEO opportunity pages
try {
  const { seoOpportunities } = await import('../src/data/seo-opportunities');
  if (Array.isArray(seoOpportunities)) {
    for (const opp of seoOpportunities) {
      if (opp.route) {
        const priority = opp.priority === 1 ? '0.90' : opp.priority === 2 ? '0.86' : '0.84';
        registerUrl(opp.route, priority, 'weekly');
      }
    }
  }
} catch (err) {
  console.warn('Notice: Could not load seoOpportunities directly, falling back:', (err as Error).message);
}

// 5. Add Intent landing pages
try {
  const { intentData } = await import('../src/lib/intent-data');
  if (intentData && typeof intentData === 'object') {
    for (const slug of Object.keys(intentData)) {
      if (/downloader|media-saver|clip-saver|thumbnail-downloader|story-downloader|reel-downloader|api-key-tester|password|credential|token|secret-key|private-key|jwt|fake-chat-generator/i.test(slug)) continue;
      registerUrl(`/${slug}`, '0.85', 'weekly');
    }
  }
} catch (err) {
  console.warn('Notice: Could not load intentData directly, falling back:', (err as Error).message);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

const urlNodes: string[] = [];
for (const entry of entriesMap.values()) {
  urlNodes.push(`  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`✅ Generated unified public/sitemap.xml with ${entriesMap.size} URLs.`);

// Generate public/robots.txt
const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /handler/
Disallow: /embed/
Disallow: /youtube-redirects/
Disallow: /search
Disallow: /search/

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /handler/
Disallow: /embed/
Disallow: /search

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /handler/
Disallow: /embed/
Disallow: /search

# AI Search & LLM Crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Gemini
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
Host: ${BASE_URL}
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
console.log('✅ Generated public/robots.txt.');
