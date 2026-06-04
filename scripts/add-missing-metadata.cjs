#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd();
const APP_DIR = path.join(BASE_DIR, 'src/app');

// Load registry tools
const toolsJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'src/constants/tools.json'), 'utf8'));
const tools = [];
for (const cat of Object.values(toolsJson.categories)) {
	for (const t of cat.tools) {
		tools.push(t);
	}
}

// Load SEO opportunities
const seoOptsContent = fs.readFileSync(path.join(BASE_DIR, 'src/data/seo-opportunities.ts'), 'utf8');
const seoOpportunities = [];
const opportunityBlocks = seoOptsContent.split('slug:');
for (let i = 1; i < opportunityBlocks.length; i++) {
	const block = opportunityBlocks[i];
	const slugMatch = block.match(/^\s*["']([^"']+)["']/);
	const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
	const descMatch = block.match(/metaDescription:\s*["']([^"']+)["']/);
	const routeMatch = block.match(/route:\s*["']([^"']+)["']/);
	if (slugMatch) {
		seoOpportunities.push({
			slug: slugMatch[1],
			title: titleMatch ? titleMatch[1] : '',
			description: descMatch ? descMatch[1] : '',
			route: routeMatch ? routeMatch[1] : `/${slugMatch[1]}`,
		});
	}
}

function getToolInfo(route) {
	// Find in tools.json
	let t = tools.find(x => x.route === route);
	if (t) {
		return { name: t.name, description: t.description };
	}
	
	// Find in seoOpportunities
	let opt = seoOpportunities.find(x => x.route === route);
	if (opt) {
		return { name: opt.title.split(' - ')[0], description: opt.description };
	}

	// Guess from route
	const name = route.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	return {
		name: name,
		description: `Free online ${name} tool. Fast, secure, and privacy-focused browser utility.`
	};
}

// Scan files
function scanAndFix(dir, routePrefix = '') {
	const items = fs.readdirSync(dir);
	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			if (item.startsWith('_') && !item.startsWith('_(downloaders)')) continue;
			let nextPrefix = routePrefix;
			if (!item.startsWith('(')) {
				nextPrefix = routePrefix + '/' + item;
			}
			scanAndFix(fullPath, nextPrefix);
		} else if (stat.isFile() && (item === 'page.tsx' || item === 'page.js')) {
			const route = routePrefix === '' ? '/' : routePrefix;
			// Skip homepage
			if (route === '/') continue;

			let content = fs.readFileSync(fullPath, 'utf8');

			// Check if metadata already defined
			if (content.includes('export const metadata') || content.includes('generateMetadata')) {
				continue;
			}

			console.log(`Fixing missing metadata on: ${route} (${item})`);

			const info = getToolInfo(route);
			let title = `${info.name} Online Free | SopKit`;
			if (title.length > 60) {
				title = `${info.name} Free | SopKit`;
			}
			const desc = `${info.description} No signup, no uploads, 100% private browser-based tool.`.replace(/"/g, "'");

			const metadataBlock = `
export const metadata = {
	title: "${title}",
	description: "${desc}",
	alternates: {
		canonical: "https://sopkit.github.io${route}",
	},
	openGraph: {
		title: "${info.name} Online Free - No Signup | SopKit",
		description: "${desc.substring(0, 160)}",
		url: "https://sopkit.github.io${route}",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "${info.name} Online Free - Fast & Secure",
		description: "${desc.substring(0, 160)}",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};
`;

			// Inject metadata before default export
			const exportIndex = content.indexOf('export default');
			if (exportIndex !== -1) {
				const before = content.substring(0, exportIndex);
				const after = content.substring(exportIndex);
				content = before + metadataBlock + '\n' + after;
				fs.writeFileSync(fullPath, content, 'utf8');
				console.log(`  Successfully injected metadata into ${fullPath}`);
			} else {
				console.warn(`  Could not find export default in ${fullPath}`);
			}
		}
	}
}

scanAndFix(APP_DIR);
console.log('Done fixing missing metadata!');
