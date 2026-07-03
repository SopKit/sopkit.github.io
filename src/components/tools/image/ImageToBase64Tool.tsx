"use client";

import React, { useState } from "react";
import { 
	ImageIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	FileTextIcon,
	UploadIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function ImageToBase64Tool() {
	const [base64, setBase64] = useState("");
	const [imageType, setImageType] = useState("");
	const [copiedType, setCopiedType] = useState("");
	const [stats, setStats] = useState({ size: 0, charCount: 0 });

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please upload a valid image file.");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			setBase64(result);
			setImageType(file.type);
			setStats({
				size: file.size,
				charCount: result.length
			});
			toast.success("Image successfully converted to Base64!");
		};
		reader.onerror = () => {
			toast.error("Failed to read the image file.");
		};
		reader.readAsDataURL(file);
	};

	const getSnippet = (format: string) => {
		if (!base64) return "";
		switch (format) {
			case "raw":
				// Strips prefix "data:image/png;base64,"
				return base64.split(",")[1] || base64;
			case "datauri":
				return base64;
			case "html":
				return `<img src="${base64}" alt="Base64 Image" />`;
			case "css":
				return `background-image: url("${base64}");`;
			default:
				return base64;
		}
	};

	const copySnippet = (format: string) => {
		const content = getSnippet(format);
		if (!content) return;

		navigator.clipboard.writeText(content);
		setCopiedType(format);
		toast.success(`Copied ${format.toUpperCase()} format!`);
		setTimeout(() => setCopiedType(""), 2000);
	};

	const formatSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="space-y-6">
			{stats.size > 0 && (
				<div className="grid grid-cols-2 gap-4">
					<GlassCard className="p-4 text-center">
						<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Original File Size</span>
						<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{formatSize(stats.size)}</p>
					</GlassCard>
					<GlassCard className="p-4 text-center">
						<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Base64 Length</span>
						<p className="text-lg md:text-2xl font-black mt-1 text-primary">{stats.charCount.toLocaleString()} chars</p>
					</GlassCard>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Upload Panel */}
				<GlassCard className="p-4 flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<ImageIcon className="h-4 w-4" />
							<span>Upload Image</span>
						</div>
						{base64 && (
							<Button 
								variant="ghost" 
								size="icon" 
								onClick={() => {
									setBase64("");
									setStats({ size: 0, charCount: 0 });
									setImageType("");
								}}
								className="h-8 w-8 text-muted-foreground hover:text-destructive"
							>
								<TrashIcon className="h-4 w-4" />
							</Button>
						)}
					</div>

					<div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-2xl p-6 bg-muted/20 relative group hover:border-primary/30 transition-all min-h-[220px]">
						{base64 ? (
							<img 
								src={base64} 
								alt="Base64 Preview" 
								className="max-h-[240px] max-w-full rounded-lg object-contain shadow-sm"
							/>
						) : (
							<div className="text-center space-y-3">
								<UploadIcon className="h-8 w-8 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
								<div>
									<p className="text-sm font-semibold text-foreground">Click to upload or drag & drop</p>
									<p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, GIF, WebP, SVG (Max 5MB)</p>
								</div>
							</div>
						)}
						<input 
							type="file" 
							accept="image/*" 
							onChange={handleFileChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
					</div>
				</GlassCard>

				{/* Snippets Panel */}
				<GlassCard className="p-4 flex flex-col space-y-4">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<FileTextIcon className="h-4 w-4 text-primary" />
						<span>Base64 Embed Code Snippets</span>
					</div>

					<div className="space-y-4">
						{/* Data URI */}
						<div className="space-y-1.5">
							<div className="flex justify-between items-center text-xs">
								<span className="font-bold text-muted-foreground">Data URI Format</span>
								<Button 
									size="sm" 
									variant="ghost" 
									onClick={() => copySnippet("datauri")} 
									disabled={!base64}
									className="h-7 gap-1"
								>
									{copiedType === "datauri" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
									Copy
								</Button>
							</div>
							<textarea 
								readOnly
								value={getSnippet("datauri")}
								className="w-full h-14 p-2 bg-muted/20 border border-border/20 rounded-xl font-mono text-[10px] resize-none"
								placeholder="Upload an image to see code snippet..."
							/>
						</div>

						{/* HTML Image Tag */}
						<div className="space-y-1.5">
							<div className="flex justify-between items-center text-xs">
								<span className="font-bold text-muted-foreground">HTML Image Tag</span>
								<Button 
									size="sm" 
									variant="ghost" 
									onClick={() => copySnippet("html")} 
									disabled={!base64}
									className="h-7 gap-1"
								>
									{copiedType === "html" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
									Copy
								</Button>
							</div>
							<textarea 
								readOnly
								value={getSnippet("html")}
								className="w-full h-14 p-2 bg-muted/20 border border-border/20 rounded-xl font-mono text-[10px] resize-none"
								placeholder="Upload an image to see code snippet..."
							/>
						</div>

						{/* CSS Background */}
						<div className="space-y-1.5">
							<div className="flex justify-between items-center text-xs">
								<span className="font-bold text-muted-foreground">CSS Background Image</span>
								<Button 
									size="sm" 
									variant="ghost" 
									onClick={() => copySnippet("css")} 
									disabled={!base64}
									className="h-7 gap-1"
								>
									{copiedType === "css" ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" /> : <CopyIcon className="h-3.5 w-3.5" />}
									Copy
								</Button>
							</div>
							<textarea 
								readOnly
								value={getSnippet("css")}
								className="w-full h-14 p-2 bg-muted/20 border border-border/20 rounded-xl font-mono text-[10px] resize-none"
								placeholder="Upload an image to see code snippet..."
							/>
						</div>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
