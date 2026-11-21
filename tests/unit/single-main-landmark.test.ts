import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// The root layout owns the page's only <main id="main-content"> (the skip-link
// target). Group layouts, ToolLayout and page components must not add another:
// nested landmarks break assistive tech, and a group without a layout would
// otherwise ship pages with no landmark at all (the 2026-11 exam-tools bug).
const ROOT = join(import.meta.dir, "..", "..");
const ALLOWED_MAIN = new Set(["src/app/layout.tsx", "src/app/global-error.tsx"]);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.tsx$/.test(entry)) out.push(full);
	}
	return out;
}

describe("single <main> landmark", () => {
	const files = [...walk(join(ROOT, "src/app")), ...walk(join(ROOT, "src/components"))];

	test("only the root layout and global-error render <main>", () => {
		const offenders = files
			.filter((file) => /<main[\s>]/.test(readFileSync(file, "utf8")))
			.map((file) => relative(ROOT, file))
			.filter((file) => !ALLOWED_MAIN.has(file));
		expect(offenders).toEqual([]);
	});

	test("root layout wraps children in <main id=\"main-content\">", () => {
		const layout = readFileSync(join(ROOT, "src/app/layout.tsx"), "utf8");
		expect(layout).toMatch(/<main id="main-content">\s*\{children\}\s*<\/main>/);
		expect(layout).toContain('href="#main-content"');
	});

	test("main-content id is declared exactly once", () => {
		const count = files.filter((file) => readFileSync(file, "utf8").includes('id="main-content"')).length;
		expect(count).toBe(1);
	});
});
