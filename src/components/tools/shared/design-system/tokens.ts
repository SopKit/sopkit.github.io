/**
 * @file src/components/tools/shared/design-system/tokens.ts
 * @description SopKit Tool Design System — single source of truth for interactive tool UIs.
 * Standardizes layout grids, panel surfaces, input fields, KPI metric bars, and radius tokens.
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
		/** Default for panels, inputs, dropzones, preview frames. */
		lg: "rounded-xl",
		/** Emphasis only (hero containers, primary workspaces). */
		xl: "rounded-2xl",
		/** Pills, icon chips, badges, icon buttons. */
		full: "rounded-full",
	} as const,

	panel: {
		card: "border border-border/70 bg-card/60 shadow-xs",
		header: "px-5 py-3.5 border-b border-border/60 flex items-center justify-between",
		content: "p-5 sm:p-6 space-y-5",
		divider: "pt-4 border-t border-border/60",
	} as const,

	dropzone: {
		base: "border-2 border-dashed border-border/80 hover:border-foreground/40 transition-all p-8 md:p-12 text-center cursor-pointer space-y-4 hover:bg-muted/20 group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
		active: "border-primary bg-primary/5",
		iconChip:
			"p-3.5 bg-muted text-foreground rounded-xl w-fit mx-auto group-hover:scale-105 transition-transform",
		title: "font-sans font-semibold text-base sm:text-lg text-foreground tracking-tight",
		subtitle: "text-xs sm:text-sm text-muted-foreground",
	} as const,

	tabs: {
		container:
			"grid gap-1 p-1 bg-muted/60 border border-border/60 rounded-xl",
		button:
			"py-1.5 px-3 text-xs font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
		active: "bg-background text-foreground shadow-xs font-semibold",
		inactive: "text-muted-foreground hover:text-foreground",
	} as const,

	field: {
		wrapper: "space-y-1.5",
		input: "h-9 text-sm rounded-lg",
	} as const,

	kpiBar: {
		container: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-muted/30 border border-border/60 rounded-xl",
		item: "flex flex-col gap-0.5 px-2.5 py-1",
		label: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground",
		value: "text-xs sm:text-sm font-bold text-foreground",
	} as const,

	fileBar:
		"flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 border border-border/60 rounded-xl",

	previewFrame:
		"relative border border-border/60 bg-muted/10 p-4 rounded-xl overflow-hidden",

	sectionTitle:
		"flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground",

	privacyNote:
		"text-xs text-muted-foreground flex items-center gap-1.5",

	actionRow: "flex justify-between items-center pt-2 gap-3 flex-wrap",
} as const;

export type DSRadius = keyof typeof DS.radius;
