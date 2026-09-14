/**
 * @file src/features/third-party/types.ts
 * @description Third party loader and classification types.
 */

export interface ScriptConfig {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  priority: "critical" | "deferred" | "idle" | "interaction";
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
}
