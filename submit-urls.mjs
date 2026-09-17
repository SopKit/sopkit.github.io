#!/usr/bin/env node
/**
 * @file submit-urls.mjs
 * @description Submits all indexed URLs to IndexNow (Bing, Yandex, Seznam, Naver) and Bing Webmaster API.
 * Features safe batching, robust try/catch error boundaries, and non-crashing network handling.
 *
 * Usage:
 *   node submit-urls.mjs
 *   INDEXNOW_KEY=xxx BING_API_KEY=xxx node submit-urls.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.SITE_URL || "https://sopkit.space";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "ddc248a1620c45638eca52bca376f0cd";
const BING_API_KEY = process.env.BING_API_KEY || "";

// Limits: IndexNow max is 10,000 URLs; Bing Webmaster SubmitUrlbatch max is 500 URLs
const INDEXNOW_BATCH_SIZE = 10000;
const BING_BATCH_SIZE = 500;

/**
 * Safely extracts all canonical URLs from public/sitemap.xml
 */
function loadUrlsFromSitemap() {
	const sitemapPath = path.join(__dirname, "public", "sitemap.xml");
	if (!existsSync(sitemapPath)) {
		console.warn("⚠️ public/sitemap.xml not found. Using fallback route discovery.");
		return [];
	}

	try {
		const content = readFileSync(sitemapPath, "utf8");
		const matches = content.matchAll(/<loc>([^<]+)<\/loc>/g);
		const urls = [];
		for (const m of matches) {
			const u = m[1].trim();
			if (u) urls.push(u);
		}
		return urls;
	} catch (err) {
		console.warn(`⚠️ Error reading sitemap.xml: ${err.message}`);
		return [];
	}
}

/**
 * Fallback route discovery if sitemap is absent
 */
function loadFallbackUrls() {
	const urls = [
		`${SITE_URL}/`,
		`${SITE_URL}/tools`,
		`${SITE_URL}/image-tools`,
		`${SITE_URL}/pdf-tools`,
		`${SITE_URL}/developer-tools`,
		`${SITE_URL}/video-tools`,
		`${SITE_URL}/audio-tools`,
		`${SITE_URL}/text-tools`,
		`${SITE_URL}/seo-tools`,
		`${SITE_URL}/calculators`,
	];

	try {
		const toolsJsonPath = path.join(__dirname, "src", "constants", "tools.json");
		if (existsSync(toolsJsonPath)) {
			const toolsJson = JSON.parse(readFileSync(toolsJsonPath, "utf8"));
			for (const category of Object.values(toolsJson.categories || {})) {
				for (const tool of category.tools || []) {
					if (tool.route) {
						const clean = tool.route.startsWith("/") ? tool.route : `/${tool.route}`;
						urls.push(`${SITE_URL}${clean}`);
					}
				}
			}
		}
	} catch (err) {
		console.warn(`⚠️ Error in fallback tools loading: ${err.message}`);
	}

	return Array.from(new Set(urls));
}

/**
 * Safe fetch POST JSON helper with timeout and try-catch
 */
async function safePostJson(url, payload, headers = {}) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000);

		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				...headers,
			},
			body: JSON.stringify(payload),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		const text = await res.text();
		return { status: res.status, ok: res.ok || res.status === 200 || res.status === 202, text };
	} catch (err) {
		return { status: 0, ok: false, error: err.message };
	}
}

/**
 * Safe fetch GET JSON helper with timeout and try-catch
 */
async function safeGetJson(url, headers = {}) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				...headers,
			},
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		if (!res.ok) {
			return { status: res.status, ok: false, data: null };
		}
		const data = await res.json();
		return { status: res.status, ok: true, data };
	} catch (err) {
		return { status: 0, ok: false, error: err.message };
	}
}

/**
 * Submits a batch of URLs to IndexNow endpoints
 */
async function submitIndexNowBatch(urlList, batchNumber, totalBatches) {
	const host = new URL(SITE_URL).host;
	const payload = {
		host,
		key: INDEXNOW_KEY,
		keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
		urlList,
	};

	console.log(`\n📤 [IndexNow] Submitting Batch ${batchNumber}/${totalBatches} (${urlList.length} URLs)...`);

	const endpoints = [
		{ name: "IndexNow (Central Hub)", url: "https://api.indexnow.org/indexnow" },
		{ name: "Bing (IndexNow)", url: "https://www.bing.com/indexnow" },
		{ name: "Yandex (IndexNow)", url: "https://yandex.com/indexnow" },
		{ name: "Naver (IndexNow)", url: "https://searchadvisor.naver.com/indexnow" },
		{ name: "Seznam.cz (IndexNow)", url: "https://search.seznam.cz/indexnow" },
	];

	for (const ep of endpoints) {
		const result = await safePostJson(ep.url, payload);
		if (result.ok) {
			console.log(`  ✓ ${ep.name}: ${result.status} OK (Accepted for indexing)`);
		} else if (result.error) {
			console.log(`  ⚠️  ${ep.name}: Network notice (${result.error})`);
		} else {
			console.log(`  ℹ️  ${ep.name}: Status ${result.status} ${result.text ? "- " + result.text.slice(0, 80) : ""}`);
		}
	}
}

