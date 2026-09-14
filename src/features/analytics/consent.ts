/**
 * @file src/features/analytics/consent.ts
 * @description Google Consent Mode v2 implementation with privacy-first default denial.
 */

import { ConsentPreferences } from "./types";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const DEFAULT_CONSENT: ConsentPreferences = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Initializes default consent state prior to any tracking
 */
export function initializeConsent() {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // Set default denial
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

/**
 * Updates consent state upon explicit user permission
 */
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;

  const state = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });

  try {
    localStorage.setItem("sopkit_consent", state);
  } catch {}
}
