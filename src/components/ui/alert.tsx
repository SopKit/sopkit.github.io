import { Banner, type BannerProps } from "@astryxdesign/core/Banner";
import * as React from "react";

import { cn } from "@/lib/utils";

interface AlertProps extends React.ComponentProps<"div"> {
	variant?: "default" | "destructive" | null;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="alert-title" className={cn("font-medium tracking-tight", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn("grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)}
			{...props}
		/>
	);
}

/**
 * Astryx Banner. `<AlertTitle>` → `title`, `<AlertDescription>` → `description`
 * (or `title` when no AlertTitle is given), any other element (icon) → `icon`.
 */
function Alert({ variant, children, ...props }: AlertProps) {
	let title: React.ReactNode;
	let description: React.ReactNode;
	let icon: React.ReactNode;
	const rest: React.ReactNode[] = [];

	React.Children.forEach(children, (child) => {
		if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
			if (child != null && child !== false) rest.push(child);
		} else if (child.type === AlertTitle) title = child.props.children;
		else if (child.type === AlertDescription) description = child.props.children;
		else if (icon === undefined) icon = child;
		else rest.push(child);
	});

	const bannerProps = {
		...props,
		"data-slot": "alert",
		status: variant === "destructive" ? "error" : "info",
		role: props.role ?? (variant === "destructive" ? "alert" : undefined),
		title: title ?? description,
		description: title !== undefined ? description : undefined,
		icon,
		children: rest.length ? rest : undefined,
	} as unknown as BannerProps;

	return <Banner {...bannerProps} />;
}

export { Alert, AlertDescription, AlertTitle };
