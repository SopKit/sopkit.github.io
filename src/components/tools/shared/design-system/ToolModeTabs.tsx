"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

export interface ToolModeTab {
	value: string;
	label: string;
}

interface ToolModeTabsProps {
	/** Available modes (2+). */
	tabs: ToolModeTab[];
	/** Currently selected value. */
	value: string;
	/** Called when the user picks a mode. */
	onChange?: (value: string) => void;
	/** Alias for onChange for standard tab compatibility. */
	onValueChange?: (value: string) => void;
	/** Accessible label for the tablist (defaults to "Tool mode"). */
	ariaLabel?: string;
	className?: string;
}

/**
 * Canonical segmented control for switching tool modes (photo/signature,
 * encode/decode, …). Renders as a real tablist for keyboard + screen-reader
 * users — arrow keys move between tabs.
 */
export function ToolModeTabs({
	tabs,
	value,
	onChange,
	onValueChange,
	ariaLabel = "Tool mode",
	className,
}: ToolModeTabsProps) {
	const handleSelect = (val: string) => {
		onChange?.(val);
		onValueChange?.(val);
	};
	const selectedIndex = Math.max(
		0,
		tabs.findIndex((tab) => tab.value === value),
	);
	const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

	const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
		let next: number | null = null;
		if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
		if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
		if (event.key === "Home") next = 0;
		if (event.key === "End") next = tabs.length - 1;
		if (next === null) return;
		event.preventDefault();
		const wrapped = (next + tabs.length) % tabs.length;
		handleSelect(tabs[wrapped].value);
		buttonRefs.current[wrapped]?.focus();
	};

	return (
	<div
		role="tablist"
		aria-label={ariaLabel}
			className={cn(DS.tabs.container, className)}
			style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
		>
			{tabs.map((tab, index) => {
				const selected = tab.value === tabs[selectedIndex]?.value;
				return (
					<button
						key={tab.value}
						ref={(node) => {
							buttonRefs.current[index] = node;
						}}
						type="button"
						role="tab"
						aria-selected={selected}
						tabIndex={selected ? 0 : -1}
						onClick={() => handleSelect(tab.value)}
						onKeyDown={(event) => handleKeyDown(event, index)}
						className={cn(
							DS.tabs.button,
							selected ? DS.tabs.active : DS.tabs.inactive,
						)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
