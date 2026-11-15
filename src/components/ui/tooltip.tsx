"use client";

/**
 * Tooltip — shadcn-compatible compound API backed by the Astryx `Tooltip`
 * (hover + keyboard focus, `aria-describedby` wiring, touch long-press).
 *
 *   <Tooltip>
 *     <TooltipTrigger asChild><Button aria-label="Undo">…</Button></TooltipTrigger>
 *     <TooltipContent>Undo</TooltipContent>
 *   </Tooltip>
 *
 * `Tooltip` reads its TooltipTrigger / TooltipContent slots and renders one
 * Astryx tooltip around the trigger. Astryx wraps the trigger with a
 * `display: contents` box, so `asChild` and non-`asChild` render the same.
 */

import * as React from "react";
import { Tooltip as AstryxTooltip } from "@astryxdesign/core/Tooltip";

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

interface TooltipProviderProps {
	delayDuration?: number;
	skipDelayDuration?: number;
	disableHoverableContent?: boolean;
	children?: React.ReactNode;
}

const TooltipDelayContext = React.createContext<number | undefined>(undefined);

/** Astryx tooltips need no provider; this only carries a shared `delayDuration`. */
function TooltipProvider({ delayDuration, children }: TooltipProviderProps) {
	return <TooltipDelayContext.Provider value={delayDuration}>{children}</TooltipDelayContext.Provider>;
}

interface TooltipProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
	delayDuration?: number;
	children?: React.ReactNode;
}

function TooltipTrigger(_props: React.ComponentProps<"button"> & { asChild?: boolean }): React.ReactElement | null {
	return null;
}

interface TooltipContentProps extends React.ComponentProps<"div"> {
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	hidden?: boolean;
}

function TooltipContent(_props: TooltipContentProps): React.ReactElement | null {
	return null;
}

const PLACEMENT = { top: "above", bottom: "below", left: "start", right: "end" } as const;

function Tooltip({ open, defaultOpen, onOpenChange, delayDuration, children }: TooltipProps) {
	const sharedDelay = React.useContext(TooltipDelayContext);
	const trigger = findElement(children, TooltipTrigger);
	const content = findElement(children, TooltipContent);
	const triggerProps = (trigger?.props ?? {}) as React.ComponentProps<"button"> & { asChild?: boolean };
	const contentProps = (content?.props ?? {}) as TooltipContentProps;

	const { asChild, children: triggerChildren, ...rest } = triggerProps;
	const anchor =
		asChild && React.isValidElement(triggerChildren) ? (
			triggerChildren
		) : (
			<button type="button" data-slot="tooltip-trigger" {...rest}>
				{triggerChildren}
			</button>
		);

	return (
		<AstryxTooltip
			content={contentProps.children}
			placement={contentProps.side ? PLACEMENT[contentProps.side] : undefined}
			alignment={contentProps.align}
			delay={delayDuration ?? sharedDelay}
			isEnabled={!contentProps.hidden && contentProps.children != null}
			isOpen={open}
			isDefaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
		>
			{anchor}
		</AstryxTooltip>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
