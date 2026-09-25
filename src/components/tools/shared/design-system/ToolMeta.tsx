import * as React from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

/**
 * Muted file-info strip shown under an uploaded preview
 * ("File: photo.jpg" / "Original Size: 240 KB").
 */
export function ToolFileBar({
	children,
	className,
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn(DS.fileBar, className)} {...rest}>
			{children}
		</div>
	);
}

interface ToolSectionTitleProps {
	icon?: React.ReactNode;
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

/** Small primary-colored section heading inside panels ("Resize Settings"). */
export function ToolSectionTitle({
	icon,
	title,
	subtitle,
	description,
	children,
	className,
}: ToolSectionTitleProps) {
	const desc = description ?? subtitle;
	return (
		<div className={cn("space-y-0.5", className)}>
			<div className={DS.sectionTitle}>
				{icon}
				<span>{children ?? title}</span>
			</div>
			{desc && (
				<p className="text-xs text-muted-foreground">{desc}</p>
			)}
		</div>
	);
}

interface ToolPrivacyNoteProps {
	children: React.ReactNode;
	className?: string;
}

/** One-line "processed locally, never uploaded" reassurance with shield icon. */
export function ToolPrivacyNote({ children, className }: ToolPrivacyNoteProps) {
	return (
		<span className={cn(DS.privacyNote, className)}>
			<Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
			{children}
		</span>
	);
}

interface ToolPreviewFrameProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

/** Bordered frame around uploaded-file previews and results. */
export function ToolPreviewFrame({
	children,
	className,
	...rest
}: ToolPreviewFrameProps) {
	return (
		<div className={cn(DS.previewFrame, className)} {...rest}>
			{children}
		</div>
	);
}
