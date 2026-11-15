"use client";

import {
	CheckboxInput,
	type CheckboxInputProps,
} from "@astryxdesign/core/CheckboxInput";
import * as React from "react";

type CheckedState = boolean | "indeterminate";

interface CheckboxProps {
	checked?: CheckedState;
	defaultChecked?: CheckedState;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	required?: boolean;
	id?: string;
	name?: string;
	className?: string;
	"aria-label"?: string;
}

/** Astryx CheckboxInput keeping the `checked`/`onCheckedChange` contract. */
function Checkbox({
	checked,
	defaultChecked = false,
	onCheckedChange,
	disabled,
	required,
	id,
	name,
	className,
	"aria-label": ariaLabel,
}: CheckboxProps) {
	const [inner, setInner] = React.useState<CheckedState>(defaultChecked);
	const value = checked ?? inner;

	const checkboxProps = {
		"data-slot": "checkbox",
		id,
		label: ariaLabel ?? (id ? "" : "Checkbox"),
		isLabelHidden: true,
		value,
		onChange: (next: boolean) => {
			if (checked === undefined) setInner(next);
			onCheckedChange?.(next);
		},
		isDisabled: disabled,
		isRequired: required,
		htmlName: name,
		className,
	} as unknown as CheckboxInputProps;

	return <CheckboxInput {...checkboxProps} />;
}

export { Checkbox };
