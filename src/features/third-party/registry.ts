/**
 * @file src/features/third-party/registry.ts
 * @description Manifest of third party external services used across SopKit.
 */

import { ScriptConfig } from "./types";

export const EXTERNAL_SCRIPTS: Record<string, ScriptConfig> = {
  ga4: {
    id: "ga4-script",
    src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
    async: true,
    defer: true,
    priority: "idle",
    strategy: "lazyOnload",
  },
  adsense: {
    id: "adsense-script",
    src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX",
    async: true,
    defer: true,
    priority: "deferred",
    strategy: "lazyOnload",
  },
};
