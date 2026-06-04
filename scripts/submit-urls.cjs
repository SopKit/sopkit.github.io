const fs = require("fs");
const path = require("path");

const SITEMAP_PATH = path.resolve(__dirname, "../out/sitemap.xml");
const INDEXNOW_KEY = "78ce20b86e00443bb3776461c57c1b33";
const BING_API_KEY = process.env.BING_API_KEY;
const HOST = "sopkit.github.io";
const BASE_URL = `https://${HOST}`;

async function main() {
	if (!fs.existsSync(SITEMAP_PATH)) {
		console.error(`Sitemap file not found at ${SITEMAP_PATH}. Make sure to run 'bun run build' first.`);
		process.exit(1);
	}

	console.log(`Reading sitemap from ${SITEMAP_PATH}...`);
	const sitemapContent = fs.readFileSync(SITEMAP_PATH, "utf8");

	// Parse loc tags using regex
	const locRegex = /<loc>(https:\/\/sopkit\.github\.io[^<]+)<\/loc>/g;
	const urls = [];
	let match;
	while ((match = locRegex.exec(sitemapContent)) !== null) {
		urls.push(match[1]);
	}

	console.log(`Found ${urls.length} URLs in the sitemap.`);

	if (urls.length === 0) {
		console.error("No URLs found to submit.");
		process.exit(1);
	}

	// IndexNow and Bing usually support up to 500 URLs per batch
	const BATCH_SIZE = 500;
	const batches = [];
	for (let i = 0; i < urls.length; i += BATCH_SIZE) {
		batches.push(urls.slice(i, i + BATCH_SIZE));
	}

	console.log(`Split URLs into ${batches.length} batch(es) of size ${BATCH_SIZE}.`);

	for (let index = 0; index < batches.length; index++) {
		const batch = batches[index];
		console.log(`\n--- Processing Batch ${index + 1}/${batches.length} (${batch.length} URLs) ---`);

		// 1. Submit to IndexNow
		console.log("Submitting to IndexNow...");
		try {
			const indexNowPayload = {
				host: HOST,
				key: INDEXNOW_KEY,
				keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
				urlList: batch
			};

			const indexNowResponse = await fetch("https://api.indexnow.org/indexnow", {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify(indexNowPayload)
			});

			if (indexNowResponse.ok) {
				console.log(`✓ IndexNow Batch ${index + 1} Submitted Successfully! (Status: ${indexNowResponse.status})`);
			} else {
				const responseText = await indexNowResponse.text();
				console.error(`✗ IndexNow Batch ${index + 1} Failed: ${indexNowResponse.status} ${indexNowResponse.statusText}`);
				console.error(`Response details: ${responseText}`);
			}
		} catch (error) {
			console.error(`✗ IndexNow Batch ${index + 1} Request Error:`, error.message);
		}

		// 2. Submit to Bing Webmaster Tools API
		console.log("Submitting to Bing Webmaster API...");
		try {
			const bingPayload = {
				siteUrl: `${BASE_URL}/`,
				urlList: batch
			};

			const bingResponse = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify(bingPayload)
			});

			if (bingResponse.ok) {
				const responseData = await bingResponse.json();
				console.log(`✓ Bing Batch ${index + 1} Submitted Successfully! (Status: ${bingResponse.status})`);
				console.log("Response details:", JSON.stringify(responseData));
			} else {
				const responseText = await bingResponse.text();
				console.error(`✗ Bing Batch ${index + 1} Failed: ${bingResponse.status} ${bingResponse.statusText}`);
				console.error(`Response details: ${responseText}`);
			}
		} catch (error) {
			console.error(`✗ Bing Batch ${index + 1} Request Error:`, error.message);
		}
	}

	console.log("\nURL Submission process complete!");
}

main().catch(console.error);
