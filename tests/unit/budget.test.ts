import { describe, it, expect } from "bun:test";
import { getPagePerformanceProfile, resolveRouteCategory } from "../../src/performance/page-profile";
import { validatePerformancePolicy } from "../../src/performance/policy";

describe("Performance Governance", () => {
  it("resolves route categories correctly", () => {
    expect(resolveRouteCategory("/")).toBe("marketing");
    expect(resolveRouteCategory("/about")).toBe("marketing");
    expect(resolveRouteCategory("/contact")).toBe("marketing");
    expect(resolveRouteCategory("/pro")).toBe("marketing");
    expect(resolveRouteCategory("/privacy")).toBe("content");
    expect(resolveRouteCategory("/terms")).toBe("content");
    expect(resolveRouteCategory("/dmca")).toBe("content");
    expect(resolveRouteCategory("/tools")).toBe("directory");
    expect(resolveRouteCategory("/archive")).toBe("directory");
    expect(resolveRouteCategory("/new-tools")).toBe("directory");
    expect(resolveRouteCategory("/tool-guides")).toBe("directory");
    expect(resolveRouteCategory("/packages")).toBe("directory");
    expect(resolveRouteCategory("/search")).toBe("directory");
    expect(resolveRouteCategory("/image-tools")).toBe("directory");
    expect(resolveRouteCategory("/pdf-tools/")).toBe("directory");
    expect(resolveRouteCategory("/calculators")).toBe("directory");
    expect(resolveRouteCategory("/blog/top-tools")).toBe("content");
    expect(resolveRouteCategory("/tool-guides/image-tools")).toBe("content");
    expect(resolveRouteCategory("/embed-tool")).toBe("utility");
    expect(resolveRouteCategory("/embed")).toBe("utility");
    expect(resolveRouteCategory("/ai-image-generator")).toBe("tool");
    expect(resolveRouteCategory("/json-formatter/?q=1")).toBe("tool");
  });

  it("has no dead route patterns", () => {
    // These paths do not exist on the site; they must fall through to the
    // default tool budget rather than a bespoke category.
    for (const dead of ["/categories", "/explore", "/articles/x", "/guides/x", "/docs/api", "/developers/sdk", "/api-docs", "/widget"]) {
      expect(resolveRouteCategory(dead)).toBe("tool");
    }
  });

  it("assigns strict budgets to tool routes", () => {
    const mobile = getPagePerformanceProfile("/pdf-tools", "mobile");
    expect(mobile.lcpTargetMs).toBeLessThanOrEqual(2500);
    expect(mobile.javascriptBudgetKb).toBeLessThanOrEqual(200);

    const desktop = getPagePerformanceProfile("/pdf-tools", "desktop");
    expect(desktop.lcpTargetMs).toBeLessThanOrEqual(1800);
    expect(desktop.javascriptBudgetKb).toBeLessThanOrEqual(200);
  });

  it("detects performance policy violations", () => {
    const profile = getPagePerformanceProfile("/", "mobile");
    const violations = validatePerformancePolicy(profile, {
      lcpMs: 3500, // Budget is 2400
      cls: 0.15,   // Budget is 0.05
      domNodes: 3000, // Budget is 1400
    });

    expect(violations.length).toBe(3);
    expect(violations.some((v) => v.rule === "lcpTargetMs")).toBe(true);
    expect(violations.some((v) => v.rule === "clsTarget")).toBe(true);
    expect(violations.some((v) => v.rule === "maxDomNodes")).toBe(true);
  });
});
