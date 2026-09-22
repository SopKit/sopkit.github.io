"use client";

/**
 * @file src/components/shared/ProcessingBadge.tsx
 * @description Standardized, factual processing transparency badge.
 * Communicates browser-local, external API, hybrid, or network metadata models.
 */

import * as React from "react";
import { ShieldCheck, Cloud, Cpu, Globe, Info } from "lucide-react";
import { type DataProcessingModel, type DataProcessingInfo } from "@/features/tools/archetypes";

interface ProcessingBadgeProps {
	model?: DataProcessingModel;
	info?: DataProcessingInfo;
	compact?: boolean;
	showIcon?: boolean;
	interactive?: boolean;
	className?: string;
}

const CONFIG_MAP: Record<
	DataProcessingModel,
	{
		label: string;
		badgeText: string;
		explanation: string;
		colorClass: string;
		dotColor: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	LOCAL: {
		label: "Local Browser Sandbox",
		badgeText: "Processed Locally",
		explanation: "Your files stay on this device. Executed entirely in-browser with zero uploads.",
		colorClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
		dotColor: "bg-emerald-500",
		icon: ShieldCheck,
	},
	NO_FILE_UPLOAD: {
		label: "Network Metadata Only",
		badgeText: "Network Request",
		explanation: "Queries public endpoints or inspects headers. No file upload is required.",
		colorClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
		dotColor: "bg-sky-500",
		icon: Globe,
	},
	MIXED: {
		label: "Hybrid Execution",
		badgeText: "Hybrid Processing",
		explanation: "Some processing happens locally and some through secure external services.",
		colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
		dotColor: "bg-amber-500",
		icon: Cpu,
	},
	REMOTE: {
		label: "Secure Cloud API",
		badgeText: "External Processing",
		explanation: "Your input is sent to secure API services for processing. No data is stored.",
		colorClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
		dotColor: "bg-purple-500",
		icon: Cloud,
	},
};

export function ProcessingBadge({
	model,
	info,
	compact = false,
	showIcon = true,
	interactive = true,
	className = "",
}: ProcessingBadgeProps) {
	const resolvedType: DataProcessingModel = model || info?.type || "LOCAL";
	const config = CONFIG_MAP[resolvedType] || CONFIG_MAP.LOCAL;
	const Icon = config.icon;
	const [tooltipOpen, setTooltipOpen] = React.useState(false);

	return (
		<div className={`relative inline-flex items-center ${className}`}>
			<button
				type="button"
				onClick={() => interactive && setTooltipOpen((prev) => !prev)}
				onMouseEnter={() => interactive && setTooltipOpen(true)}
				onMouseLeave={() => interactive && setTooltipOpen(false)}
				onFocus={() => interactive && setTooltipOpen(true)}
				onBlur={() => interactive && setTooltipOpen(false)}
				className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium transition-all select-none ${
					config.colorClass
				} ${interactive ? "cursor-help hover:opacity-90" : "cursor-default"}`}
				aria-label={`Processing model: ${config.label}. ${config.explanation}`}
			>
				<span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
				{showIcon && <Icon className="h-3 w-3 shrink-0" />}
				<span>{compact ? config.badgeText : info?.badgeText || config.badgeText}</span>
				{interactive && <Info className="h-2.5 w-2.5 opacity-60 ml-0.5" />}
			</button>

			{interactive && tooltipOpen && (
				<div
					role="tooltip"
					className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-popover text-popover-foreground text-xs shadow-xl border border-border z-50 animate-in fade-in-0 zoom-in-95 pointer-events-none text-left font-sans"
				>
					<p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
						<span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
						{info?.label || config.label}
					</p>
					<p className="text-muted-foreground leading-relaxed text-[11px]">
						{info?.description || config.explanation}
					</p>
					<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
				</div>
			)}
		</div>
	);
}
