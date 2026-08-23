import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://sopkit.github.io";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "634a2c77198a45429967eb9dc1252278";

const BATCH_SIZE = 10000;

const STATIC_PAGES = [
	"",
	"search",
	"about",
	"contact",
	"privacy",
	"terms",
	"dmca",
	"blog",
	"advertise",
	"services",
	"tools",
	"packages",
	"startup-directories",
	"image-tools",
	"exam-image-tools",
	"pdf-tools",
	"video-tools",
	"audio-tools",
	"text-tools",
	"seo-tools",
	"developer-tools",
	"api-key-tester",
	"ai-tools",
	"qr-tools",
	"small-business-tools",
	"other-tools",
	"generators",
	"calculators",
	"student-calculators",
	"student-tools",
	"exam-tools",
	"business-tools",
	"social-media-tools",
	"finance-tools",
	"calculator-tools",
	"converter-tools",
	"ai-writing-tools",
	"local-business-tools",
	"tool-guides",
	"ai-tools-alternatives-free",
	"best-free-alternative-to-chatgpt",
	"best-free-converters-in-2026",
	"best-free-tools-for-students",
	"how-to-format-json-properly",
	"seo-tools-free-online",
	"tools-for-developers",
	"top-10-free-online-tools-for-seo",
	"top-10-json-tools-online",
	"new-tools",
];

function readJson(filePath) {
	try {
		const absolute = path.join(__dirname, filePath);
		return JSON.parse(readFileSync(absolute, "utf8"));
	} catch (err) {
		console.warn(`⚠️  Failed to read ${filePath}: ${err.message}`);
		return null;
	}
}

function extractArrayFromTs(filePath, variableName) {
	try {
		const absolute = path.join(__dirname, filePath);
		const content = readFileSync(absolute, "utf8");
		const regex = new RegExp(`export\\s+(?:const|let|var)\\s+${variableName}\\s*[:=]\\s*(\\[[\\s\\S]*?\\]);`, "m");
		const match = content.match(regex);
		if (!match) {
			// Fallback: extract slugs using regex
			const slugs = [];
			const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
			for (const m of slugMatches) {
				slugs.push({ slug: m[1] });
			}
			const routeMatches = content.matchAll(/route:\s*["']([^"']+)["']/g);
			for (const m of routeMatches) {
				slugs.push({ route: m[1] });
			}
			return slugs;
		}
		return JSON.parse(match[1]);
	} catch (err) {
		console.warn(`⚠️  Extracting slugs from ${filePath} via regex fallback...`);
		try {
			const absolute = path.join(__dirname, filePath);
			const content = readFileSync(absolute, "utf8");
			const items = [];
			const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
			for (const m of slugMatches) {
				items.push({ slug: m[1] });
			}
			const routeMatches = content.matchAll(/route:\s*["']([^"']+)["']/g);
			for (const m of routeMatches) {
				items.push({ route: m[1] });
			}
			return items;
		} catch (e) {
			return [];
		}
	}
}

function extractObjectKeysFromTs(filePath, variableName) {
	try {
		const absolute = path.join(__dirname, filePath);
		const content = readFileSync(absolute, "utf8");
		const keys = [];
		const keyMatches = content.matchAll(/["']([a-zA-Z0-9_-]+)["']\s*:\s*\{/g);
		for (const m of keyMatches) {
			keys.push(m[1]);
		}
		return keys;
	} catch (err) {
		console.warn(`⚠️  Failed to parse ${variableName} keys from ${filePath}: ${err.message}`);
		return [];
	}
}

function normalizeUrl(slug) {
	if (!slug) return `${SITE_URL}/`;
	const clean = slug.startsWith("/") ? slug : `/${slug}`;
	return `${SITE_URL}${clean.endsWith("/") ? clean : clean + "/"}`;
}

function dedupe(urls) {
	const seen = new Set();
	return urls.filter((u) => {
		if (seen.has(u)) return false;
		seen.add(u);
		return true;
	});
}

async function postJson(url, payload) {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify(payload),
	});
	const body = await res.text();
	return { status: res.status, ok: res.ok || res.status === 200 || res.status === 202, body };
}

