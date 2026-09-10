"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "./tokens";

interface ToolDropzoneProps {
	/** Main CTA line, e.g. "Click or drag your image here". */
	title: string;
	/** Supporting line, e.g. "Supports JPG, PNG, WebP". */
	subtitle?: string;
	/** Accepted MIME types / extensions for the file picker. */
	accept?: string;
	/** Allow selecting multiple files. */
	multiple?: boolean;
	/** Called with the chosen or dropped files. */
	onFiles: (files: File[]) => void;
	/** Optional leading icon (defaults to Upload). */
	icon?: React.ReactNode;
	/** Disable interaction (e.g. while processing). */
	disabled?: boolean;
	className?: string;
}

/**
 * The one canonical file-upload zone for all tools. Keyboard accessible
 * (Enter/Space opens the picker), supports drag-and-drop with a visible
 * active state, and announces itself to screen readers.
 */
export function ToolDropzone({
	title,
	subtitle,
	accept,
	multiple = false,
	onFiles,
	icon,
	disabled = false,
	className,
}: ToolDropzoneProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = React.useState(false);

	const openPicker = React.useCallback(() => {
		if (!disabled) inputRef.current?.click();
	}, [disabled]);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openPicker();
		}
	};

	return (
		<div
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-label={`${title}${subtitle ? `. ${subtitle}` : ""}`}
			aria-disabled={disabled}
			onClick={openPicker}
			onKeyDown={handleKeyDown}
			onDragOver={(event) => {
				event.preventDefault();
				if (!disabled) setDragging(true);
			}}
			onDragLeave={() => setDragging(false)}
			onDrop={(event) => {
				event.preventDefault();
				setDragging(false);
				if (disabled) return;
				const files = Array.from(event.dataTransfer.files);
				if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
			}}
			className={cn(
				DS.dropzone.base,
				dragging && DS.dropzone.active,
				disabled && "opacity-60 pointer-events-none",
				className,
			)}
		>
			<input
				type="file"
				ref={inputRef}
				onChange={(event) => {
					const files = Array.from(event.target.files ?? []);
					if (files.length > 0) onFiles(files);
					// Allow re-selecting the same file twice in a row.
					event.target.value = "";
				}}
				accept={accept}
				multiple={multiple}
				className="hidden"
				tabIndex={-1}
			/>
			<div className={DS.dropzone.iconChip}>
				{icon ?? <Upload className="h-8 w-8" />}
			</div>
			<div className="space-y-2">
				<p className={DS.dropzone.title}>{title}</p>
				{subtitle ? (
					<p className={DS.dropzone.subtitle}>{subtitle}</p>
				) : null}
			</div>
		</div>
	);
}
