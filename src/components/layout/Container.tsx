import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

const SIZE_MAP: Record<ContainerSize, string> = {
	sm: "max-w-3xl",
	md: "max-w-5xl",
	lg: "max-w-6xl",
	xl: "max-w-7xl",
	full: "max-w-full",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: ContainerSize;
	as?: React.ElementType;
}

export function Container({
	size = "xl",
	as: Component = "div",
	className,
	children,
	...props
}: ContainerProps) {
	return (
		<Component
			className={cn(
				"w-full mx-auto px-4 sm:px-6 lg:px-8",
				SIZE_MAP[size],
				className
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
