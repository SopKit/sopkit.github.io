/**
 * @file src/features/ads/policy.ts
 * @description Route-aware and performance-aware monetization policy.
 */

import { SHOW_SCRIPTLY_ADS } from "@/constants/config";

const DISALLOWED_ROUTE_PREFIXES = [
  "/embed",
  "/embed-tool",
  "/api",
  "/settings",
  "/admin",
  "/auth",
];

export function isAdAllowedOnRoute(pathname: string): boolean {
  // Global toggle constraint from AGENTS.md
  if (!SHOW_SCRIPTLY_ADS) {
    return false;
  }

  // Never allow ads on disallowed route prefixes
  if (DISALLOWED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  return true;
}
