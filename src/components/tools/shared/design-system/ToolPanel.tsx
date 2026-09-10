import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/**
 * Canonical bordered panel for tool controls and results. One look for all
 * tools: subtle border, translucent card tint, backdrop blur, medium shadow.
 */
export function ToolPanel({ children, className, ...rest }: ToolPanelProps) {
	return (
		<Card className={cn(DS.panel.card, className)} {...rest}>
			<CardContent className={DS.panel.content}>{children}</CardContent>
		</Card>
	);
}
