/**
 * @file src/components/tools/shared/design-system/tokens.ts
 * @description SopKit Tool Design System — single source of truth for interactive tool UIs.
 * Layout recipes (grids, widths, rhythm) plus surface/radius/colour classes that
 * resolve directly to Astryx system tokens (`@astryxdesign/core` +
 * `@astryxdesign/theme-neutral`), so every tool follows the active Astryx theme
 * in light and dark mode.
 *
 * Astryx token map used below:
 *   radius   --radius-element (controls) · --radius-container (panels) · --radius-page (hero) · --radius-full (pills)
 *   surface  --color-background-card · --color-background-muted · --color-background-body
 *   border   --color-border · --color-border-emphasized
 *   text     --color-text-primary · --color-text-secondary · --color-text-accent
 *   accent   --color-accent (focus ring / active dropzone)
 *   shadow   --shadow-low · --shadow-med
 */

export const DS = {
	/** Standard outer wrapper for every tool interface. */
	shell: "w-full max-w-4xl mx-auto space-y-6",

	/** Archetype-specific responsive workspace widths. */
	workspaceWidth: {
		image: "max-w-6xl",
		document: "max-w-6xl",
		code: "max-w-6xl",
		calculator: "max-w-4xl",
		generator: "max-w-4xl",
		text: "max-w-5xl",
		seo: "max-w-6xl",
		batch: "max-w-5xl",
		default: "max-w-4xl",
	} as const,

	/** Two-column workspace: controls (7) + preview/result (5). */
	grid: "grid grid-cols-1 md:grid-cols-12 gap-6",
	gridMain: "md:col-span-7 space-y-6",
	gridSide: "md:col-span-5 space-y-6",

	radius: {
		/** Default for panels, inputs, dropzones, preview frames (Astryx container radius). */
		lg: "rounded-(--radius-container)",
		/** Emphasis only (hero containers, primary workspaces) (Astryx page radius). */
		xl: "rounded-(--radius-page)",
		/** Pills, icon chips, badges, icon buttons. */
		full: "rounded-(--radius-full)",
	} as const,

	panel: {
		/** Extra classes layered on the Astryx `Card` surface. */
		card: "border border-(--color-border) bg-(--color-background-card) shadow-(--shadow-low) rounded-(--radius-container)",
		header: "px-5 py-3.5 border-b border-(--color-border) flex items-center justify-between",
		content: "p-5 sm:p-6 space-y-5",
		divider: "pt-4 border-t border-(--color-border)",
	} as const,

	dropzone: {
		base: "border-2 border-dashed border-(--color-border-emphasized) hover:border-(--color-text-secondary) hover:bg-(--color-background-muted) transition-colors p-8 md:p-12 text-center cursor-pointer space-y-4 group rounded-(--radius-page) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)",
		active: "border-(--color-accent) bg-(--color-background-muted)",
		iconChip:
			"p-3.5 bg-(--color-background-muted) text-(--color-text-primary) rounded-(--radius-container) w-fit mx-auto group-hover:scale-105 transition-transform",
		title: "font-sans font-semibold text-base sm:text-lg text-(--color-text-primary) tracking-tight",
		subtitle: "text-xs sm:text-sm text-(--color-text-secondary)",
	} as const,

	/**
	 * Legacy segmented-tab recipe. `ToolModeTabs` now renders the Astryx
	 * `TabList`; these remain for the few hand-composed mode strips.
	 */
	tabs: {
		container:
			"grid gap-1 p-1 bg-(--color-background-muted) border border-(--color-border) rounded-(--radius-container)",
		button:
			"py-1.5 px-3 text-xs font-medium rounded-(--radius-element) transition-colors focus-visible:outline-2 focus-visible:outline-(--color-accent)",
		active: "bg-(--color-background-card) text-(--color-text-primary) shadow-(--shadow-low) font-semibold",
		inactive: "text-(--color-text-secondary) hover:text-(--color-text-primary)",
	} as const,

	field: {
		wrapper: "space-y-1.5",
		input: "h-9 text-sm rounded-(--radius-element)",
	} as const,

	kpiBar: {
		container:
			"grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-(--color-background-muted) border border-(--color-border) rounded-(--radius-container)",
		item: "flex flex-col gap-0.5 px-2.5 py-1",
		label: "text-[10px] font-mono uppercase tracking-wider text-(--color-text-secondary)",
		value: "text-xs sm:text-sm font-bold text-(--color-text-primary)",
	} as const,

	fileBar:
		"flex flex-wrap items-center justify-between gap-2 text-xs text-(--color-text-secondary) bg-(--color-background-muted) px-3 py-2 border border-(--color-border) rounded-(--radius-container)",

	previewFrame:
		"relative border border-(--color-border) bg-(--color-background-muted) p-4 rounded-(--radius-container) overflow-hidden",

	sectionTitle:
		"flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-(--color-text-secondary)",

	privacyNote: "text-xs text-(--color-text-secondary) flex items-center gap-1.5",

	actionRow: "flex justify-between items-center pt-2 gap-3 flex-wrap",
} as const;

export type DSRadius = keyof typeof DS.radius;
