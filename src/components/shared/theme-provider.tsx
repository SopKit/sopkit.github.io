"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Theme } from "@astryxdesign/core/theme";
import { LinkProvider } from "@astryxdesign/core/Link";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";

/**
 * Astryx root theme. next-themes persists the user's choice and writes
 * `data-theme` on <html> before hydration (no flash); Astryx reads the same
 * attribute to drive `color-scheme` and every light-dark() token.
 */
function AstryxTheme({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useTheme();
	const mode = resolvedTheme === "dark" ? "dark" : resolvedTheme === "light" ? "light" : "system";
	return (
		<Theme theme={neutralTheme} mode={mode}>
			<LinkProvider component={Link}>{children}</LinkProvider>
		</Theme>
	);
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="data-theme"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			{...props}
		>
			<AstryxTheme>{children}</AstryxTheme>
		</NextThemesProvider>
	);
}
