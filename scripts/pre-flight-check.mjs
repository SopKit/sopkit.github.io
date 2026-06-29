import { writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = "https://sopkit.github.io";

async function main() {
	console.log(`Starting pre-flight check for ${BASE_URL}...`);

	// 1. Fetch robots.txt
	console.log("\nChecking robots.txt...");
	try {
		const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
		if (robotsRes.status === 200) {
			const robotsText = await robotsRes.text();
			console.log("✓ robots.txt loaded successfully (200)");
			console.log("--- Content ---");
			console.log(robotsText.slice(0, 500) + (robotsText.length > 500 ? "..." : ""));
			console.log("---------------");
		} else {
			console.error(`✗ robots.txt returned status ${robotsRes.status}`);
		}
	} catch (e) {
		console.error(`✗ Failed to fetch robots.txt: ${e.message}`);
	}

	// 2. Fetch sitemap.xml
	console.log("\nChecking sitemap.xml...");
	let urls = [];
	try {
		const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
		if (sitemapRes.status === 200) {
			const sitemapText = await sitemapRes.text();
			console.log("✓ sitemap.xml loaded successfully (200)");
			
			// Parse URLs using regex
			const locMatches = sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g);
			for (const match of locMatches) {
				urls.push(match[1]);
			}
			console.log(`Found ${urls.length} URLs in sitemap.`);
		} else {
			console.error(`✗ sitemap.xml returned status ${sitemapRes.status}`);
		}
	} catch (e) {
		console.error(`✗ Failed to fetch sitemap.xml: ${e.message}`);
	}

	if (urls.length === 0) {
		console.log("No URLs found to verify.");
		process.exit(1);
	}

	// 3. Verify all URLs
	console.log(`\nVerifying ${urls.length} URLs (concurrency = 5)...`);
	const results = [];
	const queue = [...urls];
	const active = [];
	const CONCURRENCY = 5;

	async function worker() {
		while (queue.length > 0) {
			const url = queue.shift();
			try {
				const start = Date.now();
				const res = await fetch(url, { method: "HEAD", headers: { "User-Agent": "SEO-Preflight-Check/1.0" } });
				const duration = Date.now() - start;
				results.push({ url, status: res.status, duration, ok: res.ok });
				console.log(`[${res.status}] ${url} (${duration}ms)`);
			} catch (e) {
				results.push({ url, status: 0, error: e.message, ok: false });
				console.error(`[ERR] ${url} - ${e.message}`);
			}
		}
	}

	const workers = Array.from({ length: CONCURRENCY }, () => worker());
	await Promise.all(workers);

	const failed = results.filter(r => !r.ok);
	console.log("\nSummary:");
	console.log(`Total URLs checked: ${results.length}`);
	console.log(`Passed: ${results.length - failed.length}`);
	console.log(`Failed: ${failed.length}`);

	if (failed.length > 0) {
		console.log("\nFailed URLs:");
		failed.forEach(f => {
			console.log(`- ${f.url} (status: ${f.status || "Error"}, error: ${f.error || "None"})`);
		});
	}

	const reportPath = join(process.cwd(), "pre-flight-report.json");
	writeFileSync(reportPath, JSON.stringify({ results, failed }, null, 2));
	console.log(`Report written to ${reportPath}`);

	if (failed.length > 0) {
		process.exit(1);
	} else {
		console.log("\n✓ All URLs are reachable!");
		process.exit(0);
	}
}

main().catch(console.error);
