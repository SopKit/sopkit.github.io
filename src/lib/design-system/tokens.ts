/**
 * SopKit Centralized Design System — Design Tokens
 * Single source of truth for semantic colors, typography, spacing, radius, and elevation.
 */

export const TOKENS = {
	typography: {
		fonts: {
			sans: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			serif: "var(--font-serif), Georgia, Cambria, 'Times New Roman', serif",
			mono: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
		},
		scale: {
			/** Large editorial hero headline */
			display: "font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08]",
			/** Page main title (H1) */
			pageTitle: "font-serif text-3xl sm:text-5xl font-normal tracking-tight leading-[1.12]",
			/** Section title (H2) */
			sectionTitle: "font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-tight",
			/** Card or group headline (H3) */
			cardTitle: "font-sans text-base sm:text-lg font-bold tracking-tight text-foreground",
			/** Standard body text */
			body: "font-sans text-sm sm:text-base text-muted-foreground leading-relaxed",
			/** Compact body text */
			bodySmall: "font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed",
			/** Micro caption / meta */
			caption: "font-sans text-xs text-muted-foreground",
			/** Uppercase label */
			label: "font-sans text-[11px] font-bold uppercase tracking-wider text-foreground",
			/** Code snippet */
			code: "font-mono text-xs",
		},
	},

	spacing: {
		xs: "p-2 gap-2",
		sm: "p-3 gap-3",
		md: "p-4 gap-4",
		lg: "p-6 gap-6",
		xl: "p-8 gap-8",
		"2xl": "p-12 gap-12",
	},

	radius: {
		sm: "rounded-md", // 6px
		md: "rounded-lg", // 10px
		lg: "rounded-xl", // 14px
		xl: "rounded-2xl", // 20px
		full: "rounded-full", // 9999px
	},

	shadows: {
		sm: "shadow-sm",
		md: "shadow-md shadow-black/5 dark:shadow-black/20",
		lg: "shadow-lg shadow-black/5 dark:shadow-black/30",
		xl: "shadow-xl shadow-black/10 dark:shadow-black/40",
		card: "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]",
		floating: "shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.5)]",
	},

	transitions: {
		fast: "transition-all duration-150 ease-out",
		normal: "transition-all duration-250 ease-out",
		smooth: "transition-all duration-350 cubic-bezier(0.16, 1, 0.3, 1)",
	},
} as const;

export type TypographyScaleKey = keyof typeof TOKENS.typography.scale;
export type RadiusKey = keyof typeof TOKENS.radius;
export type ShadowKey = keyof typeof TOKENS.shadows;
