import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const toolsJsonPath = path.join(rootDir, 'src', 'constants', 'tools.json');
const blogDataPath = path.join(rootDir, 'src', 'constants', 'blog-data.ts');
const publicDir = path.join(rootDir, 'public');

const BASE_URL = 'https://sopkit.github.io';
const LAST_MODIFIED = new Date().toISOString().split('T')[0];

console.log('🚀 Generating static sitemap.xml and robots.txt...');

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

// 3. Static Pages & Hub Routes
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.95', changefreq: 'daily' },
  { path: '/image-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/pdf-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/developer-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/video-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/audio-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/text-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/seo-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/calculators', priority: '0.8', changefreq: 'weekly' },
  { path: '/calculator-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/converter-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/exam-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/exam-image-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/student-calculators', priority: '0.85', changefreq: 'weekly' },
  { path: '/student-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/small-business-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/business-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/finance-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/social-media-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/qr-tools', priority: '0.85', changefreq: 'weekly' },
  { path: '/ai-tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/ai-writing-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/api-key-tester', priority: '0.9', changefreq: 'weekly' },
  { path: '/generators', priority: '0.8', changefreq: 'weekly' },
  { path: '/other-tools', priority: '0.75', changefreq: 'weekly' },
  { path: '/packages', priority: '0.9', changefreq: 'daily' },
  { path: '/startup-directories', priority: '0.85', changefreq: 'daily' },
  { path: '/new-tools', priority: '0.8', changefreq: 'daily' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/tool-guides', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.7', changefreq: 'monthly' },
  { path: '/terms', priority: '0.7', changefreq: 'monthly' },
  { path: '/dmca', priority: '0.6', changefreq: 'monthly' },
  { path: '/services', priority: '0.75', changefreq: 'monthly' },
  { path: '/advertise', priority: '0.7', changefreq: 'monthly' },
  { path: '/embed-tools', priority: '0.7', changefreq: 'monthly' },
  { path: '/online-tools', priority: '0.8', changefreq: 'weekly' },
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

const urls: string[] = [];

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

function addUrl(loc: string, lastmod: string, changefreq: string, priority: string) {
  urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
}

// Add static pages
for (const p of staticPages) {
  const url = p.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${p.path}/`;
  addUrl(url, LAST_MODIFIED, p.changefreq, p.priority);
}

// Add tools
for (const tool of allTools) {
  if (!tool.route || !tool.route.startsWith('/')) continue;
  const cleanRoute = tool.route.endsWith('/') ? tool.route : `${tool.route}/`;
  const url = `${BASE_URL}${cleanRoute}`;
  const priority = tool.popular ? '0.90' : '0.80';
  addUrl(url, LAST_MODIFIED, 'weekly', priority);
}

// Add blog posts
for (const slug of blogSlugs) {
  const url = `${BASE_URL}/blog/${slug}/`;
  addUrl(url, LAST_MODIFIED, 'monthly', '0.70');
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

// Write public/sitemap.xml
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`✅ Generated public/sitemap.xml with ${urls.length} URLs.`);

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
