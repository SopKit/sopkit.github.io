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
  updateConsentPreferences({ analytics: granted, ads: granted });
}

export function updateConsentPreferences({
  analytics,
  ads,
}: {
  analytics: boolean;
  ads: boolean;
}) {
  if (typeof window === "undefined") return;

  const analyticsState = analytics ? "granted" : "denied";
  const adsState = ads ? "granted" : "denied";

  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: analyticsState,
      ad_storage: adsState,
      ad_user_data: adsState,
      ad_personalization: adsState,
    });
  }

  try {
    localStorage.setItem("sopkit_consent", "configured");
    localStorage.setItem("sopkit_consent_analytics", analyticsState);
    localStorage.setItem("sopkit_consent_ads", adsState);
    localStorage.setItem("sopkit_consent_version", "2");
    window.dispatchEvent(new CustomEvent("sopkit-consent-updated"));
  } catch {}
}
