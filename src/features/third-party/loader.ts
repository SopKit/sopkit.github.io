/**
 * @file src/features/third-party/loader.ts
 * @description Safe async script loader with idle deferral.
 */

import { ScriptConfig } from "./types";

export function loadExternalScript(config: ScriptConfig): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (document.getElementById(config.id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = config.id;
    script.src = config.src;
    script.async = config.async ?? true;
    script.defer = config.defer ?? true;

    script.onload = () => resolve();
    script.onerror = (e) => {
      // Gracefully handle script blocking (e.g. adblock or strict firewalls)
      console.warn(`[ThirdParty] Failed to load non-critical script ${config.id}`, e);
      resolve(); // Do not reject to protect application flow
    };

    if (config.priority === "idle" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        document.head.appendChild(script);
      });
    } else {
      document.head.appendChild(script);
    }
  });
}
