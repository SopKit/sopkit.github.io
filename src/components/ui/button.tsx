"use client";

import {
	Button as AstryxButton,
	type ButtonProps as AstryxButtonProps,
	type ButtonVariant,
	type ButtonSize,
} from "@astryxdesign/core/Button";
import * as React from "react";

import { cn } from "@/lib/utils";

type LegacyVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "pill";
type LegacySize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: LegacyVariant | null;
	size?: LegacySize | null;
	/** Render the single <a>/<Link> child as the button (via Astryx `href` + `as`). */
	asChild?: boolean;
	ref?: React.Ref<HTMLButtonElement>;
}

const VARIANTS: Record<LegacyVariant, ButtonVariant> = {
	default: "primary",
	pill: "primary",
	destructive: "destructive",
	secondary: "secondary",
	outline: "secondary",
	ghost: "ghost",
	link: "ghost",
};

const SIZES: Record<LegacySize, ButtonSize> = { default: "md", sm: "sm", lg: "lg", icon: "md" };

const VARIANT_CLASSES: Partial<Record<LegacyVariant, string>> = {
	pill: "rounded-full",
	link: "h-auto px-0 text-[var(--color-text-accent)] underline-offset-4 hover:underline",
};

/** Flattens the visible text of a node tree (used as the Astryx accessible label). */
export function textOf(node: React.ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join(" ");
	if (React.isValidElement(node)) {
		return textOf((node.props as { children?: React.ReactNode }).children);
	}
	return "";
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	disabled,
	type,
	children,
	...props
}: ButtonProps) {
	const legacyVariant = variant ?? "default";
	const legacySize = size ?? "default";

	// asChild: lift href/target/rel (and any other anchor props such as `download`)
	// off the child and let Astryx render the link with the child's element type.
	let content = children;
	let linkProps: Record<string, unknown> = {};
	let childClassName: string | undefined;
	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement<Record<string, unknown>>;
		const { children: childChildren, className: cls, ...rest } = child.props;
		if (typeof rest.href === "string") {
			content = childChildren as React.ReactNode;
			childClassName = cls as string | undefined;
			linkProps = { ...rest, as: typeof child.type === "string" ? undefined : child.type };
		} else {
			// Non-link child: keep Slot-like behaviour by merging the class onto it.
			return React.cloneElement(child, {
				className: cn(className, cls as string | undefined),
			});
		}
	}

	const label =
		props["aria-label"] ??
		(typeof linkProps["aria-label"] === "string" ? (linkProps["aria-label"] as string) : undefined) ??
		props.title ??
		textOf(content).replace(/\s+/g, " ").trim();

	const isIconOnly = legacySize === "icon";
	const isPlainText = typeof content === "string" || typeof content === "number";

	const astryxProps = {
		...props,
		...linkProps,
		label,
		variant: VARIANTS[legacyVariant],
		size: SIZES[legacySize],
		isDisabled: disabled,
		// Native buttons default to "submit" inside forms; keep that contract.
		type: type ?? "submit",
		isIconOnly,
		icon: isIconOnly ? content : undefined,
		className: cn("gap-2", VARIANT_CLASSES[legacyVariant], childClassName, className),
		"data-slot": "button",
		children: isIconOnly
			? undefined
			: isPlainText
				? String(content) === label
					? undefined
					: String(content)
				: <span className="inline-flex items-center justify-center gap-[inherit]">{content}</span>,
	} as unknown as AstryxButtonProps;

	return <AstryxButton {...astryxProps} />;
}
Button.displayName = "Button";

export { Button };
