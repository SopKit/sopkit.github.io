import { Divider, type DividerProps } from "@astryxdesign/core/Divider";
import * as React from "react";

interface SeparatorProps extends React.ComponentProps<"div"> {
	orientation?: "horizontal" | "vertical";
	/** Kept for API compatibility; Astryx Divider owns its separator semantics. */
	decorative?: boolean;
}

/** Astryx Divider. */
function Separator({ orientation = "horizontal", decorative: _decorative, ...props }: SeparatorProps) {
	const dividerProps = { ...props, orientation, "data-slot": "separator" } as unknown as DividerProps;
	return <Divider {...dividerProps} />;
}

export { Separator };
