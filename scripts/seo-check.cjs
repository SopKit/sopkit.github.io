#!/usr/bin/env node
/**
 * SopKit SEO offline check script
 */
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();
const APP_DIR = path.join(BASE_DIR, 'src/app');

// 1. Load registry and sitemap configurations
const toolsJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'src/constants/tools.json'), 'utf8'));
const tools = [];
for (const cat of Object.values(toolsJson.categories)) {
	for (const t of cat.tools) {
		tools.push(t);
	}
}

// Read seo opportunities (simplified parser for offline use)
const seoOptsContent = fs.readFileSync(path.join(BASE_DIR, 'src/data/seo-opportunities.ts'), 'utf8');
const seoOptsSlugs = [...seoOptsContent.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);

// 2. Read sitemap file to calculate coverage
const sitemapContent = fs.readFileSync(path.join(BASE_DIR, 'src/app/sitemap.ts'), 'utf8');

// Helper to check if a route is in sitemap
function isRouteInSitemap(route) {
	if (route === '/') return true;
	// Search in staticPages
	if (sitemapContent.includes(`\${BASE_URL}${route}`)) return true;
	// check if toolPage matches
	if (sitemapContent.includes('allTools') && !route.startsWith('/api-key-tester/')) return true;
	return false;
}

// 3. Scan src/app recursively for all routes
const routes = [];
function scanDir(dir, routePrefix = '') {
	const items = fs.readdirSync(dir);
	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			// Skip private folders starting with underscore
			if (item.startsWith('_') && !item.startsWith('_(downloaders)')) continue;
			
			let nextPrefix = routePrefix;
			if (!item.startsWith('(')) {
				nextPrefix = routePrefix + '/' + item;
			}
			scanDir(fullPath, nextPrefix);
		} else if (stat.isFile() && (item === 'page.tsx' || item === 'page.js')) {
			// Skip redirect files
			if (fullPath.includes('tools/[slug]')) continue;
			
			routes.push({
				filePath: fullPath,
				route: routePrefix === '' ? '/' : routePrefix,
			});
		}
	}
}

scanDir(APP_DIR);

// Parse dynamic routes from [slug]
const expandedRoutes = [];
const seenRoutes = new Set();
for (const r of routes) {
	if (r.route.includes('[slug]')) {
		// Expand [slug] using standalone seoOpportunities
		for (const slug of seoOptsSlugs) {
			const routePath = `/${slug}`;
			if (!seenRoutes.has(routePath)) {
				seenRoutes.add(routePath);
				expandedRoutes.push({
					filePath: r.filePath,
					route: routePath,
					isDynamic: true,
				});
			}
		}
	} else {
		if (!seenRoutes.has(r.route)) {
			seenRoutes.add(r.route);
			expandedRoutes.push(r);
		}
	}
}

// 4. Run audits
console.log('🔍 Running Offline SEO Audits...\n');

