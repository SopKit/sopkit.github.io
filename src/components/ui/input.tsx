"use client";

import { TextInput, type TextInputProps } from "@astryxdesign/core/TextInput";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: React.Ref<HTMLInputElement>;
}

const TEXT_TYPES = new Set([undefined, "text", "password", "email", "search", "tel", "url"]);

/** Utilities that size/position the field box rather than style the control. */
const LAYOUT_CLASS =
	/^-?(flex-|grow|shrink|basis-|w-|min-w-|max-w-|col-|row-|order-|self-|justify-self-|m[trblxyse]?-|hidden$|block$|inline|absolute$|relative$|fixed$|sticky$|inset|top-|left-|right-|bottom-|z-)/;

function splitClasses(className?: string) {
	const layout: string[] = [];
	const control: string[] = [];
	for (const token of className?.split(/\s+/).filter(Boolean) ?? []) {
		const base = token.slice(token.lastIndexOf(":") + 1).replace(/^!/, "");
		(LAYOUT_CLASS.test(base) ? layout : control).push(token);
	}
	return {
		layout: layout.join(" ") || undefined,
		control: control.join(" ") || undefined,
		// Typography utilities land on the field box; let the inner control inherit them.
		hasType: control.some((t) => /^(font-|text-(xs|sm|base|lg|xl|\d|\[\d)|leading-|tracking-)/.test(t.slice(t.lastIndexOf(":") + 1))),
	};
}

/**
 * Native-styled fallback for input types Astryx TextInput does not model
 * (number, date, time, color, file, range…) and for uncontrolled inputs.
 */
const NATIVE_CLASS =
	"flex h-9 w-full min-w-0 rounded-[var(--radius-element)] border border-[var(--color-border-emphasized)] bg-[var(--color-background-surface)] px-3 py-1 text-sm text-[var(--color-text-primary)] outline-none transition-[color,box-shadow] placeholder:text-[var(--color-text-secondary)] focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-error)] file:mr-3 file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-text-primary)]";

function Input({
	className,
	type,
	value,
	defaultValue,
	onChange,
	disabled,
	readOnly,
	required,
	name,
	autoFocus,
	size: _size,
	style,
	...props
}: InputProps) {
	if (!TEXT_TYPES.has(type) || value === undefined || defaultValue !== undefined) {
		return (
			<input
				type={type}
				data-slot="input"
				value={value}
				defaultValue={defaultValue}
				onChange={onChange}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				name={name}
				autoFocus={autoFocus}
				style={style}
				className={cn(NATIVE_CLASS, type === "color" && "p-1", className)}
				{...props}
			/>
		);
	}

	const { layout, control, hasType } = splitClasses(className);
	// With an `id`, an external <Label htmlFor> names the field; otherwise fall
	// back to aria-label / placeholder for the visually hidden Astryx label.
	const label = props["aria-label"] ?? (props.id ? "" : (props.placeholder ?? name ?? ""));

	const textInputProps = {
		...props,
		"data-slot": "input",
		type: type as TextInputProps["type"],
		label,
		isLabelHidden: true,
		value: String(value ?? ""),
		onChange: onChange
			? (_v: string, e: React.ChangeEvent<HTMLInputElement>) => onChange(e)
			: undefined,
		isDisabled: disabled,
		isReadOnly: readOnly,
		isRequired: required,
		htmlName: name,
		hasAutoFocus: autoFocus,
		width: "100%",
		containerClassName: cn("min-w-0", layout),
		controlClassName: cn(control, hasType && "[&_input]:[font:inherit] [&_input]:tracking-[inherit]"),
		controlStyle: style,
	} as unknown as TextInputProps;

	return <TextInput {...textInputProps} />;
}
Input.displayName = "Input";

export { Input };
