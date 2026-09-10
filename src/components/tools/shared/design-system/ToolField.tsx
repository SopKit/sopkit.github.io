import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/** Visible field label. */
	label: string;
	/** Passed to both Label htmlFor and Input id. */
	fieldId: string;
}

/**
 * Canonical labeled input row: Label over a 44px-tall input. Use for every
 * numeric/text setting inside tool panels so all tools share one field look.
 */
export function ToolField({
	label,
	fieldId,
	className,
	...inputProps
}: ToolFieldProps) {
	return (
		<div className={cn(DS.field.wrapper, className)}>
			<Label htmlFor={fieldId}>{label}</Label>
			<Input id={fieldId} className={DS.field.input} {...inputProps} />
		</div>
	);
}
