/**
 * Accordion — shadcn-compatible compound API backed by Astryx
 * `CollapsibleGroup` + `Collapsible` (each item is a disclosure; the group
 * coordinates single/multiple open state). Content stays in the DOM while
 * closed (`display: none`), so FAQ answers remain crawlable.
 *
 *   <Accordion type="single" collapsible>
 *     <AccordionItem value="q1">
 *       <AccordionTrigger>Question</AccordionTrigger>
 *       <AccordionContent>Answer</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 *
 * Deliberately not a client module: it holds no state and reads its slots
 * with plain element-type checks, so server components (ToolSharedComponents)
 * can render it and the slot types are compared on the side that created
 * them. The Astryx group/collapsible it renders are the client boundary.
 */

import * as React from "react";
import { Collapsible, CollapsibleGroup } from "@astryxdesign/core/Collapsible";

import { cn } from "../../lib/utils";

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

type AccordionSingleProps = {
	type: "single";
	value?: string;
	defaultValue?: string;
	onValueChange?(value: string): void;
	/** Astryx single groups always allow closing the open item. */
	collapsible?: boolean;
};

type AccordionMultipleProps = {
	type: "multiple";
	value?: string[];
	defaultValue?: string[];
	onValueChange?(value: string[]): void;
};

type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) &
	Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "dir"> & {
		disabled?: boolean;
		dir?: "ltr" | "rtl";
		orientation?: "horizontal" | "vertical";
	};

function Accordion(allProps: AccordionProps) {
	const {
		type,
		value,
		defaultValue,
		onValueChange,
		className,
		children,
		disabled: _disabled,
		dir: _dir,
		orientation: _orientation,
		...rest
	} = allProps as AccordionProps & { collapsible?: boolean };
	const { collapsible: _collapsible, ...props } = rest as typeof rest & { collapsible?: boolean };

	const handleChange = onValueChange
		? (next: string | string[]) => {
				if (type === "single") (onValueChange as (v: string) => void)(Array.isArray(next) ? (next[0] ?? "") : next);
				else (onValueChange as (v: string[]) => void)(Array.isArray(next) ? next : next ? [next] : []);
			}
		: undefined;

	return (
		<CollapsibleGroup
			{...(props as Record<string, unknown>)}
			data-slot="accordion"
			className={className}
			type={type}
			value={value}
			defaultValue={defaultValue}
			onChange={handleChange}
		>
			{children}
		</CollapsibleGroup>
	);
}

function AccordionTrigger(_props: React.ComponentProps<"button">): React.ReactElement | null {
	return null;
}

function AccordionContent(_props: React.ComponentProps<"div"> & { forceMount?: true }): React.ReactElement | null {
	return null;
}

interface AccordionItemProps extends Omit<React.ComponentProps<"div">, "value"> {
	value: string;
	disabled?: boolean;
}

function AccordionItem({ value, disabled, className, children, ...props }: AccordionItemProps) {
	const trigger = findElement(children, AccordionTrigger);
	const content = findElement(children, AccordionContent);
	const triggerProps = (trigger?.props ?? {}) as React.ComponentProps<"button">;
	const contentProps = (content?.props ?? {}) as React.ComponentProps<"div">;

	return (
		<Collapsible
			{...(props as Record<string, unknown>)}
			data-slot="accordion-item"
			className={className}
			value={value}
			isDisabled={disabled}
			trigger={
				<span className={cn("block w-full text-left font-medium", triggerProps.className)}>
					{triggerProps.children}
				</span>
			}
		>
			<div data-slot="accordion-content" className={cn("pb-4 pt-0 text-sm", contentProps.className)}>
				{contentProps.children}
			</div>
		</Collapsible>
	);
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
