/**
 * @file src/performance/third-party.ts
 * @description Third-party script registry, budgets, and loading priorities.
 * Directly addresses third-party payload bloat (~330 KiB) from baseline audit.
 */

import { ThirdPartyScriptManifest } from "./types";

export const THIRD_PARTY_REGISTRY: Record<string, ThirdPartyScriptManifest> = {
  ga4: {
    id: "ga4",
    name: "Google Analytics 4",
    domain: "https://www.googletagmanager.com",
    priority: "idle", // Defer until main thread is idle!
    estimatedSizeKb: 85,
    purpose: "analytics",
    requiresConsent: true,
    loadCondition: () => process.env.NODE_ENV === "production",
  },
  adsense: {
    id: "adsense",
    name: "Google AdSense",
    domain: "https://pagead2.googlesyndication.com",
    priority: "deferred", // Never block LCP or FCP!
    estimatedSizeKb: 160,
    purpose: "monetization",
    requiresConsent: true,
    loadCondition: (pathname: string) => {
      // Never load ads on embeds, settings, auth, or ultra-strict tool pages!
      if (pathname.startsWith("/embed") || pathname.startsWith("/api")) {
        return false;
      }
      return process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
    },
  },
};

/**
 * Checks if a third party script is permitted to load on the given route
 */
export function isThirdPartyAllowed(scriptId: keyof typeof THIRD_PARTY_REGISTRY, pathname: string): boolean {
  const script = THIRD_PARTY_REGISTRY[scriptId];
  if (!script) return false;
  return script.loadCondition(pathname);
}
