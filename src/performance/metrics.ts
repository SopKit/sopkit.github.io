/**
 * @file src/performance/metrics.ts
 * @description Real-user monitoring (RUM) & Core Web Vitals instrumentation.
 */

export interface WebVitalsPayload {
  id: string;
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType?: string;
  route: string;
  timestamp: number;
}

/**
 * Report metric to internal telemetry or Google Analytics
 */
export function reportMetric(metric: WebVitalsPayload) {
  // If telemetry endpoint or beacon is available, submit asynchronously
  if (typeof window !== "undefined") {
    // 1. Log in dev mode
    if (process.env.NODE_ENV === "development") {
      console.debug(`[RUM] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating}) on ${metric.route}`);
    }

    // 2. Transmit via navigator.sendBeacon if supported
    if ("sendBeacon" in navigator) {
      try {
        const payload = JSON.stringify(metric);
        navigator.sendBeacon("/api/telemetry/vitals", payload);
      } catch {
        // Silently swallow beacon failures to prevent user interruption
      }
    }

    // 3. Emit custom event for typed analytics handlers
    window.dispatchEvent(new CustomEvent("sopkit:vital", { detail: metric }));
  }
}
