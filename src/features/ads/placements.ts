/**
 * @file src/features/ads/placements.ts
 * @description Pre-reserved ad slot dimensions guaranteeing Zero CLS.
 */

export interface AdPlacementConfig {
  slotId: string;
  width: number;
  height: number;
  wrapperClasses: string;
  format: "horizontal-banner" | "rectangle" | "vertical-rail";
}

export const AD_PLACEMENTS: Record<string, AdPlacementConfig> = {
  "top-banner": {
    slotId: "sopkit-top-banner",
    width: 728,
    height: 90,
    wrapperClasses: "w-full max-w-[728px] min-h-[90px] mx-auto my-4 overflow-hidden contain-layout bg-stone-50/50 dark:bg-stone-900/50 rounded-lg",
    format: "horizontal-banner",
  },
  "in-content": {
    slotId: "sopkit-in-content",
    width: 336,
    height: 280,
    wrapperClasses: "w-full max-w-[336px] min-h-[280px] mx-auto my-6 overflow-hidden contain-layout bg-stone-50/50 dark:bg-stone-900/50 rounded-lg",
    format: "rectangle",
  },
  "sidebar": {
    slotId: "sopkit-sidebar",
    width: 300,
    height: 250,
    wrapperClasses: "w-[300px] min-h-[250px] mx-auto my-4 overflow-hidden contain-layout bg-stone-50/50 dark:bg-stone-900/50 rounded-lg",
    format: "rectangle",
  },
};
