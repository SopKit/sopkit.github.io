/**
 * @file packages/cli/src/ui/tool-list.ts
 * @description Scrollable tool listing with mouse click hit zones and category badges.
 */

import { c } from "./theme.js";
import { HitManager } from "../core/hit-box.js";

export interface ToolItem {
  id: string;
  title: string;
  value: string;
  desc: string;
  tag: string;
  shortcut?: string;
}

export interface ToolListProps {
  tools: ToolItem[];
  selectedIndex: number;
  startRow: number; // Row index in terminal
  maxVisible?: number;
  scrollOffset?: number;
  hitManager?: HitManager;
  onSelect?: (index: number) => void;
  onActivate?: (tool: ToolItem) => void;
}

export function renderToolList(props: ToolListProps): { lines: string[]; renderedCount: number } {
  const {
    tools,
    selectedIndex,
    startRow,
    maxVisible = 12,
    scrollOffset = 0,
    hitManager,
    onSelect,
    onActivate,
  } = props;

  const lines: string[] = [];
  const visibleTools = tools.slice(scrollOffset, scrollOffset + maxVisible);

  visibleTools.forEach((tool, localIdx) => {
    const globalIdx = scrollOffset + localIdx;
    const isSelected = globalIdx === selectedIndex;
    const currentRow = startRow + localIdx;

    // Register hit zone for this line
    if (hitManager) {
      hitManager.register({
        id: `tool_${tool.id}`,
        x1: 1,
        x2: 80,
        y1: currentRow,
        y2: currentRow,
        data: tool,
        onClick: () => {
          if (onSelect) onSelect(globalIdx);
          if (onActivate) onActivate(tool);
        },
      });
    }

    const pointer = isSelected ? `${c.bold}${c.cyan}❯${c.reset}` : " ";
    const shortcut = tool.shortcut
      ? `${c.dim}[${c.reset}${c.cyan}${tool.shortcut}${c.dim}]${c.reset} `
      : "    ";

    const titleText = isSelected
      ? `${c.bold}${c.cyan}${tool.title}${c.reset}`
      : `${c.white}${tool.title}${c.reset}`;

    const tagText = ` ${c.dim}[${c.reset}${c.violet}${tool.tag}${c.dim}]${c.reset}`;
    const descText = tool.desc ? ` ${c.muted}— ${tool.desc}${c.reset}` : "";

    lines.push(`  ${pointer} ${shortcut}${titleText}${tagText}${descText}`);
  });

  return { lines, renderedCount: visibleTools.length };
}
