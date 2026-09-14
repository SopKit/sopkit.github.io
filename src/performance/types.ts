/**
 * @file src/performance/types.ts
 * @description Performance governance type definitions for SopKit.
 */

export type RouteCategory =
  | "marketing"
  | "tool"
  | "directory"
  | "content"
  | "documentation"
  | "developer"
  | "utility";

export type DeviceType = "mobile" | "desktop";

export interface MetricTargets {
  /** Target First Contentful Paint in milliseconds */
  fcpTargetMs: number;
  /** Target Largest Contentful Paint in milliseconds */
  lcpTargetMs: number;
  /** Target Total Blocking Time in milliseconds */
  tbtTargetMs: number;
  /** Target Cumulative Layout Shift */
  clsTarget: number;
  /** Target Interaction to Next Paint in milliseconds */
  inpTargetMs: number;
  /** Target Speed Index in milliseconds */
  speedIndexTargetMs: number;
}

export interface TransferBudgets {
  /** Maximum compressed JavaScript transfer in KiB */
  javascriptBudgetKb: number;
  /** Maximum compressed CSS transfer in KiB */
  cssBudgetKb: number;
  /** Maximum image transfer in KiB */
  imageBudgetKb: number;
  /** Maximum total network transfer in KiB */
  totalTransferBudgetKb: number;
  /** Maximum initial DOM node count */
  maxDomNodes: number;
}

export interface GovernanceRules {
  /** Maximum allowed client component boundaries */
  maxClientComponents: number;
  /** Maximum allowed third-party script integrations */
  maxThirdPartyScripts: number;
  /** Whether monetization ad slots are permitted on this route */
  allowAds: boolean;
  /** Whether analytics tracking is permitted on this route */
  allowAnalytics: boolean;
  /** Whether heavy libraries (>100KB, e.g. PDF.js, canvas engines) can be loaded */
  allowHeavyLibraries: boolean;
  /** Cache-Control TTL recommendation in seconds */
  cacheTtlSeconds: number;
}

export interface PagePerformanceProfile extends MetricTargets, TransferBudgets, GovernanceRules {
  /** Human-readable category */
  category: RouteCategory;
  /** Route glob or regex identifier */
  routePattern: string;
  /** Strictness tier */
  tier: "ultra-strict" | "strict" | "moderate";
}

export type ThirdPartyScriptPriority =
  | "critical"     // Needed for fundamental functionality
  | "deferred"     // Loaded after main DOM interactive
  | "interaction"  // Loaded only upon explicit user gesture
  | "idle"         // Loaded in requestIdleCallback
  | "optional";    // Never blocking, drop if low bandwidth

export interface ThirdPartyScriptManifest {
  id: string;
  name: string;
  domain: string;
  priority: ThirdPartyScriptPriority;
  estimatedSizeKb: number;
  purpose: "analytics" | "monetization" | "support" | "cdn";
  requiresConsent: boolean;
  loadCondition: (pathname: string) => boolean;
}
