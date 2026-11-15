/**
 * SopKit Tool Design System — built on Astryx (`@astryxdesign/core`):
 * ToolPanel → Card, ToolField → Field, ToolModeTabs → TabList, and `DS`
 * classes resolve to Astryx tokens. Import everything tool components need
 * from here:
 *
 *   import {
 *     ToolShell, ToolGrid, ToolGridMain, ToolGridSide,
 *     ToolPanel, ToolDropzone, ToolModeTabs,
 *     ToolField, ToolFileBar, ToolSectionTitle,
 *     ToolPrivacyNote, ToolPreviewFrame, DS,
 *   } from "@/components/tools/shared/design-system";
 */
export { DS } from "./tokens";
export type { DSRadius } from "./tokens";
export {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
} from "./ToolShell";
export { ToolPanel } from "./ToolPanel";
export { ToolDropzone } from "./ToolDropzone";
export { ToolModeTabs } from "./ToolModeTabs";
export type { ToolModeTab } from "./ToolModeTabs";
export { ToolField } from "./ToolField";
export {
	ToolFileBar,
	ToolSectionTitle,
	ToolPrivacyNote,
	ToolPreviewFrame,
} from "./ToolMeta";
