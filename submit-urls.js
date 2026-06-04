import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config from environment variables
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const BING_API_KEY = process.env.BING_API_KEY;
const HOST = "sopkit.github.io";
const BASE_URL = `https://${HOST}`;

// Potential sitemap file locations
const SITEMAP_PATHS = [
	path.resolve(__dirname, "out/sitemap.xml"),
	path.resolve(__dirname, "public/sitemap.xml"),
	path.resolve(__dirname, "sitemap.xml")
];

async function main() {
	if (!BING_API_KEY) {
		console.error("❌ Error: BING_API_KEY is not defined in the .env file.");
		process.exit(1);
	}
	if (!INDEXNOW_KEY) {
		console.error("❌ Error: INDEXNOW_KEY is not defined in the .env file.");
		process.exit(1);
	}

	let sitemapPath = null;
	for (const p of SITEMAP_PATHS) {
		if (fs.existsSync(p)) {
			sitemapPath = p;
			break;
		}
	}

	if (!sitemapPath) {
		console.error("❌ Error: Sitemap file not found. Please run 'npm run build' first to generate 'out/sitemap.xml'.");
		process.exit(1);
	}

	console.log(`📖 Reading sitemap from: ${sitemapPath}`);
	const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

	// Regex to extract all URLs from <loc> tags in sitemap.xml
	const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
	const urls = [];
	let match;
	while ((match = locRegex.exec(sitemapContent)) !== null) {
		urls.push(match[1].trim());
	}

	console.log(`🔍 Found ${urls.length} URLs in the sitemap.`);

	if (urls.length === 0) {
		console.error("❌ Error: No URLs found to submit.");
		process.exit(1);
	}

	// IndexNow and Bing Webmaster API support batches of up to 500 URLs
	const BATCH_SIZE = 500;
	const batches = [];
	for (let i = 0; i < urls.length; i += BATCH_SIZE) {
		batches.push(urls.slice(i, i + BATCH_SIZE));
	}

	console.log(`📦 Split URLs into ${batches.length} batch(es) (Max ${BATCH_SIZE} per batch).`);

	for (let idx = 0; idx < batches.length; idx++) {
		const batch = batches[idx];
		const batchNum = idx + 1;
		console.log(`\n--- Sending Batch ${batchNum}/${batches.length} (${batch.length} URLs) ---`);

		// 1. Submit to IndexNow
		console.log("🚀 Submitting to IndexNow...");
		try {
			const indexNowPayload = {
				host: HOST,
				key: INDEXNOW_KEY,
				keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
				urlList: batch
			};

			const response = await fetch("https://api.indexnow.org/indexnow", {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify(indexNowPayload)
			});

			if (response.ok) {
				console.log(`✅ IndexNow Batch ${batchNum} submitted successfully! (Status: ${response.status})`);
			} else {
				const errorText = await response.text();
				console.error(`❌ IndexNow Batch ${batchNum} failed: ${response.status} ${response.statusText}`);
				console.error(`Details: ${errorText}`);
			}
		} catch (error) {
			console.error(`❌ IndexNow Batch ${batchNum} error:`, error.message);
		}

		// 2. Submit to Bing Webmaster Tools API directly
		console.log("🚀 Submitting to Bing Webmaster API...");
		try {
			const bingPayload = {
				siteUrl: `${BASE_URL}/`,
				urlList: batch
			};

			const response = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify(bingPayload)
			});

			if (response.ok) {
				console.log(`✅ Bing Batch ${batchNum} submitted successfully! (Status: ${response.status})`);
			} else {
				const errorText = await response.text();
				console.error(`❌ Bing Batch ${batchNum} failed: ${response.status} ${response.statusText}`);
				console.error(`Details: ${errorText}`);
			}
		} catch (error) {
			console.error(`❌ Bing Batch ${batchNum} error:`, error.message);
		}
	}

	console.log("\n🎉 URL submission finished!");
}

main().catch((err) => {
	console.error("💥 Uncaught error running URL submission script:", err);
	process.exit(1);
});
