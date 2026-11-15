"use client";

/**
 * Collapsible — shadcn-compatible compound API backed by the Astryx
 * `Collapsible` (disclosure button with `aria-expanded` / `aria-controls`,
 * content kept in the DOM while closed).
 *
 *   <Collapsible open={open} onOpenChange={setOpen}>
 *     <CollapsibleTrigger>Question</CollapsibleTrigger>
 *     <CollapsibleContent>Answer</CollapsibleContent>
 *   </Collapsible>
 *
 * Astryx owns the trigger button (and its chevron), so CollapsibleTrigger's
 * children become the trigger label; with `asChild` the child element's own
 * children are used, never a nested button.
 */

import * as React from "react";
import { Collapsible as AstryxCollapsible } from "@astryxdesign/core/Collapsible";

import { cn } from "@/lib/utils";

type AnyElement = React.ReactElement<Record<string, unknown> & { children?: React.ReactNode }>;

function findElement(children: React.ReactNode, type: unknown): AnyElement | null {
	let found: AnyElement | null = null;
	React.Children.forEach(children, (child) => {
		if (found || !React.isValidElement(child)) return;
		const el = child as AnyElement;
		if (el.type === type) found = el;
		else if (el.type === React.Fragment) found = findElement(el.props.children, type);
	});
	return found;
}

interface CollapsibleProps extends Omit<React.ComponentProps<"div">, "onChange"> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
	disabled?: boolean;
}

function CollapsibleTrigger(_props: React.ComponentProps<"button"> & { asChild?: boolean }): React.ReactElement | null {
	return null;
}

function CollapsibleContent(_props: React.ComponentProps<"div"> & { forceMount?: true }): React.ReactElement | null {
	return null;
}

/** Trigger label: the trigger's children, or the asChild element's children. */
function triggerLabel(trigger: AnyElement | null): React.ReactNode {
	if (!trigger) return null;
	const { asChild, children } = trigger.props as { asChild?: boolean; children?: React.ReactNode };
	if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) return children.props.children;
	return children;
}

function Collapsible({ open, defaultOpen, onOpenChange, disabled, className, children, ...props }: CollapsibleProps) {
	const trigger = findElement(children, CollapsibleTrigger);
	const content = findElement(children, CollapsibleContent);
	const triggerClass = trigger?.props.className as string | undefined;
	const contentProps = (content?.props ?? {}) as React.ComponentProps<"div">;

	return (
		<AstryxCollapsible
			{...(props as Record<string, unknown>)}
			data-slot="collapsible"
			className={className}
			trigger={<span className={cn("block w-full text-left", triggerClass)}>{triggerLabel(trigger)}</span>}
			isOpen={open}
			defaultIsOpen={defaultOpen}
			onOpenChange={onOpenChange}
			isDisabled={disabled}
		>
			<div data-slot="collapsible-content" className={contentProps.className}>
				{contentProps.children}
			</div>
		</AstryxCollapsible>
	);
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
