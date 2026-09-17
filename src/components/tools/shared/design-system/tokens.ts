/**
 * SopKit Tool Design System — single source of truth for interactive tool UIs.
 *
 * Every interactive tool component (src/components/tools/**) MUST compose its
 * interface from these tokens and the primitives in this folder instead of
 * inventing ad-hoc panels, dropzones, tabs, or spacing. The reference look is
 * the exam photo resizer family: clean bordered panels, dashed upload zones,
 * segmented mode tabs, and a 7/5 content grid inside ToolLayout.
 *
 * Rules:
 * - Do NOT introduce new max-width wrappers; use DS.shell.
 * - Do NOT invent new radii; use DS.radius (rounded-xl / rounded-2xl only).
 * - Do NOT build custom file inputs; use <ToolDropzone>.
 * - Do NOT build custom segmented controls; use <ToolModeTabs>.
 * - shadcn primitives (Button, Input, Label, Card, Select, Slider, Switch)
 *   remain the base layer — these tokens standardize how they are composed.
 */

export const DS = {
	/** Standard outer wrapper for every tool interface. */
	shell: "w-full max-w-4xl mx-auto space-y-8",
	/** Two-column workspace: controls (7) + preview/result (5). */
	grid: "grid grid-cols-1 md:grid-cols-12 gap-8",
	gridMain: "md:col-span-7 space-y-6",
	gridSide: "md:col-span-5 space-y-6",

	radius: {
		/** Default for panels, inputs, dropzones, preview frames. */
		lg: "rounded-xl",
		/** Emphasis only (hero cards, large dropzones). */
		xl: "rounded-2xl",
		/** Pills, icon chips, badges, icon buttons. */
		full: "rounded-full",
	} as const,

	panel: {
		card: "border border-border bg-surface-muted/50 dark:bg-card/40 backdrop-blur-sm shadow-sm",
		content: "p-6 space-y-6",
		divider: "pt-4 border-t border-border",
	} as const,

	dropzone: {
		base: "border-2 border-dashed border-border hover:border-foreground/40 transition-all p-8 md:p-12 text-center cursor-pointer space-y-4 hover:bg-surface-muted/30 group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
		active: "border-primary bg-primary/5",
		iconChip:
			"p-4 bg-surface-muted text-foreground rounded-2xl w-fit mx-auto group-hover:scale-105 transition-transform",
		title: "font-sans font-semibold text-lg text-foreground tracking-tight",
		subtitle: "text-sm text-muted-foreground",
	} as const,

	tabs: {
		container:
			"grid gap-1.5 p-1 bg-surface-muted border border-border rounded-xl",
		button:
			"py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
		active: "bg-primary text-primary-foreground shadow-xs font-semibold",
		inactive: "text-muted-foreground hover:text-foreground",
	} as const,

	field: {
		wrapper: "space-y-2",
		input: "h-10 text-sm rounded-xl",
	} as const,

	fileBar:
		"flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground bg-surface-muted/40 px-3.5 py-2 border border-border rounded-xl",

	previewFrame:
		"relative border border-border bg-surface-muted/20 p-4 rounded-xl",

	sectionTitle:
		"flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground",

	privacyNote:
		"text-xs text-muted-foreground flex items-center gap-1.5",

	actionRow: "flex justify-between items-center pt-2 gap-3 flex-wrap",
} as const;

export type DSRadius = keyof typeof DS.radius;
