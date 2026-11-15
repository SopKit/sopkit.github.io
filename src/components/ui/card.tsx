import { Card as AstryxCard, type CardProps as AstryxCardProps } from "@astryxdesign/core/Card";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Astryx Card surface. Padding is owned by the Card* sections (px-6) so the
 * existing header/content/footer composition keeps its rhythm.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
	const cardProps = {
		...props,
		padding: 0,
		"data-slot": "card",
		className: cn("flex flex-col gap-6", className),
	} as unknown as AstryxCardProps;
	return <AstryxCard {...cardProps} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"grid auto-rows-min items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("font-semibold leading-none text-[var(--color-text-primary)]", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-sm text-[var(--color-text-secondary)]", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="card-footer" className={cn("flex items-center px-6", className)} {...props} />
	);
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
