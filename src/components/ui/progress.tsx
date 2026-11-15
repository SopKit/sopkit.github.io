import { ProgressBar, type ProgressBarProps } from "@astryxdesign/core/ProgressBar";
import * as React from "react";

interface ProgressProps extends Omit<React.ComponentProps<"div">, "children"> {
	value?: number | null;
	max?: number;
}

/** Astryx ProgressBar with a visually hidden label. */
function Progress({ value, max = 100, ...props }: ProgressProps) {
	const barProps = {
		...props,
		"data-slot": "progress",
		label: props["aria-label"] ?? "Progress",
		isLabelHidden: true,
		value: value ?? 0,
		max,
	} as unknown as ProgressBarProps;
	return <ProgressBar {...barProps} />;
}

export { Progress };
