"use client";

/**
 * DropdownMenu — shadcn-compatible compound API backed by the Astryx
 * `DropdownMenu` (APG menu-button: roving focus, typeahead, Escape, focus
 * return). `DropdownMenu` reads its `DropdownMenuTrigger` / `DropdownMenuContent`
 * slots and renders one Astryx menu whose trigger is the caller's element
 * (via `renderTrigger`) and whose rows are Astryx menu items.
 *
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild><Button>Open</Button></DropdownMenuTrigger>
 *     <DropdownMenuContent align="end">
 *       <DropdownMenuItem asChild><Link href="/a">A</Link></DropdownMenuItem>
 *       <DropdownMenuItem onSelect={…}>B</DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 */

import * as React from "react";
import {
	DropdownMenu as AstryxDropdownMenu,
	DropdownMenuItem as AstryxDropdownMenuItem,
	DropdownMenuCheckboxItem as AstryxDropdownMenuCheckboxItem,
	DropdownMenuRadioGroup as AstryxDropdownMenuRadioGroup,
	DropdownMenuRadioItem as AstryxDropdownMenuRadioItem,
	DropdownMenuGroup as AstryxDropdownMenuGroup,
	DropdownMenuDivider as AstryxDropdownMenuDivider,
	DropdownMenuSubMenu as AstryxDropdownMenuSubMenu,
} from "@astryxdesign/core/DropdownMenu";
import type { DropdownMenuTriggerProps as AstryxTriggerProps } from "@astryxdesign/core/DropdownMenu";

import { cn } from "@/lib/utils";

type AnyElement = React.ReactElement<Record<string, unknown> & { children?: React.ReactNode }>;

function findElement(children: React.ReactNode, type: unknown): AnyElement | null {
	let found: AnyElement | null = null;
	React.Children.forEach(children, (child) => {
		if (found || !React.isValidElement(child)) return;
		const el = child as AnyElement;
		if (el.type === type) {
			found = el;
			return;
		}
		if (el.type === React.Fragment) found = findElement(el.props.children, type);
	});
	return found;
}

/* Popover width from a Tailwind `w-[Npx]` / `min-w-[Npx]` class on the content. */
function menuWidthFrom(className: string | undefined): string | undefined {
	if (!className) return undefined;
	const m = /(?:^|\s)(?:min-)?w-\[([^\]]+)\]/.exec(className);
	return m ? m[1] : undefined;
}

/* ------------------------------------------------------------------ */
/* Root + slots                                                        */
/* ------------------------------------------------------------------ */

interface DropdownMenuProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
	modal?: boolean;
	dir?: "ltr" | "rtl";
	children?: React.ReactNode;
}

function DropdownMenuTrigger(_props: React.ComponentProps<"button"> & { asChild?: boolean }): React.ReactElement | null {
	return null;
}

interface DropdownMenuContentProps extends React.ComponentProps<"div"> {
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
	alignOffset?: number;
}

function DropdownMenuContent(_props: DropdownMenuContentProps): React.ReactElement | null {
	return null;
}

function DropdownMenu({ open, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
	const [internalOpen, setInternalOpen] = React.useState(Boolean(defaultOpen));
	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) setInternalOpen(next);
		onOpenChange?.(next);
	};

	const trigger = findElement(children, DropdownMenuTrigger);
	const content = findElement(children, DropdownMenuContent);
	const triggerProps = (trigger?.props ?? {}) as React.ComponentProps<"button"> & { asChild?: boolean };
	const contentProps = (content?.props ?? {}) as DropdownMenuContentProps;

	const renderTrigger = (astryx: AstryxTriggerProps) => {
		const { asChild, children: triggerChildren, className, ...rest } = triggerProps;
		if (asChild && React.isValidElement<Record<string, unknown>>(triggerChildren)) {
			const own = triggerChildren.props as Record<string, (e: never) => void>;
			const merged: Record<string, unknown> = { ...rest, ...astryx, "data-slot": "dropdown-menu-trigger" };
			for (const key of ["onClick", "onClickCapture", "onPointerDown", "onKeyDown", "onFocus", "onContextMenu"] as const) {
				const ours = astryx[key] as (e: never) => void;
				const theirs = own[key];
				if (theirs) merged[key] = (e: never) => {
					theirs(e);
					ours(e);
				};
			}
			return React.cloneElement(triggerChildren, merged);
		}
		return (
			<button
				type="button"
				data-slot="dropdown-menu-trigger"
				className={className}
				{...rest}
				{...astryx}
				ref={astryx.ref}
			>
				{triggerChildren}
			</button>
		);
	};

	const placement =
		contentProps.side === "top" ? "above" : contentProps.side === "left" ? "start" : contentProps.side === "right" ? "end" : "below";

	return (
		<AstryxDropdownMenu
			renderTrigger={renderTrigger}
			isMenuOpen={isOpen}
			onOpenChange={setOpen}
			alignment={contentProps.align ?? "start"}
			placement={placement}
			menuWidth={menuWidthFrom(contentProps.className)}
		>
			{contentProps.children}
		</AstryxDropdownMenu>
	);
}

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

interface DropdownMenuItemProps extends Omit<React.ComponentProps<"div">, "onSelect"> {
	inset?: boolean;
	variant?: "default" | "destructive";
	disabled?: boolean;
	asChild?: boolean;
	onSelect?: (event: Event) => void;
}

