/**
 * @file src/performance/budget.ts
 * @description Performance budgets per route category and device tier.
 */

import { PagePerformanceProfile, RouteCategory } from "./types";

/**
 * Mobile default budget baselines
 * Targets: FCP < 1.8s, LCP < 2.5s, TBT < 200ms, CLS < 0.1, Total Transfer < 600 KiB, JS < 250 KiB
 */
export const MOBILE_CATEGORY_BUDGETS: Record<RouteCategory, PagePerformanceProfile> = {
  marketing: {
    category: "marketing",
    routePattern: "/",
    tier: "strict",
    fcpTargetMs: 1600,
    lcpTargetMs: 2400,
    tbtTargetMs: 180,
    clsTarget: 0.05,
    inpTargetMs: 180,
    speedIndexTargetMs: 2800,
    javascriptBudgetKb: 220,
    cssBudgetKb: 45,
    imageBudgetKb: 250,
    totalTransferBudgetKb: 550,
    maxDomNodes: 1400,
    maxClientComponents: 4,
    maxThirdPartyScripts: 2,
    allowAds: false,
    allowAnalytics: true,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 86400,
  },
  tool: {
    category: "tool",
    routePattern: "/tools/*",
    tier: "ultra-strict",
    fcpTargetMs: 1400,
    lcpTargetMs: 2200,
    tbtTargetMs: 150,
    clsTarget: 0.04,
    inpTargetMs: 150,
    speedIndexTargetMs: 2400,
    javascriptBudgetKb: 200, // Core initial bundle before interaction
    cssBudgetKb: 40,
    imageBudgetKb: 150,
    totalTransferBudgetKb: 450,
    maxDomNodes: 1200,
    maxClientComponents: 6,
    maxThirdPartyScripts: 2,
    allowAds: false, // Performance first
    allowAnalytics: true,
    allowHeavyLibraries: true, // Only loaded dynamically after interaction!
    cacheTtlSeconds: 86400,
  },
  directory: {
    category: "directory",
    routePattern: "/tools",
    tier: "strict",
    fcpTargetMs: 1500,
    lcpTargetMs: 2000,
    tbtTargetMs: 120,
    clsTarget: 0.03,
    inpTargetMs: 150,
    speedIndexTargetMs: 2200,
    javascriptBudgetKb: 180,
    cssBudgetKb: 35,
    imageBudgetKb: 100,
    totalTransferBudgetKb: 400,
    maxDomNodes: 1000,
    maxClientComponents: 3,
    maxThirdPartyScripts: 1,
    allowAds: false,
    allowAnalytics: true,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 86400,
  },
  content: {
    category: "content",
    routePattern: "/blog/*",
    tier: "moderate",
    fcpTargetMs: 1600,
    lcpTargetMs: 2400,
    tbtTargetMs: 180,
    clsTarget: 0.05,
    inpTargetMs: 180,
    speedIndexTargetMs: 2600,
    javascriptBudgetKb: 190,
    cssBudgetKb: 40,
    imageBudgetKb: 300,
    totalTransferBudgetKb: 580,
    maxDomNodes: 1200,
    maxClientComponents: 2,
    maxThirdPartyScripts: 2,
    allowAds: true,
    allowAnalytics: true,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 604800,
  },
  documentation: {
    category: "documentation",
    routePattern: "/docs/*",
    tier: "strict",
    fcpTargetMs: 1400,
    lcpTargetMs: 2000,
    tbtTargetMs: 120,
    clsTarget: 0.02,
    inpTargetMs: 120,
    speedIndexTargetMs: 2000,
    javascriptBudgetKb: 160,
    cssBudgetKb: 35,
    imageBudgetKb: 120,
    totalTransferBudgetKb: 380,
    maxDomNodes: 1100,
    maxClientComponents: 2,
    maxThirdPartyScripts: 1,
    allowAds: false,
    allowAnalytics: true,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 604800,
  },
  developer: {
    category: "developer",
    routePattern: "/developers/*",
    tier: "strict",
    fcpTargetMs: 1400,
    lcpTargetMs: 2000,
    tbtTargetMs: 120,
    clsTarget: 0.02,
    inpTargetMs: 120,
    speedIndexTargetMs: 2000,
    javascriptBudgetKb: 170,
    cssBudgetKb: 35,
    imageBudgetKb: 120,
    totalTransferBudgetKb: 390,
    maxDomNodes: 1000,
    maxClientComponents: 2,
    maxThirdPartyScripts: 1,
    allowAds: false,
    allowAnalytics: true,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 604800,
  },
  utility: {
    category: "utility",
    routePattern: "/embed/*",
    tier: "ultra-strict",
    fcpTargetMs: 1000,
    lcpTargetMs: 1600,
    tbtTargetMs: 80,
    clsTarget: 0.01,
    inpTargetMs: 100,
    speedIndexTargetMs: 1500,
    javascriptBudgetKb: 120,
    cssBudgetKb: 25,
    imageBudgetKb: 50,
    totalTransferBudgetKb: 250,
    maxDomNodes: 600,
    maxClientComponents: 3,
    maxThirdPartyScripts: 0,
    allowAds: false,
    allowAnalytics: false,
    allowHeavyLibraries: false,
    cacheTtlSeconds: 86400,
  },
};

/**
 * Desktop budgets (tighter FCP/LCP/TBT targets)
 */
export const DESKTOP_CATEGORY_BUDGETS: Record<RouteCategory, PagePerformanceProfile> = Object.entries(
  MOBILE_CATEGORY_BUDGETS
).reduce(
  (acc, [key, profile]) => {
    const cat = key as RouteCategory;
    acc[cat] = {
      ...profile,
      fcpTargetMs: Math.min(profile.fcpTargetMs * 0.7, 1200),
      lcpTargetMs: Math.min(profile.lcpTargetMs * 0.75, 1800),
      tbtTargetMs: Math.min(profile.tbtTargetMs * 0.7, 120),
      clsTarget: 0.03,
      javascriptBudgetKb: Math.min(profile.javascriptBudgetKb, 200),
      totalTransferBudgetKb: Math.min(profile.totalTransferBudgetKb, 500),
    };
    return acc;
  },
  {} as Record<RouteCategory, PagePerformanceProfile>
);