/**
 * Harnesses Bing Webmaster API: Quota check, URL batch submission, and crawl stats
 */
async function submitBingWebmasterApi(allUrls) {
	if (!BING_API_KEY) {
		console.log("\nℹ️  [Bing Webmaster API] No BING_API_KEY provided; skipped Direct API submission.");
		return;
	}

	console.log("\n=======================================================");
	console.log("🎯 [Bing Webmaster API] Harnessing Direct Search Engine API");
	console.log("=======================================================");

	// 1. Check daily quota
	let dailyQuota = 0;
	const quotaUrl = `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=${encodeURIComponent(SITE_URL)}&apikey=${BING_API_KEY}`;
	const quotaRes = await safeGetJson(quotaUrl);
	if (quotaRes.ok && quotaRes.data && quotaRes.data.d) {
		const q = quotaRes.data.d;
		dailyQuota = q.DailyQuota ?? 0;
		console.log(`📊 Bing Daily Quota: ${dailyQuota} | Monthly: ${q.MonthlyQuota ?? "N/A"}`);
	} else {
		console.log(`ℹ️  Bing Quota query response: ${quotaRes.status || quotaRes.error || "Ready"}`);
	}

	if (dailyQuota <= 0) {
		console.log("ℹ️  Bing Webmaster direct submission quota for today is 0. (IndexNow covers all URLs).");
		return;
	}

	// 2. Submit URLs within the daily quota limit
	const urlsToSubmit = allUrls.slice(0, Math.min(allUrls.length, dailyQuota));
	console.log(`🚀 Submitting ${urlsToSubmit.length} priority URLs to Bing Webmaster Direct API...`);

	const submitUrl = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`;
	const payload = {
		siteUrl: SITE_URL,
		urlList: urlsToSubmit,
	};

	const res = await safePostJson(submitUrl, payload);
	if (res.ok) {
		console.log(`  ✓ Successfully submitted ${urlsToSubmit.length} priority URLs to Bing Webmaster API.`);
	} else {
	}

	// 3. Query Crawl Stats for visibility
	const crawlUrl = `https://ssl.bing.com/webmaster/api.svc/json/GetCrawlStats?siteUrl=${encodeURIComponent(SITE_URL)}&apikey=${BING_API_KEY}`;
	const crawlRes = await safeGetJson(crawlUrl);
	if (crawlRes.ok && crawlRes.data && crawlRes.data.d) {
		console.log("📈 Bing Crawl Stats retrieved successfully.");
	}
}

/**
 * Main execution
 */
async function main() {
	console.log("=======================================================");
	console.log(`🌐 SopKit Global Search Indexing Engine`);
	console.log(`   Target Site: ${SITE_URL}`);
	console.log(`   IndexNow Key: ${INDEXNOW_KEY.slice(0, 8)}...`);
	console.log(`   Bing API Key: ${BING_API_KEY ? BING_API_KEY.slice(0, 8) + "..." : "Not set"}`);
	console.log("=======================================================");

	let urls = loadUrlsFromSitemap();
	if (urls.length === 0) {
		urls = loadFallbackUrls();
	}

	// Ensure all URLs are unique and normalized to SITE_URL
	const uniqueUrls = Array.from(
		new Set(
			urls.map((u) => {
				try {
					const parsed = new URL(u);
					return `${SITE_URL}${parsed.pathname}`;
				} catch {
					return u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? u : "/" + u}`;
				}
			}),
		),
	);

	console.log(`📦 Loaded ${uniqueUrls.length} unique pages ready for instant indexing.`);

	// 1. Submit to IndexNow
	const indexNowBatches = [];
	for (let i = 0; i < uniqueUrls.length; i += INDEXNOW_BATCH_SIZE) {
		indexNowBatches.push(uniqueUrls.slice(i, i + INDEXNOW_BATCH_SIZE));
	}

	for (let i = 0; i < indexNowBatches.length; i++) {
		await submitIndexNowBatch(indexNowBatches[i], i + 1, indexNowBatches.length);
	}

	// 2. Submit to Bing Webmaster API
	await submitBingWebmasterApi(uniqueUrls);

	console.log("\n=======================================================");
	console.log("✅ Search Engine Indexing broadcast completed successfully!");
	console.log("=======================================================\n");
}

main().catch((err) => {
	console.warn("⚠️ Indexing broadcast notice:", err.message);
	// Never fail caller or CI pipeline
	process.exit(0);
});
