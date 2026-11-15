"use client";

/**
 * Tabs — shadcn-compatible compound API backed by the Astryx `TabList`
 * (rendered with `role="tablist"`, so it speaks the WAI-ARIA tabs pattern:
 * roving tabindex, Arrow/Home/End, `aria-controls` → `role="tabpanel"`).
 *
 *   <Tabs defaultValue="a" onValueChange={...}>
 *     <TabsList className="w-full"><TabsTrigger value="a">A</TabsTrigger></TabsList>
 *     <TabsContent value="a">…</TabsContent>
 *   </Tabs>
 */

import * as React from "react";
import { TabList, Tab } from "@astryxdesign/core/TabList";

import { cn } from "@/lib/utils";

interface TabsContextValue {
	value: string;
	setValue: (value: string) => void;
	baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
	const ctx = React.useContext(TabsContext);
	if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>`);
	return ctx;
}

const slug = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "_");
const panelIdFor = (baseId: string, value: string) => `${baseId}-panel-${slug(value)}`;
const tabIdFor = (baseId: string, value: string) => `${baseId}-tab-${slug(value)}`;

interface TabsProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> {
	value?: string;
	defaultValue?: string;
	/** Method signature keeps it bivariant, so `(v: MyUnion) => void` handlers type-check. */
	onValueChange?(value: string): void;
	orientation?: "horizontal" | "vertical";
	dir?: "ltr" | "rtl";
	activationMode?: "automatic" | "manual";
}

function Tabs({
	value: valueProp,
	defaultValue,
	onValueChange,
	orientation: _orientation,
	dir: _dir,
	activationMode: _activationMode,
	className,
	children,
	...props
}: TabsProps) {
	const isControlled = valueProp !== undefined;
	const [internal, setInternal] = React.useState(defaultValue ?? "");
	const value = isControlled ? valueProp : internal;
	const baseId = React.useId();

	const setValue = React.useCallback(
		(next: string) => {
			if (!isControlled) setInternal(next);
			onValueChange?.(next);
		},
		[isControlled, onValueChange],
	);

	const ctx = React.useMemo(() => ({ value, setValue, baseId }), [value, setValue, baseId]);

	return (
		<TabsContext.Provider value={ctx}>
			<div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

/* Only layout utilities reach the Astryx strip; its visual treatment is the theme's. */
const LAYOUT_CLASS =
	/^(?:[a-z0-9]+:)*-?(?:w-|min-w-|max-w-|m[trblxyse]?-|self-|col-|row-|order-|hidden$|block$|flex$|inline-flex$|overflow-)/;

function TabsList({ className, children, "aria-label": ariaLabel, ...props }: React.ComponentProps<"div">) {
	const { value, setValue } = useTabsContext("TabsList");
	const tokens = (className ?? "").split(/\s+/).filter(Boolean);
	const isFill = tokens.some((t) => t === "w-full" || t === "grid" || /^grid-cols-/.test(t));
	const layoutClass = tokens.filter((t) => LAYOUT_CLASS.test(t)).join(" ") || undefined;
	const { role: _role, ...rest } = props as typeof props & { role?: string };

	return (
		<TabList
			{...(rest as Record<string, unknown>)}
			data-slot="tabs-list"
			role="tablist"
			value={value}
			onChange={setValue}
			layout={isFill ? "fill" : "hug"}
			aria-label={ariaLabel}
			className={layoutClass}
		>
			{children}
		</TabList>
	);
}

type AnyElement = React.ReactElement<{ children?: React.ReactNode }>;

function nodeText(node: React.ReactNode): string {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(nodeText).join("");
	if (React.isValidElement(node)) return nodeText((node as AnyElement).props.children);
	return "";
}

/** Splits trigger children into a text label and a leading icon element (Astryx Tab takes them separately). */
function splitTriggerChildren(children: React.ReactNode): { label: string; icon?: React.ReactNode } {
	const parts = React.Children.toArray(children);
	let icon: React.ReactNode | undefined;
	const textParts: React.ReactNode[] = [];
	for (const part of parts) {
		if (icon === undefined && React.isValidElement(part) && !nodeText(part).trim()) {
			icon = part;
			continue;
		}
		textParts.push(part);
	}
	return { label: nodeText(textParts).replace(/\s+/g, " ").trim(), icon };
}

interface TabsTriggerProps extends Omit<React.ComponentProps<"button">, "value"> {
	value: string;
	asChild?: boolean;
}

function TabsTrigger({
	value,
	children,
	className: _className,
	asChild: _asChild,
	disabled,
	...props
}: TabsTriggerProps) {
	const { baseId } = useTabsContext("TabsTrigger");
	const { label, icon } = splitTriggerChildren(children);
	return (
		<Tab
			{...(props as Record<string, unknown>)}
			data-slot="tabs-trigger"
			id={tabIdFor(baseId, value)}
			value={value}
			label={label || value}
			icon={icon}
			panelId={panelIdFor(baseId, value)}
			aria-disabled={disabled || undefined}
		/>
	);
}

interface TabsContentProps extends Omit<React.ComponentProps<"div">, "value"> {
	value: string;
	forceMount?: boolean;
}

function TabsContent({ value, forceMount, className, children, ...props }: TabsContentProps) {
	const ctx = useTabsContext("TabsContent");
	const isActive = ctx.value === value;
	if (!isActive && !forceMount) return null;
	return (
		<div
			data-slot="tabs-content"
			data-state={isActive ? "active" : "inactive"}
			role="tabpanel"
			id={panelIdFor(ctx.baseId, value)}
			aria-labelledby={tabIdFor(ctx.baseId, value)}
			tabIndex={0}
			hidden={!isActive}
			className={cn("flex-1 outline-none", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
