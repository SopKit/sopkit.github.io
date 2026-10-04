#!/usr/bin/env node
/**
 * @file scripts/audit-all-tools.mjs
 * @description Reproducible, repo-wide audit of every registered tool.
 *
 * Measures the dimensions that actually affect users and search:
 *  - metadata completeness, uniqueness and length constraints
 *  - content coverage (FAQ / features / how-to / article)
 *  - route resolution (does a page.tsx exist for the tool route?)
 *  - UI/UX design-system compliance (raw wrappers, file inputs, forbidden radii)
 *
 * Report-only by default (exit 0). Pass --strict to exit 1 when P1 issues exist.
 *
 * Usage: node scripts/audit-all-tools.mjs [--strict] [--json out.json]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");
const JSON_OUT = (() => {
	const i = process.argv.indexOf("--json");
	return i !== -1 ? process.argv[i + 1] : null;
})();

const readJson = (rel, fallback = {}) => {
	try {
		return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
	} catch {
		return fallback;
	}
};

const toolsJson = readJson("src/constants/tools.json", { categories: {} });
const categories = toolsJson.categories || {};
const tools = [];
for (const key of Object.keys(categories)) {
	for (const tool of categories[key].tools || []) {
		tools.push({ ...tool, _category: key });
	}
}

const faqs = readJson("src/data/tool-faqs.json");
const features = readJson("src/data/tool-features.json");
const howtos = readJson("src/data/tool-howtos.json");
const articles = readJson("src/data/tool-articles.json");

const hasContent = (obj) =>
	obj != null &&
	(Array.isArray(obj) ? obj.length > 0 : typeof obj === "string" ? obj.trim().length > 0 : true);

// ---- Route -> page.tsx resolution -------------------------------------------
const pageRoutes = new Set();
const dynamicSegments = new Set();
const walk = (dir) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full);
			continue;
		}
		if (entry.name !== "page.tsx") continue;
		const rel = path.relative(path.join(ROOT, "src/app"), dir);
		const segments = rel
			.split(path.sep)
			.filter((s) => s && !(s.startsWith("(") && s.endsWith(")")));
		for (const seg of segments) {
			if (seg.startsWith("[") && seg.endsWith("]")) dynamicSegments.add(seg);
		}
		pageRoutes.add("/" + segments.join("/"));
	}
};
walk(path.join(ROOT, "src/app"));

const normalize = (route) => {
	const clean = (route || "").split("?")[0].replace(/\/+$/, "");
	return clean === "" ? "/" : clean;
};

const routeResolves = (route) => {
	const norm = normalize(route);
	if (pageRoutes.has(norm)) return true;
	// Dynamic routes: compare segment counts and literal segments.
	const parts = norm.split("/").filter(Boolean);
	for (const candidate of pageRoutes) {
		const cp = candidate.split("/").filter(Boolean);
		if (cp.length !== parts.length) continue;
		let ok = true;
		for (let i = 0; i < cp.length; i++) {
			if (cp[i].startsWith("[") && cp[i].endsWith("]")) continue;
			if (cp[i] !== parts[i]) { ok = false; break; }
		}
		if (ok) return true;
	}
	return false;
};

// ---- Metadata metrics -------------------------------------------------------
const issues = [];
const add = (id, category, severity, detail) => issues.push({ id, category, severity, detail });
const seen = (key) => {
	const map = new Map();
	for (const t of tools) {
		const v = (t[key] || "").trim();
		if (!v) continue;
		map.set(v, [...(map.get(v) || []), t.id]);
	}
	return [...map.entries()].filter(([, ids]) => ids.length > 1);
};

const dupSeoTitle = seen("seoTitle");
const dupSeoDesc = seen("seoDescription");
const dupDesc = seen("description");

const counts = {
	total: tools.length,
	missingName: 0,
	missingRoute: 0,
	missingDescription: 0,
	missingSeoTitle: 0,
	missingSeoDescription: 0,
	seoTitleTooLong: 0,
	seoDescriptionTooShort: 0,
	seoDescriptionTooLong: 0,
	descriptionTooShort: 0,
	duplicateSeoTitle: dupSeoTitle.length,
	duplicateSeoDescription: dupSeoDesc.length,
	duplicateDescription: dupDesc.length,
	routeNotResolved: 0,
	noFaqs: 0,
	noFeatures: 0,
	noHowTo: 0,
	noArticle: 0,
};

for (const t of tools) {
	if (!t.name?.trim()) { counts.missingName++; add(t.id, "metadata", "P1", "missing name"); }
	if (!t.route?.trim()) { counts.missingRoute++; add(t.id, "routing", "P1", "missing route"); }
	if (!t.description?.trim()) { counts.missingDescription++; add(t.id, "seo", "P1", "missing description"); }
	if (!t.seoTitle?.trim()) { counts.missingSeoTitle++; add(t.id, "seo", "P2", "missing seoTitle"); }
	if (!t.seoDescription?.trim()) { counts.missingSeoDescription++; add(t.id, "seo", "P2", "missing seoDescription"); }

	const st = (t.seoTitle || "").trim();
	if (st && st.length > 60) { counts.seoTitleTooLong++; add(t.id, "seo", "P3", `seoTitle ${st.length} > 60`); }

	const sd = (t.seoDescription || "").trim();
	if (sd && sd.length < 100) { counts.seoDescriptionTooShort++; add(t.id, "seo", "P3", `seoDescription ${sd.length} < 100`); }
	if (sd && sd.length > 160) { counts.seoDescriptionTooLong++; add(t.id, "seo", "P3", `seoDescription ${sd.length} > 160`); }

	const d = (t.description || "").trim();
	if (d && d.length < 80) { counts.descriptionTooShort++; add(t.id, "seo", "P3", `description ${d.length} < 80`); }

	if (t.route && !routeResolves(t.route)) { counts.routeNotResolved++; add(t.id, "routing", "P1", `no page.tsx for ${normalize(t.route)}`); }

	if (!hasContent(faqs[t.id])) { counts.noFaqs++; add(t.id, "content", "P2", "no FAQ content"); }
	if (!hasContent(features[t.id])) { counts.noFeatures++; add(t.id, "content", "P3", "no feature highlights"); }
	if (!hasContent(howtos[t.id])) { counts.noHowTo++; add(t.id, "content", "P3", "no how-to steps"); }
	if (!hasContent(articles[t.id])) { counts.noArticle++; add(t.id, "content", "P3", "no article/intro copy"); }
}

// ---- UI/UX design-system compliance (all tool components) -------------------
const TOOLS_DIR = path.join(ROOT, "src/components/tools");
const dsFiles = [];
const walkComponents = (dir) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) { walkComponents(full); continue; }
		if (!/\.tsx?$/.test(entry.name)) continue;
		if (/\/shared\//.test(full)) continue;
		dsFiles.push(full);
	}
};
walkComponents(TOOLS_DIR);

const ui = {
	componentsScanned: dsFiles.length,
	customFileInput: 0,
	customDropzone: 0,
	forbiddenRadius: 0,
	rawContentWrapper: 0,
	cdnDependency: 0,
};

const CDN_HOSTS = ["cdn.jsdelivr.net", "cdnjs.cloudflare.com", "unpkg.com", "api.qrserver.com"];
for (const file of dsFiles) {
	const src = fs.readFileSync(file, "utf8");
	if (/type=["']file["']/.test(src) && !/ToolDropzone/.test(src)) ui.customFileInput++;
	if (/onDrop=/.test(src) && !/ToolDropzone/.test(src)) ui.customDropzone++;
	if (/rounded-(3xl|md|sm)\b/.test(src)) ui.forbiddenRadius++;
	if (/max-w-[2-6]xl\s+mx-auto/.test(src)) ui.rawContentWrapper++;
	if (CDN_HOSTS.some((h) => src.includes(h))) ui.cdnDependency++;
}

// ---- Report -----------------------------------------------------------------
const line = "=".repeat(64);
console.log(`\n${line}\nSOPKIT — REPO-WIDE TOOL AUDIT (${counts.total} tools)\n${line}`);
console.log("\nMetadata / content:");
for (const [k, v] of Object.entries(counts)) {
	const flag = v > 0 && !["total"].includes(k) ? "⚠️ " : "✅ ";
	console.log(`  ${flag}${k}: ${v}`);
}
console.log("\nUI/UX design-system compliance (tool components):");
for (const [k, v] of Object.entries(ui)) console.log(`  ${v > 0 ? "⚠️ " : "✅ "}${k}: ${v}`);

const p1 = issues.filter((i) => i.severity === "P1");
if (p1.length) {
	console.log(`\nP1 issues (${p1.length}):`);
	for (const i of p1.slice(0, 40)) console.log(`  - [${i.category}] ${i.id}: ${i.detail}`);
}
const noFaq = issues.filter((i) => i.category === "content" && i.detail.includes("FAQ"));
if (noFaq.length) {
	console.log(`\nTools with no FAQ content (${noFaq.length}):`);
	for (const i of noFaq) console.log(`  - ${i.id}`);
}

if (JSON_OUT) {
	fs.writeFileSync(path.join(ROOT, JSON_OUT), JSON.stringify({ counts, ui, issues }, null, 2));
	console.log(`\nWrote ${JSON_OUT}`);
}

console.log(`\nSummary: ${p1.length} P1, ${issues.filter((i) => i.severity === "P2").length} P2, ${issues.filter((i) => i.severity === "P3").length} P3\n`);

if (STRICT && p1.length > 0) process.exit(1);
