"use client";

/**
 * Select — shadcn-compatible compound API backed by the Astryx `Selector`.
 *
 * Call sites keep writing:
 *
 *   <Select value={v} onValueChange={setV}>
 *     <SelectTrigger id="unit" className="w-full"><SelectValue placeholder="Pick" /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="a">Alpha</SelectItem>
 *     </SelectContent>
 *   </Select>
 *
 * `Select` reads its compound children once per render and hands Astryx a
 * flat `options` list (groups become sections, separators become dividers).
 * The sub-components render nothing on their own; they are declarative slots.
 */

import * as React from "react";
import { Selector } from "@astryxdesign/core/Selector";
import type { SelectorOptionType, SelectorOptionData, SelectorSize } from "@astryxdesign/core/Selector";

/* ------------------------------------------------------------------ */
/* Declarative slots                                                   */
/* ------------------------------------------------------------------ */

interface SelectProps {
	value?: string;
	defaultValue?: string;
	/** Method signature keeps it bivariant, so `(v: MyUnion) => void` handlers type-check. */
	onValueChange?(value: string): void;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
	dir?: "ltr" | "rtl";
	children?: React.ReactNode;
}

interface SelectTriggerProps extends React.ComponentProps<"button"> {
	size?: "sm" | "default";
}

interface SelectValueProps {
	placeholder?: React.ReactNode;
	className?: string;
	children?: React.ReactNode;
}

interface SelectContentProps extends React.ComponentProps<"div"> {
	position?: "popper" | "item-aligned";
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
}

interface SelectItemProps extends Omit<React.ComponentProps<"div">, "value"> {
	value: string;
	disabled?: boolean;
	textValue?: string;
}

function SelectTrigger(_props: SelectTriggerProps): React.ReactElement | null {
	return null;
}
function SelectValue(_props: SelectValueProps): React.ReactElement | null {
	return null;
}
function SelectContent(_props: SelectContentProps): React.ReactElement | null {
	return null;
}
function SelectGroup(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}
function SelectLabel(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}
function SelectItem(_props: SelectItemProps): React.ReactElement | null {
	return null;
}
function SelectSeparator(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}
/** Astryx scrolls long lists itself; kept for API compatibility. */
function SelectScrollUpButton(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}
function SelectScrollDownButton(_props: React.ComponentProps<"div">): React.ReactElement | null {
	return null;
}

/* ------------------------------------------------------------------ */
/* Child parsing                                                       */
/* ------------------------------------------------------------------ */

type AnyElement = React.ReactElement<Record<string, unknown> & { children?: React.ReactNode }>;

function nodeText(node: React.ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(nodeText).join("");
	if (React.isValidElement(node)) {
		return nodeText((node as AnyElement).props.children);
	}
	return "";
}

const clean = (text: string) => text.replace(/\s+/g, " ").trim();

function isPlainText(node: React.ReactNode): boolean {
	if (node == null || typeof node === "boolean") return true;
	if (typeof node === "string" || typeof node === "number") return true;
	if (Array.isArray(node)) return node.every(isPlainText);
	return false;
}

/** Depth-first search for the first element of `type`, looking through wrappers/fragments. */
function findElement(children: React.ReactNode, type: unknown): AnyElement | null {
	let found: AnyElement | null = null;
	React.Children.forEach(children, (child) => {
		if (found || !React.isValidElement(child)) return;
		const el = child as AnyElement;
		if (el.type === type) {
			found = el;
			return;
		}
		found = findElement(el.props.children, type);
	});
	return found;
}

interface ParsedOptions {
	options: SelectorOptionType[];
	/** Rich (non-text) item content keyed by value, rendered inside the option row. */
	rich: Map<string, React.ReactNode>;
}

function parseItems(children: React.ReactNode, rich: Map<string, React.ReactNode>): SelectorOptionType[] {
	const out: SelectorOptionType[] = [];
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		const el = child as AnyElement;
		if (el.type === SelectItem) {
			const props = el.props as unknown as SelectItemProps;
			const label = clean(props.textValue ?? nodeText(props.children)) || props.value;
			const option: SelectorOptionData = { value: props.value, label };
			if (props.disabled) option.disabled = true;
			if (!isPlainText(props.children)) rich.set(props.value, props.children);
			out.push(option);
			return;
		}
		if (el.type === SelectSeparator) {
			out.push({ type: "divider" });
			return;
		}
		if (el.type === SelectGroup) {
			const labelEl = findElement(el.props.children, SelectLabel);
			const title = labelEl ? clean(nodeText(labelEl.props.children)) : undefined;
			const nested = parseItems(el.props.children, rich).filter(
				(o): o is SelectorOptionData => typeof o === "object" && !("type" in o),
			);
			out.push({ type: "section", title, options: nested });
			return;
		}
		if (el.type === SelectLabel) return;
		// Fragments and arbitrary wrappers: look inside.
		out.push(...parseItems(el.props.children, rich));
	});
	return out;
}

