import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://sopkit.github.io";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "634a2c77198a45429967eb9dc1252278";
const BING_API_KEY = process.env.BING_API_KEY || "";

const BATCH_SIZE = 10000;

const STATIC_PAGES = [
	"",
	"search",
	"about",
	"contact",
	"help",
	"privacy",
	"terms",
	"blog",
	"api-docs",
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
		const absolute = path.join(__dirname, "..", filePath);
		return JSON.parse(readFileSync(absolute, "utf8"));
	} catch (err) {
		console.warn(`⚠️  Failed to read ${filePath}: ${err.message}`);
		return null;
	}
}

function extractArrayFromTs(filePath, variableName) {
	try {
		const absolute = path.join(__dirname, "..", filePath);
		const content = readFileSync(absolute, "utf8");
		const regex = new RegExp(`export\\s+(?:const|let|var)\\s+${variableName}\\s*[:=]\\s*(\\[.*?\\]|\\{.*?\\})`, "s");
		const match = content.match(regex);
		if (!match) return [];
		return JSON.parse(match[1]);
	} catch (err) {
		console.warn(`⚠️  Failed to parse ${variableName} from ${filePath}: ${err.message}`);
		return [];
	}
}

function extractObjectKeysFromTs(filePath, variableName) {
	try {
		const absolute = path.join(__dirname, "..", filePath);
		const content = readFileSync(absolute, "utf8");
		const regex = new RegExp(`export\\s+(?:const|let|var)\\s+${variableName}\\s*[:=]\\s*(\\{.*?\\});`, "s");
		const match = content.match(regex);
		if (!match) return [];
		const obj = JSON.parse(match[1]);
		return Object.keys(obj);
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
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	return { status: res.status, ok: res.ok };
}

async function submitIndexNow(urlList) {
	const payload = {
		host: new URL(SITE_URL).host,
		key: INDEXNOW_KEY,
		keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
		urlList,
	};

	const endpoints = [
		{ name: "bing", url: "https://api.indexnow.org/indexnow" },
		{ name: "yandex", url: "https://yandex.com/indexnow" },
		{ name: "naver", url: "https://searchadvisor.naver.com/indexnow" },
	];

	const results = {};
	for (const ep of endpoints) {
		try {
			const { status, ok } = await postJson(ep.url, payload);
			results[ep.name] = { status, ok };
			console.log(`  ${ep.name}: ${status} ${ok ? "✅" : "❌"}`);
		} catch (err) {
			results[ep.name] = { error: err.message };
			console.log(`  ${ep.name}: ❌ ${err.message}`);
		}
	}
	return results;
}

async function submitBingApi(urlList) {
	if (!BING_API_KEY) {
		console.log("  Bing API: skipped (no BING_API_KEY)");
		return { skipped: true };
	}

	try {
		const res = await fetch(
			`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apiKey=${encodeURIComponent(BING_API_KEY)}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					siteUrl: SITE_URL,
					urlList,
				}),
			}
		);
		const text = await res.text();
		console.log(`  Bing API: ${res.status} ${res.ok ? "✅" : "❌"} ${text.slice(0, 120)}`);
		return { status: res.status, ok: res.ok, body: text };
	} catch (err) {
		console.log(`  Bing API: ❌ ${err.message}`);
		return { error: err.message };
	}
}

async function main() {
	console.log("🚀 Starting URL submission...\n");

	const toolsJson = readJson("src/constants/tools.json");
	const toolUrls = [];
	if (toolsJson && toolsJson.categories) {
		for (const category of Object.values(toolsJson.categories)) {
			for (const tool of category.tools || []) {
				if (tool.route && !tool.route.startsWith("/search")) {
					toolUrls.push(normalizeUrl(tool.route));
				}
			}
		}
	}
	console.log(`🔧 Tools: ${toolUrls.length}`);

	const blogs = extractArrayFromTs("src/constants/blog-data.ts", "blogs");
	const blogUrls = blogs.map((b) => normalizeUrl(`/blog/${b.slug}`));
	console.log(`📝 Blogs: ${blogUrls.length}`);

	const seoOpportunities = extractArrayFromTs("src/data/seo-opportunities.ts", "seoOpportunities");
	const seoUrls = seoOpportunities.map((o) => normalizeUrl(o.route));
	console.log(`📈 SEO Opportunities: ${seoUrls.length}`);

	const intentKeys = extractObjectKeysFromTs("src/lib/intent-data.ts", "intentData");
	const intentUrls = intentKeys.map((k) => normalizeUrl(`/${k}`));
	console.log(`🎯 Intents: ${intentUrls.length}`);

	const staticUrls = STATIC_PAGES.map((s) => normalizeUrl(s));
	console.log(`🏠 Static pages: ${staticUrls.length}`);

	const allUrls = dedupe([...staticUrls, ...toolUrls, ...blogUrls, ...seoUrls, ...intentUrls]);
	console.log(`\n📦 Total unique URLs: ${allUrls.length}`);

	const batches = [];
	for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
		batches.push(allUrls.slice(i, i + BATCH_SIZE));
	}
	console.log(`📦 Batches: ${batches.length} (${BATCH_SIZE} URLs each)\n`);

	let indexNowSuccess = 0;
	let bingSuccess = 0;

	for (let i = 0; i < batches.length; i++) {
		const batch = batches[i];
		console.log(`--- Batch ${i + 1}/${batches.length} (${batch.length} URLs) ---`);

		const indexNowResults = await submitIndexNow(batch);
		const allOk = Object.values(indexNowResults).every((r) => r && r.ok);
		if (allOk) indexNowSuccess++;

		const bingResults = await submitBingApi(batch);
		if (bingResults && bingResults.ok) bingSuccess++;

		if (i < batches.length - 1) {
			await new Promise((r) => setTimeout(r, 1000));
		}
	}

	console.log("\n🎉 Submission complete!");
	console.log(`  IndexNow: ${indexNowSuccess}/${batches.length} batches succeeded`);
	console.log(`  Bing API: ${bingSuccess}/${batches.length} batches succeeded`);
}

main().catch((err) => {
	console.error("💥 Fatal error:", err);
	process.exit(1);
});
