export const OPEN_SEARCH_EVENT = "sopkit:open-search";

export function openUnifiedSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
  }
}
