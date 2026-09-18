/**
 * @file packages/cli/src/ui/search-bar.ts
 * @description Interactive search bar with cursor and mouse click zone registration.
 */

import { c } from "./theme.js";
import { HitManager } from "../core/hit-box.js";

export interface SearchBarProps {
  query: string;
  isFocused: boolean;
  row: number; // Terminal line number (1-indexed)
  width?: number;
  hitManager?: HitManager;
  onFocus?: () => void;
}

export function renderSearchBar(props: SearchBarProps): string {
  const { query, isFocused, row, width = 60, hitManager, onFocus } = props;

  // Register hit zone for mouse click
  if (hitManager) {
    hitManager.register({
      id: "search_bar",
      x1: 3,
      x2: 3 + width,
      y1: row,
      y2: row,
      onClick: onFocus,
    });
  }

  const borderCol = isFocused ? c.cyan : c.darkGray;
  const icon = isFocused ? `${c.cyan}🔍${c.reset}` : `${c.muted}🔍${c.reset}`;
  const cursor = isFocused ? `${c.cyan}█${c.reset}` : "";

  const displayText = query ? `${c.bold}${c.white}${query}${c.reset}${cursor}` : `${c.dim}Search tools by name, tag, or keyword...${c.reset}${cursor}`;

  return `  ${borderCol}╭─${c.reset} ${icon} ${displayText} ${borderCol}─╮${c.reset}`;
}
