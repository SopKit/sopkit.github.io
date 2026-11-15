"use client";

import {
	Button as AstryxButton,
	type ButtonProps as AstryxButtonProps,
	type ButtonVariant,
} from "@astryxdesign/core/Button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { textOf } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href?: string;
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
	withArrow?: boolean;
	target?: string;
	rel?: string;
	ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
}

const VARIANTS: Record<NonNullable<PillButtonProps["variant"]>, ButtonVariant> = {
	primary: "primary",
	secondary: "secondary",
	outline: "secondary",
	ghost: "ghost",
};

/** Astryx Button with pill radius; `href` renders a Next.js <Link>. */
export function PillButton({
	className,
	variant = "primary",
	size = "md",
	withArrow = false,
	href,
	disabled,
	children,
	...props
}: PillButtonProps) {
	const label = props["aria-label"] ?? textOf(children).replace(/\s+/g, " ").trim();
	const isPlainText = typeof children === "string";

	const buttonProps = {
		...props,
		label,
		variant: VARIANTS[variant],
		size,
		href,
		as: href ? Link : undefined,
		isDisabled: disabled,
		className: cn("gap-2 rounded-full tracking-tight", className),
		children: isPlainText ? (children === label ? undefined : children) : (
			<span className="inline-flex items-center gap-[inherit]">{children}</span>
		),
		endContent: withArrow ? <ArrowUpRight aria-hidden className="h-3.5 w-3.5" /> : undefined,
	} as unknown as AstryxButtonProps;

	return <AstryxButton {...buttonProps} />;
}

PillButton.displayName = "PillButton";
