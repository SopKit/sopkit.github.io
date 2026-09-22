"use client";

import * as React from "react";
import { Upload, ClipboardPaste } from "lucide-react";
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
	/** Enable global paste listener for files/images */
	enablePaste?: boolean;
}

/**
 * The one canonical file-upload zone for all tools. Keyboard accessible
 * (Enter/Space opens the picker), supports drag-and-drop with a visible
 * active state, clipboard paste (Cmd+V), and announces itself to screen readers.
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
	enablePaste = true,
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

	// Clipboard Paste Support (Cmd+V / Ctrl+V)
	React.useEffect(() => {
		if (!enablePaste || disabled) return;

		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			const pastedFiles: File[] = [];
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.kind === "file") {
					const file = item.getAsFile();
					if (file) pastedFiles.push(file);
				}
			}

			if (pastedFiles.length > 0) {
				onFiles(multiple ? pastedFiles : pastedFiles.slice(0, 1));
			}
		};

		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [enablePaste, disabled, multiple, onFiles]);

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
				{icon ?? <Upload className="h-7 w-7 text-foreground" />}
			</div>
			<div className="space-y-1.5">
				<p className={DS.dropzone.title}>{title}</p>
				{subtitle ? (
					<p className={DS.dropzone.subtitle}>{subtitle}</p>
				) : null}
				{enablePaste && !disabled && (
					<p className="text-[11px] font-mono text-muted-foreground/70 inline-flex items-center gap-1 pt-1">
						<ClipboardPaste className="h-3 w-3 inline" />
						<span>or paste from clipboard (Ctrl / ⌘+V)</span>
					</p>
				)}
			</div>
		</div>
	);
}