function DropdownMenuItem({
	className,
	inset,
	variant = "default",
	disabled,
	asChild,
	onSelect,
	onClick,
	children,
	...props
}: DropdownMenuItemProps) {
	let label: React.ReactNode = children;
	let href: string | undefined;
	let target: "_blank" | "_self" | undefined;
	let rel: string | undefined;
	let childClick: React.MouseEventHandler<HTMLElement> | undefined;

	if (asChild && React.isValidElement<Record<string, unknown>>(children)) {
		const p = children.props;
		label = p.children as React.ReactNode;
		href = typeof p.href === "string" ? p.href : p.href != null ? String(p.href) : undefined;
		target = p.target === "_blank" || p.target === "_self" ? p.target : undefined;
		rel = typeof p.rel === "string" ? p.rel : undefined;
		childClick = p.onClick as React.MouseEventHandler<HTMLElement> | undefined;
	}

	return (
		<AstryxDropdownMenuItem
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-item"
			data-inset={inset || undefined}
			className={cn(inset && "pl-8", className)}
			label={<span className="flex w-full items-center justify-between gap-2">{label}</span>}
			href={href}
			target={target}
			rel={rel}
			isDisabled={disabled}
			variant={variant}
			onClick={(event) => {
				childClick?.(event as React.MouseEvent<HTMLElement>);
				onClick?.(event as React.MouseEvent<HTMLDivElement>);
				onSelect?.(event.nativeEvent);
			}}
		/>
	);
}

interface DropdownMenuCheckboxItemProps extends Omit<React.ComponentProps<"div">, "onChange" | "onSelect"> {
	checked?: boolean | "indeterminate";
	onCheckedChange?(checked: boolean): void;
	disabled?: boolean;
	onSelect?: (event: Event) => void;
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	onCheckedChange,
	disabled,
	onSelect: _onSelect,
	...props
}: DropdownMenuCheckboxItemProps) {
	return (
		<AstryxDropdownMenuCheckboxItem
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-checkbox-item"
			className={className}
			label={children}
			value={checked === true}
			onChange={(next) => onCheckedChange?.(next)}
			isDisabled={disabled}
		/>
	);
}

interface DropdownMenuRadioGroupProps extends Omit<React.ComponentProps<"div">, "onChange"> {
	value?: string;
	onValueChange?(value: string): void;
	label?: string;
}

function DropdownMenuRadioGroup({ value, onValueChange, label = "Options", children, className, ...props }: DropdownMenuRadioGroupProps) {
	return (
		<AstryxDropdownMenuRadioGroup
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-radio-group"
			className={className}
			value={value}
			onChange={(next) => onValueChange?.(next)}
			label={label}
		>
			{children}
		</AstryxDropdownMenuRadioGroup>
	);
}

interface DropdownMenuRadioItemProps extends Omit<React.ComponentProps<"div">, "value"> {
	value: string;
	disabled?: boolean;
}

function DropdownMenuRadioItem({ className, children, value, disabled, ...props }: DropdownMenuRadioItemProps) {
	return (
		<AstryxDropdownMenuRadioItem
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-radio-item"
			className={className}
			value={value}
			label={children}
			isDisabled={disabled}
		/>
	);
}

/* ------------------------------------------------------------------ */
/* Structure                                                           */
/* ------------------------------------------------------------------ */

/** Astryx renders the menu in its own layer; kept for API compatibility. */
function DropdownMenuPortal({ children }: { children?: React.ReactNode }) {
	return <>{children}</>;
}

/** A `DropdownMenuLabel` as the first child becomes the Astryx group title. */
function DropdownMenuGroup({ children, className, ...props }: React.ComponentProps<"div">) {
	const labelEl = findElement(children, DropdownMenuLabel);
	const rest = labelEl ? React.Children.toArray(children).filter((c) => c !== labelEl && !(React.isValidElement(c) && c.type === DropdownMenuLabel)) : children;
	return (
		<AstryxDropdownMenuGroup
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-group"
			className={className}
			title={labelEl ? (labelEl.props.children as React.ReactNode) : undefined}
		>
			{rest}
		</AstryxDropdownMenuGroup>
	);
}

/** Standalone label row (outside a group): a titled, empty Astryx group. */
function DropdownMenuLabel({ className, inset, children, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
	return (
		<AstryxDropdownMenuGroup
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-label"
			className={cn(inset && "pl-8", className)}
			title={children}
		/>
	);
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<AstryxDropdownMenuDivider
			{...(props as Record<string, unknown>)}
			data-slot="dropdown-menu-separator"
			className={className}
		/>
	);
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
			{...props}
		/>
	);
}

/* Sub-menus: `DropdownMenuSub` reads its SubTrigger (label) and SubContent (rows). */

function DropdownMenuSubTrigger(_props: React.ComponentProps<"div"> & { inset?: boolean; disabled?: boolean }): React.ReactElement | null {
	return null;
}

function DropdownMenuSubContent(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}

function DropdownMenuSub({ children, onOpenChange }: { children?: React.ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void }) {
	const trigger = findElement(children, DropdownMenuSubTrigger);
	const content = findElement(children, DropdownMenuSubContent);
	const triggerProps = (trigger?.props ?? {}) as { children?: React.ReactNode; disabled?: boolean; className?: string };
	return (
		<AstryxDropdownMenuSubMenu
			data-slot="dropdown-menu-sub"
			label={triggerProps.children}
			isDisabled={triggerProps.disabled}
			className={triggerProps.className}
			onOpenChange={onOpenChange}
		>
			{(content?.props.children as React.ReactNode) ?? null}
		</AstryxDropdownMenuSubMenu>
	);
}

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
