import { describe, it, expect } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// Guards the shared client bundle: a "use client" module must never pull the
// tool registry (tools.json, 366 KB) or the data JSONs into the browser.
// Server components resolve what they need and pass serializable props.
//
//   - `@/lib/tools`      runtime imports (type-only imports are fine)
//   - `@/constants/tools.json`, `@/data/*.json`
//
// `@/constants/config` is imported by many client components; it is safe only
// while it imports no JSON (its counts come from the generated tool-stats.ts),
// which the last test pins.

const SRC_DIR = path.resolve(import.meta.dir, "../../src");

const FORBIDDEN_IMPORT_PATTERNS: Array<{ label: string; test: (line: string) => boolean }> = [
	{
		label: "@/lib/tools (runtime)",
		test: (line) =>
			/from\s+["']@\/lib\/tools["']/.test(line) && !/^\s*import\s+type\s/.test(line) && !isTypeOnlyNamedImport(line),
	},
	{
		label: "@/constants/tools.json",
		test: (line) => /from\s+["']@\/constants\/tools\.json["']/.test(line),
	},
	{
		label: "src/data/*.json",
		test: (line) => /from\s+["']@\/data\/[^"']+\.json["']/.test(line),
	},
];

function isTypeOnlyNamedImport(line: string): boolean {
	// import { type Tool, type SearchToolRecord } from "@/lib/tools"
	const match = line.match(/import\s*\{([^}]*)\}/);
	if (!match) return false;
	const specifiers = match[1]
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	return specifiers.length > 0 && specifiers.every((s) => s.startsWith("type "));
}

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);
		if (statSync(full).isDirectory()) {
			walk(full, out);
		} else if (/\.(ts|tsx)$/.test(entry)) {
			out.push(full);
		}
	}
	return out;
}

function isClientModule(source: string): boolean {
	return /^\s*["']use client["'];?/m.test(source.slice(0, 500));
}

describe("client bundle guard", () => {
	const files = walk(SRC_DIR);
	const clientFiles = files.filter((file) => isClientModule(readFileSync(file, "utf8")));

	it("finds client modules to check", () => {
		expect(clientFiles.length).toBeGreaterThan(50);
	});

	it("no \"use client\" module imports the tool registry or data JSON", () => {
		const violations: string[] = [];
		for (const file of clientFiles) {
			const lines = readFileSync(file, "utf8").split("\n");
			lines.forEach((line, index) => {
				for (const rule of FORBIDDEN_IMPORT_PATTERNS) {
					if (rule.test(line)) {
						violations.push(`${path.relative(SRC_DIR, file)}:${index + 1} imports ${rule.label}`);
					}
				}
			});
		}
		expect(violations).toEqual([]);
	});

	it("src/constants/config.ts imports no JSON", () => {
		const source = readFileSync(path.join(SRC_DIR, "constants", "config.ts"), "utf8");
		expect(/\.json["']/.test(source)).toBe(false);
	});
});
