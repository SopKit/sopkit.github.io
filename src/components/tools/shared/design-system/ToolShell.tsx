import * as React from "react";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolShellProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/**
 * Standard outer wrapper for every interactive tool. Replaces the dozens of
 * ad-hoc `max-w-2/3/4/5/6xl mx-auto` wrappers scattered across tool
 * components so all 600+ tools share one content width and rhythm.
 */
export function ToolShell({ children, className, ...rest }: ToolShellProps) {
	return (
		<div className={cn(DS.shell, className)} {...rest}>
			{children}
		</div>
	);
}

interface ToolGridProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/** Two-column workspace grid (controls + preview). Single column on mobile. */
export function ToolGrid({ children, className, ...rest }: ToolGridProps) {
	return (
		<div className={cn(DS.grid, className)} {...rest}>
			{children}
		</div>
	);
}

/** Main (left, 7/12) column of the workspace grid. */
export function ToolGridMain({
	children,
	className,
	...rest
}: ToolGridProps) {
	return (
		<div className={cn(DS.gridMain, className)} {...rest}>
			{children}
		</div>
	);
}

/** Side (right, 5/12) column of the workspace grid. */
export function ToolGridSide({
	children,
	className,
	...rest
}: ToolGridProps) {
	return (
		<div className={cn(DS.gridSide, className)} {...rest}>
			{children}
		</div>
	);
}
