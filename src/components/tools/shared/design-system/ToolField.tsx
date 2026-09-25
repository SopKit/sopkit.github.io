import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
 * Canonical labeled input row: Label over a 44px-tall input or custom control. Use for every
 * numeric/text setting inside tool panels so all tools share one field look.
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

	return (
		<div className={cn(DS.field.wrapper, className)}>
			<Label htmlFor={resolvedId}>{label}</Label>
			{children ?? (
				<Input id={resolvedId} className={DS.field.input} {...inputProps} />
			)}
			{hint && (
				<p className="text-xs text-muted-foreground mt-1">{hint}</p>
			)}
		</div>
	);
}
