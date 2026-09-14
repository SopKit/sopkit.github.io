/**
 * @file src/features/analytics/types.ts
 * @description Strongly typed events and schemas for SopKit Analytics (GA4 + RUM).
 */

export interface EventMap {
  page_view: {
    page_path: string;
    page_title: string;
  };
  tool_used: {
    tool_id: string;
    tool_name: string;
    category: string;
    runtime_mode: string;
  };
  tool_action: {
    tool_id: string;
    action_type: string; // e.g. 'convert', 'download', 'copy'
    file_type?: string;
  };
  file_processed: {
    tool_id: string;
    size_bytes: number;
    mime_type: string;
    duration_ms: number;
  };
  search_performed: {
    query: string;
    result_count: number;
  };
  vital_metric: {
    metric_name: string;
    value: number;
    rating: string;
  };
}

export type EventName = keyof EventMap;

export interface ConsentPreferences {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}
