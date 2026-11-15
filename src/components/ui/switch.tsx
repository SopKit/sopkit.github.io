"use client";

import { Switch as AstryxSwitch, type SwitchProps as AstryxSwitchProps } from "@astryxdesign/core/Switch";
import * as React from "react";

interface SwitchProps {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	required?: boolean;
	id?: string;
	name?: string;
	className?: string;
	"aria-label"?: string;
}

/**
 * Astryx Switch keeping the `checked`/`onCheckedChange` contract. Astryx owns
 * the input id, so the caller `id` is applied to the input via ref to keep
 * external `<Label htmlFor>` associations working.
 */
function Switch({
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled,
	required,
	id,
	name,
	className,
	"aria-label": ariaLabel,
}: SwitchProps) {
	const [inner, setInner] = React.useState(defaultChecked);
	const isOn = checked ?? inner;

	const inputRef = React.useCallback(
		(el: HTMLInputElement | null) => {
			if (el && id) el.id = id;
		},
		[id],
	);

	const switchProps = {
		"data-slot": "switch",
		ref: inputRef,
		label: ariaLabel ?? (id ? "" : "Toggle"),
		isLabelHidden: true,
		value: isOn,
		onChange: (next: boolean) => {
			if (checked === undefined) setInner(next);
			onCheckedChange?.(next);
		},
		isDisabled: disabled,
		isRequired: required,
		htmlName: name,
		className,
	} as unknown as AstryxSwitchProps;

	return <AstryxSwitch {...switchProps} />;
}

export { Switch };