async function submitIndexNow(urlList) {
	const payload = {
		host: new URL(SITE_URL).host,
		key: INDEXNOW_KEY,
		keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
		urlList,
	};

	const endpoints = [
		{ name: "IndexNow (Central Hub)", url: "https://api.indexnow.org/indexnow" },
		{ name: "Bing (IndexNow)", url: "https://www.bing.com/indexnow" },
		{ name: "Yandex (IndexNow)", url: "https://yandex.com/indexnow" },
		{ name: "Naver (IndexNow)", url: "https://searchadvisor.naver.com/indexnow" },
		{ name: "Seznam.cz (IndexNow)", url: "https://search.seznam.cz/indexnow" },
	];

	const results = {};
	for (const ep of endpoints) {
		try {
			const { status, ok } = await postJson(ep.url, payload);
			results[ep.name] = { status, ok };
			console.log(`  ${ep.name}: ${status} ${ok ? "✅ Submitted successfully" : "⚠️ " + status}`);
		} catch (err) {
			results[ep.name] = { error: err.message };
			console.log(`  ${ep.name}: ❌ ${err.message}`);
		}
	}
	return results;
}

async function main() {
	console.log("🚀 Starting Global Search Engine Submission (IndexNow)...\\n");

	const toolsJson = readJson("src/constants/tools.json");
	const toolUrls = [];
	if (toolsJson && toolsJson.categories) {
		for (const category of Object.values(toolsJson.categories)) {
			for (const tool of category.tools || []) {
				if (tool.route && !tool.route.startsWith("/search")) {
					toolUrls.push(normalizeUrl(tool.route));
				}
				if (tool.extraSlugs && Array.isArray(tool.extraSlugs)) {
					for (const slug of tool.extraSlugs) {
						if (slug) toolUrls.push(normalizeUrl(`/${slug}`));
					}
				}
			}
		}
	}
	console.log(`🔧 Tool URLs: ${toolUrls.length}`);

	const blogs = extractArrayFromTs("src/constants/blog-data.ts", "blogs");
	const blogUrls = blogs.filter(b => b.slug).map((b) => normalizeUrl(`/blog/${b.slug}`));
	console.log(`📝 Blog URLs: ${blogUrls.length}`);

	const seoOpportunities = extractArrayFromTs("src/data/seo-opportunities.ts", "seoOpportunities");
	const seoUrls = seoOpportunities.filter(o => o.route).map((o) => normalizeUrl(o.route));
	console.log(`📈 SEO Opportunity URLs: ${seoUrls.length}`);

	const intentKeys = extractObjectKeysFromTs("src/lib/intent-data.ts", "intentData");
	const intentUrls = intentKeys.map((k) => normalizeUrl(`/${k}`));
	console.log(`🎯 Intent Landing URLs: ${intentUrls.length}`);

	const staticUrls = STATIC_PAGES.map((s) => normalizeUrl(s));
	console.log(`🏠 Static Hub URLs: ${staticUrls.length}`);

	const allUrls = dedupe([...staticUrls, ...toolUrls, ...blogUrls, ...seoUrls, ...intentUrls]);
	console.log(`\\n📦 Total Unique URLs to Index: ${allUrls.length}`);

	const batches = [];
	for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
		batches.push(allUrls.slice(i, i + BATCH_SIZE));
	}
	console.log(`📦 Batches: ${batches.length} (${BATCH_SIZE} URLs each)\\n`);

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		console.log(`--- Submitting Batch ${i + 1}/${batches.length} (${batch.length} URLs) ---`);
		await submitIndexNow(batch);
		if (i < batches.length - 1) {
			await new Promise((r) => setTimeout(r, 1000));
		}
	}

	console.log("\\n🎉 IndexNow Broadcast Finished!");
}

main().catch((err) => {
	console.error("💥 Fatal error:", err);
	process.exit(1);
});
