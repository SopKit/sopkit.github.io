import { Badge as AstryxBadge, type BadgeProps as AstryxBadgeProps, type BadgeVariant } from "@astryxdesign/core/Badge";
import * as React from "react";

type LegacyBadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: LegacyBadgeVariant | null;
}

const VARIANTS: Record<LegacyBadgeVariant, BadgeVariant> = {
	default: "info",
	secondary: "neutral",
	destructive: "error",
	outline: "neutral",
};

/** Astryx Badge; children become the Badge `label`. */
function Badge({ variant, children, ...props }: BadgeProps) {
	const badgeProps = {
		...props,
		"data-slot": "badge",
		variant: VARIANTS[variant ?? "default"],
		label: children,
	} as unknown as AstryxBadgeProps;
	return <AstryxBadge {...badgeProps} />;
}

export { Badge };
