"use client";

import { TextArea, type TextAreaProps } from "@astryxdesign/core/TextArea";
import * as React from "react";

import { cn } from "@/lib/utils";

const TYPE_CLASS = /^(font-|text-(xs|sm|base|lg|xl|\d|\[\d)|leading-|tracking-)/;

/**
 * Astryx TextArea (controlled). Caller classes style the field box; the inner
 * <textarea> stretches to it (min-h/h utilities) and inherits its typography.
 * Uncontrolled usage falls back to a native textarea on Astryx tokens.
 */
function Textarea({
	className,
	value,
	defaultValue,
	onChange,
	disabled,
	readOnly,
	required,
	name,
	autoFocus,
	maxLength,
	style,
	...props
}: React.ComponentProps<"textarea">) {
	if (value === undefined || defaultValue !== undefined) {
		return (
			<textarea
				data-slot="textarea"
				defaultValue={defaultValue}
				onChange={onChange}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				name={name}
				autoFocus={autoFocus}
				maxLength={maxLength}
				style={style}
				className={cn(
					"flex min-h-16 w-full rounded-[var(--radius-element)] border border-[var(--color-border-emphasized)] bg-[var(--color-background-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	}

	const tokens = className?.split(/\s+/).filter(Boolean) ?? [];
	const base = (t: string) => t.slice(t.lastIndexOf(":") + 1);
	const hasType = tokens.some((t) => TYPE_CLASS.test(base(t)));
	const noResize = tokens.some((t) => base(t) === "resize-none");
	const label = props["aria-label"] ?? (props.id ? "" : (props.placeholder ?? name ?? ""));

	const textAreaProps = {
		...props,
		"data-slot": "textarea",
		label,
		isLabelHidden: true,
		value: String(value ?? ""),
		onChange: onChange
			? (_v: string, e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e)
			: undefined,
		isDisabled: disabled,
		isReadOnly: readOnly,
		isRequired: required,
		htmlName: name,
		hasAutoFocus: autoFocus,
		htmlMaxLength: maxLength,
		width: "100%",
		controlClassName: cn(
			"flex flex-col [&_textarea]:min-h-0 [&_textarea]:flex-1",
			hasType && "[&_textarea]:[font:inherit] [&_textarea]:tracking-[inherit]",
			noResize && "[&_textarea]:resize-none",
			className,
		),
		controlStyle: style,
	} as unknown as TextAreaProps;

	return <TextArea {...textAreaProps} />;
}

export { Textarea };
