/**
 * @file src/performance/policy.ts
 * @description Invariant rules and checks for runtime and page performance.
 */

import { PagePerformanceProfile } from "./types";

export interface PerformanceViolation {
  rule: string;
  expected: string | number;
  actual: string | number;
  severity: "critical" | "warning";
}

/**
 * Validates measured page parameters against its profile
 */
export function validatePerformancePolicy(
  profile: PagePerformanceProfile,
  metrics: {
    domNodes?: number;
    jsTransferKb?: number;
    cssTransferKb?: number;
    totalTransferKb?: number;
    lcpMs?: number;
    cls?: number;
    tbtMs?: number;
  }
): PerformanceViolation[] {
  const violations: PerformanceViolation[] = [];

  if (metrics.domNodes !== undefined && metrics.domNodes > profile.maxDomNodes) {
    violations.push({
      rule: "maxDomNodes",
      expected: profile.maxDomNodes,
      actual: metrics.domNodes,
      severity: "warning",
    });
  }

  if (metrics.jsTransferKb !== undefined && metrics.jsTransferKb > profile.javascriptBudgetKb) {
    violations.push({
      rule: "javascriptBudgetKb",
      expected: profile.javascriptBudgetKb,
      actual: metrics.jsTransferKb,
      severity: "critical",
    });
  }

  if (metrics.cssTransferKb !== undefined && metrics.cssTransferKb > profile.cssBudgetKb) {
    violations.push({
      rule: "cssBudgetKb",
      expected: profile.cssBudgetKb,
      actual: metrics.cssTransferKb,
      severity: "warning",
    });
  }

  if (metrics.totalTransferKb !== undefined && metrics.totalTransferKb > profile.totalTransferBudgetKb) {
    violations.push({
      rule: "totalTransferBudgetKb",
      expected: profile.totalTransferBudgetKb,
      actual: metrics.totalTransferKb,
      severity: "critical",
    });
  }

  if (metrics.cls !== undefined && metrics.cls > profile.clsTarget) {
    violations.push({
      rule: "clsTarget",
      expected: profile.clsTarget,
      actual: metrics.cls,
      severity: "critical",
    });
  }

  if (metrics.lcpMs !== undefined && metrics.lcpMs > profile.lcpTargetMs) {
    violations.push({
      rule: "lcpTargetMs",
      expected: profile.lcpTargetMs,
      actual: metrics.lcpMs,
      severity: "critical",
    });
  }

  if (metrics.tbtMs !== undefined && metrics.tbtMs > profile.tbtTargetMs) {
    violations.push({
      rule: "tbtTargetMs",
      expected: profile.tbtTargetMs,
      actual: metrics.tbtMs,
      severity: "critical",
    });
  }

  return violations;
}

/**
 * Layout Shift Protection: Minimum aspect ratio / intrinsic sizing classes
 */
export const ZERO_CLS_PRESETS = {
  toolWorkspace: "min-h-[420px] contain-layout",
  previewArea: "aspect-video w-full contain-paint",
  adSlotBanner: "min-h-[90px] w-full max-w-[728px] mx-auto contain-layout",
  adSlotSidebar: "min-h-[250px] w-[300px] contain-layout",
  cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 contain-layout",
};
