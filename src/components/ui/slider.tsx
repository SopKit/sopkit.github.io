"use client";

import { Slider as AstryxSlider, type SliderProps as AstryxSliderProps } from "@astryxdesign/core/Slider";
import * as React from "react";

interface SliderProps {
	value?: number[];
	defaultValue?: number[];
	onValueChange?: (value: number[]) => void;
	onValueCommit?: (value: number[]) => void;
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	orientation?: "horizontal" | "vertical";
	id?: string;
	name?: string;
	className?: string;
	"aria-label"?: string;
}

/** "font-size" → "font size", so the hidden Astryx label stays meaningful. */
const humanize = (id?: string) => id?.replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();

/**
 * Astryx Slider keeping the array-based `value`/`onValueChange` contract.
 * One value renders a single thumb; two values render a range.
 */
function Slider({
	value,
	defaultValue,
	onValueChange,
	onValueCommit,
	min = 0,
	max = 100,
	step = 1,
	disabled,
	orientation,
	id,
	name,
	className,
	"aria-label": ariaLabel,
}: SliderProps) {
	const [inner, setInner] = React.useState<number[]>(defaultValue ?? [min]);
	const current = value ?? inner;
	const isRange = current.length > 1;

	const emit = (next: number | [number, number]) => {
		const arr = Array.isArray(next) ? [...next] : [next];
		if (value === undefined) setInner(arr);
		onValueChange?.(arr);
	};
	const commit = (next: number | [number, number]) =>
		onValueCommit?.(Array.isArray(next) ? [...next] : [next]);

	const sliderProps = {
		"data-slot": "slider",
		id,
		label: ariaLabel ?? humanize(id) ?? "Value",
		isLabelHidden: true,
		value: isRange ? [current[0], current[1]] : (current[0] ?? min),
		onChange: emit,
		onChangeEnd: onValueCommit ? commit : undefined,
		min,
		max,
		step,
		isDisabled: disabled,
		orientation,
		htmlName: name,
		width: "100%",
		containerClassName: className,
	} as unknown as AstryxSliderProps;

	return <AstryxSlider {...sliderProps} />;
}

export { Slider };
