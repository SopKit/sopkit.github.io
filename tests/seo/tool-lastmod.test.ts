import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const registry = JSON.parse(fs.readFileSync(path.join(rootDir, "src/constants/tools.json"), "utf8"));
const lastmodFile = JSON.parse(fs.readFileSync(path.join(rootDir, "src/data/tool-lastmod.json"), "utf8"));

function registryTools(): Array<{ id: string; route: string }> {
  const tools: Array<{ id: string; route: string }> = [];
  for (const category of Object.values(registry.categories || {}) as any[]) {
    if (!category || !Array.isArray(category.tools)) continue;
    for (const tool of category.tools) tools.push({ id: tool.id, route: tool.route });
  }
  return tools;
}

describe("Per-tool sitemap lastmod (src/data/tool-lastmod.json)", () => {
  it("covers exactly the registry's tool routes", () => {
    const tools = registryTools();
    expect(tools.length).toBeGreaterThan(0);
    const lastmodRoutes = Object.keys(lastmodFile.lastmod);
    expect(lastmodRoutes.length).toBe(tools.length);
    expect(new Set(lastmodRoutes)).toEqual(new Set(tools.map((t) => t.route)));
  });

  it("uses real calendar dates, none in the future", () => {
    const tomorrowUtc = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    for (const date of Object.values(lastmodFile.lastmod)) {
      expect(typeof date).toBe("string");
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
      expect(date as string <= tomorrowUtc).toBe(true);
    }
  });

  it("is genuinely per-tool, not one shared date", () => {
    expect(new Set(Object.values(lastmodFile.lastmod)).size).toBeGreaterThan(1);
  });

  it("records a 40-hex generating commit", () => {
    expect(lastmodFile.generated.commit).toMatch(/^[0-9a-f]{40}$/);
  });

  it("gives tools served by the dynamic api-key-tester page one shared date", () => {
    // All *-api-key-tester tools resolve to src/app/(developer)/api-key-tester/[slug]/page.tsx,
    // so their lastmod must agree — this pins the dynamic-page behaviour.
    const apiKeyDates = new Set(
      registryTools()
        .filter((t) => t.id.endsWith("-api-key-tester"))
        .map((t) => lastmodFile.lastmod[t.route]),
    );
    expect(apiKeyDates.size).toBe(1);
  });
});
