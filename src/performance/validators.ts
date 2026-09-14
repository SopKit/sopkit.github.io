/**
 * @file src/performance/validators.ts
 * @description Programmatic validation functions for performance CI gates and runtime checks.
 */

import { PagePerformanceProfile } from "./types";
import { validatePerformancePolicy, PerformanceViolation } from "./policy";

export interface RouteRunResult {
  url: string;
  device: "mobile" | "desktop";
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcpMs: number;
    lcpMs: number;
    tbtMs: number;
    cls: number;
    speedIndexMs: number;
  };
  transfers: {
    jsTransferKb: number;
    cssTransferKb: number;
    totalTransferKb: number;
    domNodes: number;
  };
}

export interface ValidationReport {
  passed: boolean;
  violations: PerformanceViolation[];
  summary: string;
}

/**
 * Validates a Lighthouse / CI run result against a page profile
 */
export function validateRouteRun(
  profile: PagePerformanceProfile,
  run: RouteRunResult
): ValidationReport {
  const violations = validatePerformancePolicy(profile, {
    domNodes: run.transfers.domNodes,
    jsTransferKb: run.transfers.jsTransferKb,
    cssTransferKb: run.transfers.cssTransferKb,
    totalTransferKb: run.transfers.totalTransferKb,
    lcpMs: run.metrics.lcpMs,
    cls: run.metrics.cls,
    tbtMs: run.metrics.tbtMs,
  });

  const criticals = violations.filter((v) => v.severity === "critical");
  const passed = criticals.length === 0;

  const summary = passed
    ? `✅ Passed: ${run.url} [${run.device}] met all critical performance thresholds.`
    : `❌ Failed: ${run.url} [${run.device}] had ${criticals.length} critical performance violation(s).`;

  return {
    passed,
    violations,
    summary,
  };
}
