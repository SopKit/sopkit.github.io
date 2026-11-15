import * as React from "react";
import { Field } from "@astryxdesign/core/Field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Visible field label. */
	label: string;
	/** Passed to both Label htmlFor and Input id. If omitted, a unique ID is generated. */
	fieldId?: string;
	/** Alias for fieldId for compatibility. */
	htmlFor?: string;
	/** Optional helper text or hint beneath the input. */
	hint?: React.ReactNode;
	children?: React.ReactNode;
}

/**
 * Canonical labeled input row built on the Astryx `Field` (label, required /
 * optional markers, `htmlFor` wiring) over the shared `Input` adapter or a
 * custom control. Use for every numeric/text setting inside tool panels so all
 * tools share one field look.
 */
export function ToolField({
	label,
	fieldId,
	htmlFor,
	id,
	hint,
	children,
	className,
	...inputProps
}: ToolFieldProps) {
	const reactId = React.useId();
	const resolvedId = htmlFor || fieldId || id || reactId;
	const hintId = hint ? `${resolvedId}-hint` : undefined;

	return (
		<div className={cn(DS.field.wrapper, className)}>
			<Field label={label} inputID={resolvedId} isDisabled={inputProps.disabled}>
				{children ?? (
					<Input
						id={resolvedId}
						aria-describedby={hintId}
						className={DS.field.input}
						{...inputProps}
					/>
				)}
			</Field>
			{hint && (
				<p id={hintId} className="text-xs text-(--color-text-secondary) mt-1">
					{hint}
				</p>
			)}
		</div>
	);
}
