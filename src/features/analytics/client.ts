/**
 * @file src/features/analytics/client.ts
 * @description Centralized, typed analytics client.
 * Strictly prevents PII leakage and duplicate event firing.
 */

import { EventMap, EventName } from "./types";

class AnalyticsClient {
  private lastPageViewPath = "";

  /**
   * Dispatches a typed event
   */
  public track<K extends EventName>(eventName: K, params: EventMap[K]) {
    if (typeof window === "undefined") return;

    if (process.env.NODE_ENV === "development") {
      console.debug(`[Analytics] ${eventName}:`, params);
    }

    if (window.gtag) {
      window.gtag("event", eventName, params);
    }
  }

  /**
   * Tracks SPA page views while preventing duplicate consecutive firings
   */
  public trackPageView(path: string, title: string) {
    if (path === this.lastPageViewPath) return;
    this.lastPageViewPath = path;

    this.track("page_view", {
      page_path: path,
      page_title: title,
    });
  }

  /**
   * Tracks tool usage with zero content leakage
   */
  public trackToolUsed(toolId: string, toolName: string, category: string, runtimeMode: string = "client") {
    this.track("tool_used", {
      tool_id: toolId,
      tool_name: toolName,
      category,
      runtime_mode: runtimeMode,
    });
  }

  /**
   * Tracks tool action (e.g. download or format)
   */
  public trackToolAction(toolId: string, actionType: string, fileType?: string) {
    this.track("tool_action", {
      tool_id: toolId,
      action_type: actionType,
      file_type: fileType,
    });
  }
}

export const analytics = new AnalyticsClient();
