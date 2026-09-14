import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	withArrow?: boolean;
	target?: string;
	rel?: string;
}

const VARIANT_MAP = {
	primary:
		"bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-black/10 dark:shadow-black/40 border border-transparent",
	secondary:
		"bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60",
	outline:
		"bg-transparent text-foreground hover:bg-muted border border-border hover:border-foreground/40",
	ghost:
		"bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent",
};

const SIZE_MAP = {
	sm: "h-8 px-3.5 text-xs gap-1.5",
	md: "h-10 px-5 text-sm gap-2",
	lg: "h-12 px-7 text-base gap-2.5",
};

export const PillButton = React.forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	PillButtonProps
>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			withArrow = false,
			href,
			children,
			...props
		},
		ref
	) => {
		const classes = cn(
			"inline-flex items-center justify-center rounded-full font-medium tracking-tight select-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
			VARIANT_MAP[variant],
			SIZE_MAP[size],
			className
		);

		const content = (
			<>
				<span>{children}</span>
				{withArrow && (
					<span className="inline-flex items-center justify-center rounded-full bg-current/15 p-0.5 ml-0.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
						<ArrowUpRight className="h-3.5 w-3.5" />
					</span>
				)}
			</>
		);

		if (href) {
			return (
				<Link
					href={href}
					className={cn(classes, "group no-underline")}
					ref={ref as React.Ref<HTMLAnchorElement>}
					{...(props as any)}
				>
					{content}
				</Link>
			);
		}

		return (
			<button
				type="button"
				className={cn(classes, "group")}
				ref={ref as React.Ref<HTMLButtonElement>}
				{...props}
			>
				{content}
			</button>
		);
	}
);

PillButton.displayName = "PillButton";