function parseOptions(content: AnyElement | null): ParsedOptions {
	const rich = new Map<string, React.ReactNode>();
	if (!content) return { options: [], rich };
	return { options: parseItems(content.props.children, rich), rich };
}

/* ------------------------------------------------------------------ */
/* className → Astryx props                                            */
/* ------------------------------------------------------------------ */

const LAYOUT_CLASS =
	/^(?:[a-z0-9]+:)*-?(?:w-|min-w-|max-w-|m[trblxyse]?-|flex-|basis-|grow|shrink|self-|justify-self-|col-|row-|order-|hidden$|block$|inline|contents$)/;

function splitTriggerClass(className: string | undefined): {
	layout: string | undefined;
	size: SelectorSize | undefined;
	isFullWidth: boolean;
} {
	if (!className) return { layout: undefined, size: undefined, isFullWidth: false };
	const tokens = className.split(/\s+/).filter(Boolean);
	const layout = tokens.filter((t) => LAYOUT_CLASS.test(t));
	let size: SelectorSize | undefined;
	if (tokens.some((t) => /^h-(7|8)$/.test(t) || t === "text-xs")) size = "sm";
	else if (tokens.some((t) => /^h-(1[0-9]|[2-9][0-9])$/.test(t))) size = "lg";
	return {
		layout: layout.length ? layout.join(" ") : undefined,
		size,
		isFullWidth: tokens.includes("w-full"),
	};
}

/** Reads the visible text of `<label for={id}>` so the Astryx trigger keeps the caller's label as its name. */
function useExternalLabel(id: string | undefined): string | undefined {
	const [text, setText] = React.useState<string | undefined>(undefined);
	React.useEffect(() => {
		if (!id || typeof document === "undefined") return;
		// Read after paint: the caller's <label> may commit after this Select.
		const frame = requestAnimationFrame(() => {
			const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : id;
			const label = document.querySelector(`label[for="${escaped}"]`);
			const value = label?.textContent ? clean(label.textContent) : undefined;
			setText(value || undefined);
		});
		return () => cancelAnimationFrame(frame);
	}, [id]);
	return text;
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

function Select({
	value: valueProp,
	defaultValue,
	onValueChange,
	disabled,
	required,
	name,
	defaultOpen,
	children,
}: SelectProps) {
	const isControlled = valueProp !== undefined;
	const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
	const value = isControlled ? valueProp : internal;

	const trigger = findElement(children, SelectTrigger);
	const triggerProps = (trigger?.props ?? {}) as unknown as SelectTriggerProps;
	const valueEl = trigger ? findElement(triggerProps.children, SelectValue) : null;
	const placeholderNode = valueEl ? (valueEl.props as SelectValueProps).placeholder : undefined;
	const placeholder = placeholderNode != null ? clean(nodeText(placeholderNode)) : undefined;

	const content = findElement(children, SelectContent);
	const { options, rich } = parseOptions(content);

	const { layout, size: classSize, isFullWidth } = splitTriggerClass(triggerProps.className);
	const size: SelectorSize = triggerProps.size === "sm" ? "sm" : (classSize ?? "md");

	const ariaLabel = triggerProps["aria-label"];
	const externalLabel = useExternalLabel(ariaLabel ? undefined : triggerProps.id);
	const label = ariaLabel || externalLabel || placeholder || "Select an option";

	const handleChange = React.useCallback(
		(next: string) => {
			if (!isControlled) setInternal(next);
			onValueChange?.(next);
		},
		[isControlled, onValueChange],
	);

	const renderOption = React.useMemo(() => {
		if (rich.size === 0) return undefined;
		return (option: SelectorOptionData) => rich.get(option.value) ?? option.label ?? option.value;
	}, [rich]);

	return (
		<Selector
			data-slot="select"
			label={label}
			isLabelHidden
			options={options}
			value={value || undefined}
			onChange={handleChange}
			placeholder={placeholder}
			size={size}
			isDisabled={Boolean(disabled || triggerProps.disabled)}
			isRequired={required || undefined}
			htmlName={name}
			isDefaultOpen={defaultOpen}
			id={triggerProps.id}
			width={isFullWidth ? "100%" : undefined}
			containerClassName={layout}
			renderOption={renderOption}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
