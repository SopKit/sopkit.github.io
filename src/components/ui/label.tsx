import { Text, type TextProps } from "@astryxdesign/core/Text";
import * as React from "react";

import { cn } from "@/lib/utils";

/** Astryx `Text` rendered as a native <label> (type "label"). */
function Label({ className, children, ...props }: React.ComponentProps<"label">) {
	const textProps = {
		...props,
		as: "label",
		type: "label",
		"data-slot": "label",
		className: cn(
			"flex items-center gap-2 leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
			className,
		),
		children,
	} as unknown as TextProps;
	return <Text {...textProps} />;
}

export { Label };