// Parse dynamic titles/descriptions from seo-opportunities.ts and intent-data.ts
const opportunities = [];
const oppLines = seoOptsContent.split('\n');
let currentOpp = null;
for (const line of oppLines) {
	if (line.includes('slug:')) {
		if (currentOpp) opportunities.push(currentOpp);
		const match = line.match(/slug:\s*(["'])(.*?)\1/);
		if (match) {
			currentOpp = { slug: match[2] };
		}
	} else if (currentOpp) {
		const titleMatch = line.match(/title:\s*(["'])(.*?)\1/);
		if (titleMatch) {
			currentOpp.title = titleMatch[2];
		}
		const descMatch = line.match(/metaDescription:\s*(["'])(.*?)\1/);
		if (descMatch) {
			currentOpp.metaDescription = descMatch[2];
		}
	}
}
if (currentOpp) opportunities.push(currentOpp);

const intents = [];
let intentContent = '';
try {
	intentContent = fs.readFileSync(path.join(BASE_DIR, 'src/lib/intent-data.ts'), 'utf8');
} catch (e) {
	// ignore
}
if (intentContent) {
	const intentLines = intentContent.split('\n');
	let currentIntent = null;
	for (const line of intentLines) {
		const startMatch = line.match(/^\s*(["'])(.*?)\1:\s*\{/);
		if (startMatch) {
			if (currentIntent) intents.push(currentIntent);
			currentIntent = { slug: startMatch[2] };
		} else if (currentIntent) {
			const titleMatch = line.match(/title:\s*(["'])(.*?)\1/);
			if (titleMatch) {
				currentIntent.title = titleMatch[2];
			}
			const descMatch = line.match(/description:\s*(["'])(.*?)\1/);
			if (descMatch) {
				currentIntent.description = descMatch[2];
			}
		}
	}
	if (currentIntent) intents.push(currentIntent);
}

const titles = new Map();
const descriptions = new Map();
let totalToolsCount = expandedRoutes.length;
let validSeoPages = 0;
let missingFieldsCount = 0;
let duplicateTitlesCount = 0;
let duplicateDescCount = 0;
let thinPagesCount = 0;
let brokenLinksCount = 0;
let riskyAdSenseCount = 0;
let sitemapCoverageCount = 0;

const errors = [];
const warnings = [];

for (const r of expandedRoutes) {
	const content = fs.readFileSync(r.filePath, 'utf8');
	
	// Parse title, description, canonical
	const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/i);
	const descMatch = content.match(/description:\s*["'`]([^"'`]+)["'`]/i);
	const canonicalMatch = content.match(/canonical:\s*["']([^"']+)["']/i);
	const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i) || content.match(/name:\s*["']([^"']+)["']/i);

	// Check if this is a company page or utility
	const isCompany = r.route.includes('/about') || r.route.includes('/privacy') || r.route.includes('/terms') || r.route.includes('/contact');
	const isDownloader = (r.route.includes('downloader') || r.route.includes('saver')) && !r.route.includes('sitemap-url-downloader');

	let title = '';
	let description = '';

	if (r.isDynamic) {
		const slugVal = r.route.substring(1);
		const opp = opportunities.find(o => o.slug === slugVal);
		const intent = intents.find(i => i.slug === slugVal);
		if (opp) {
			title = opp.title || '';
			description = opp.metaDescription || '';
		} else if (intent) {
			title = intent.title || '';
			description = intent.description || '';
		}
	} else {
		title = titleMatch ? titleMatch[1] : '';
		description = descMatch ? descMatch[1] : '';
	}

	const canonical = canonicalMatch ? canonicalMatch[1] : '';
	const hasH1 = !!h1Match || r.isDynamic; // Dynamic intent page generates H1 automatically

	// Checks
	let hasError = false;

	// Title checks
	if (!title) {
		errors.push(`[Error] Missing title: ${r.route}`);
		hasError = true;
	} else {
		if (titles.has(title)) {
			duplicateTitlesCount++;
			warnings.push(`[Warning] Duplicate title: "${title}" on ${r.route} and ${titles.get(title)}`);
		} else {
			titles.set(title, r.route);
		}
	}

	// Description checks
	if (!description) {
		errors.push(`[Error] Missing description: ${r.route}`);
		hasError = true;
	} else {
		if (description.length < 50) {
			warnings.push(`[Warning] Meta description too short (${description.length} chars) on ${r.route}`);
		}
		if (descriptions.has(description)) {
			duplicateDescCount++;
			warnings.push(`[Warning] Duplicate description on ${r.route} and ${descriptions.get(description)}`);
		} else {
			descriptions.set(description, r.route);
		}
	}

	// H1 checks
	if (!hasH1) {
		warnings.push(`[Warning] H1 heading not detected in code: ${r.route}`);
	}

	// Sitemap checks
	if (!isRouteInSitemap(r.route) && !isCompany) {
		sitemapCoverageCount++;
		warnings.push(`[Warning] Route not in sitemap: ${r.route}`);
	}

	// AdSense safety check on downloaders
	if (isDownloader) {
		const isNoAds = content.includes('adSafety: "no-ads"') || content.includes('adsAllowed: false') || r.filePath.includes('_(downloaders)');
		const isNoindex = content.includes('index: false') || r.filePath.includes('_(downloaders)');
		if (!isNoAds && !isNoindex) {
			riskyAdSenseCount++;
			errors.push(`[Error] Risky downloader page indexable and has ads allowed: ${r.route}`);
			hasError = true;
		}
	}

	// Check for thin content (articles)
	const toolData = tools.find(t => t.route === r.route);
	if (toolData && toolData.article && toolData.article.split(/\s+/).length < 120) {
		thinPagesCount++;
		warnings.push(`[Warning] Thin article copy (< 120 words) on ${r.route}`);
	}

	if (!hasError) {
		validSeoPages++;
	} else {
		missingFieldsCount++;
	}
}

// 5. Print Results
console.log('==================================================');
console.log('📊 SEO AUDIT SUMMARY');
console.log('--------------------------------------------------');
console.log(`Total Pages Scanned:   ${totalToolsCount}`);
console.log(`Valid SEO Pages:       ${validSeoPages}`);
console.log(`Pages with Errors:     ${missingFieldsCount}`);
console.log(`Duplicate Titles:      ${duplicateTitlesCount}`);
console.log(`Duplicate Descriptions: ${duplicateDescCount}`);
console.log(`Thin Article Pages:    ${thinPagesCount}`);
console.log(`Risky AdSense Pages:   ${riskyAdSenseCount}`);
console.log(`Pages Not in Sitemap:  ${sitemapCoverageCount}`);
console.log('==================================================\n');

if (errors.length > 0) {
	console.log('❌ ERRORS DETECTED:');
	errors.forEach(e => console.log(e));
	console.log('');
}

if (warnings.length > 0) {
	console.log('⚠️ WARNINGS DETECTED:');
	warnings.forEach(w => console.log(w));
	console.log('');
}

if (errors.length > 0) {
	process.exit(1);
} else {
	console.log('🎉 All critical offline SEO checks passed successfully!');
	process.exit(0);
}
