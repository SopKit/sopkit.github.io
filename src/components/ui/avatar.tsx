import { Avatar as AstryxAvatar, type AvatarProps as AstryxAvatarProps } from "@astryxdesign/core/Avatar";
import * as React from "react";

const SIZES = [16, 20, 24, 32, 36, 40, 48, 60, 64, 72, 96, 128, 144, 180] as const;

/** Maps a Tailwind `size-N` / `h-N` class to the nearest Astryx avatar size. */
function sizeFromClass(className?: string): AstryxAvatarProps["size"] {
	const match = className?.match(/(?:^|\s)(?:size|h)-(\d+(?:\.\d+)?)(?=\s|$)/);
	if (!match) return 32;
	const px = Number(match[1]) * 4;
	return SIZES.reduce((best, s) => (Math.abs(s - px) < Math.abs(best - px) ? s : best), SIZES[0]);
}

function textOf(node: React.ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return "";
}

/** Slot markers: their props are read by <Avatar>, they render nothing on their own. */
function AvatarImage(_props: { src?: string; alt?: string; className?: string }) {
	return null;
}

function AvatarFallback(_props: { children?: React.ReactNode; className?: string }) {
	return null;
}

/**
 * Astryx Avatar. `<AvatarImage src alt>` → `src`/`alt`; `<AvatarFallback>` text
 * → `name` (Astryx derives initials and handles image failure itself).
 */
function Avatar({ className, children, ...props }: React.ComponentProps<"div">) {
	let src: string | undefined;
	let alt: string | undefined;
	let fallback = "";
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		if (child.type === AvatarImage) ({ src, alt } = child.props as { src?: string; alt?: string });
		if (child.type === AvatarFallback) {
			fallback = textOf((child.props as { children?: React.ReactNode }).children).trim();
		}
	});

	const avatarProps = {
		...props,
		"data-slot": "avatar",
		src,
		alt,
		name: alt || fallback || undefined,
		size: sizeFromClass(className),
		className,
	} as unknown as AstryxAvatarProps;
	return <AstryxAvatar {...avatarProps} />;
}

export { Avatar, AvatarFallback, AvatarImage };
