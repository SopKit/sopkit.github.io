import * as React from "react";
import { Card } from "@astryxdesign/core/Card";
import type { CardProps } from "@astryxdesign/core/Card";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/**
 * Canonical bordered panel for tool controls and results, built on the Astryx
 * `Card` surface. One look for all tools: Astryx card background, border,
 * container radius and low elevation; content keeps the DS rhythm.
 */
export function ToolPanel({ children, className, ...rest }: ToolPanelProps) {
	return (
		<Card
			{...(rest as Omit<CardProps, "children">)}
			data-slot="tool-panel"
			padding={0}
			className={cn(DS.panel.card, className)}
		>
			<div className={DS.panel.content}>{children}</div>
		</Card>
	);
}
