import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	spacing?: "compact" | "default" | "loose" | "none";
	padding?: "compact" | "default" | "loose" | "none";
	divided?: boolean;
}

const SPACING_MAP = {
	none: "py-0",
	compact: "py-8 sm:py-12",
	default: "py-12 sm:py-16 md:py-20",
	loose: "py-16 sm:py-24 md:py-32",
};

export function Section({
	spacing,
	padding,
	divided = false,
	className,
	children,
	...props
}: SectionProps) {
	const activeSpacing = padding || spacing || "default";
	return (
		<section
			className={cn(
				"relative w-full",
				SPACING_MAP[activeSpacing],
				divided && "border-t border-border",
				className
			)}
			{...props}
		>
			{children}
		</section>
	);
}
