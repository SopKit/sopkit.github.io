"use client";

import * as React from "react";
import { TabList, Tab } from "@astryxdesign/core/TabList";

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
 * Canonical control for switching tool modes (photo/signature, encode/decode,
 * …), built on the Astryx `TabList` with `role="tablist"`: a single Tab stop
 * with roving tabindex, Arrow/Home/End navigation and equal-width tabs.
 */
export function ToolModeTabs({
	tabs,
	value,
	onChange,
	onValueChange,
	ariaLabel = "Tool mode",
	className,
}: ToolModeTabsProps) {
	const handleSelect = React.useCallback(
		(val: string) => {
			onChange?.(val);
			onValueChange?.(val);
		},
		[onChange, onValueChange],
	);
	// An unknown value falls back to the first tab, as before.
	const selected = tabs.some((tab) => tab.value === value) ? value : (tabs[0]?.value ?? "");

	return (
		<TabList
			role="tablist"
			aria-label={ariaLabel}
			value={selected}
			onChange={handleSelect}
			layout="fill"
			size="md"
			className={className}
		>
			{tabs.map((tab) => (
				<Tab key={tab.value} value={tab.value} label={tab.label} />
			))}
		</TabList>
	);
}
