"use client";

import { RadioList, RadioListContext, type RadioListProps } from "@astryxdesign/core/RadioList";
import * as React from "react";

import { cn } from "@/lib/utils";

interface RadioGroupProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
	required?: boolean;
	name?: string;
	orientation?: "horizontal" | "vertical";
	className?: string;
	children?: React.ReactNode;
	"aria-label"?: string;
}

/**
 * Astryx RadioList (group semantics, name, keyboard entry). Children keep the
 * free-form `<RadioGroupItem>` + `<Label htmlFor>` composition.
 */
function RadioGroup({
	value,
	defaultValue = "",
	onValueChange,
	disabled,
	required,
	name,
	orientation,
	className,
	children,
	"aria-label": ariaLabel,
}: RadioGroupProps) {
	const [inner, setInner] = React.useState(defaultValue);
	const current = value ?? inner;
	const handleChange = React.useCallback(
		(next: string) => {
			if (value === undefined) setInner(next);
			onValueChange?.(next);
		},
		[value, onValueChange],
	);

	const listProps = {
		"data-slot": "radio-group",
		label: ariaLabel ?? "Options",
		isLabelHidden: true,
		value: current,
		onChange: handleChange,
		isDisabled: disabled,
		isRequired: required,
		htmlName: name,
		orientation,
		controlClassName: cn("grid gap-3", className),
		children,
	} as unknown as RadioListProps;

	return <RadioList {...listProps} />;
}

interface RadioGroupItemProps
	extends Omit<React.ComponentProps<"input">, "type" | "value" | "checked" | "onChange"> {
	value: string;
}

/** Native radio bound to the enclosing Astryx RadioList context. */
function RadioGroupItem({ className, value, disabled, ...props }: RadioGroupItemProps) {
	const ctx = React.use(RadioListContext);
	return (
		<input
			type="radio"
			data-slot="radio-group-item"
			name={ctx?.name}
			value={value}
			checked={ctx ? ctx.value === value : undefined}
			disabled={disabled || ctx?.isDisabled}
			onChange={() => ctx?.onChange(value)}
			className={cn(
				"size-4 shrink-0 cursor-pointer accent-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { RadioGroup, RadioGroupItem };
