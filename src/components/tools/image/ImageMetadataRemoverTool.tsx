"use client";

import React, { useState, useRef } from "react";
import { 
	ImageIcon, 
	DownloadIcon, 
	TrashIcon, 
	ShieldCheckIcon,
	AlertTriangleIcon,
	CheckCircleIcon,
	ZapIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, PremiumDropZone } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function ImageMetadataRemoverTool() {
	const [imageSrc, setImageSrc] = useState(null);
	const [fileInfo, setFileInfo] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const [cleanBlob, setCleanBlob] = useState(null);
	const fileInputRef = useRef(null);
	const [dragActive, setDragActive] = useState(false);

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const handleFile = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file (JPG, PNG, WebP)");
			return;
		}

		setFileInfo({
			name: file.name,
			size: file.size,
			type: file.type,
		});

		const reader = new FileReader();
		reader.onload = (e) => {
			setImageSrc(e.target.result);
			setIsDone(false);
			setCleanBlob(null);
		};
		reader.readAsDataURL(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			handleFile(e.target.files[0]);
		}
	};

	const stripMetadata = async () => {
		if (!imageSrc) return;
		setIsProcessing(true);

		try {
			const img = new Image();
			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
				img.src = imageSrc;
			});

			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext("2d");
			// Draw image directly onto a clean canvas. This strips EXIF/GPS instantly.
			ctx.drawImage(img, 0, 0);

			const mimeType = fileInfo.type === "image/jpeg" ? "image/jpeg" : "image/png";
			const blob = await new Promise((resolve) => {
				canvas.toBlob(resolve, mimeType, 0.95);
			});

			setCleanBlob(blob);
			setIsDone(true);
			toast.success("All EXIF & GPS metadata successfully removed!");
		} catch (err) {
			console.error(err);
			toast.error("An error occurred during metadata removal");
		} finally {
			setIsProcessing(false);
		}
	};

	const downloadCleanImage = () => {
		if (!cleanBlob) return;
		const url = URL.createObjectURL(cleanBlob);
		const link = document.createElement("a");
		link.href = url;
		
		const ext = fileInfo.type === "image/jpeg" ? ".jpg" : ".png";
		const baseName = fileInfo.name.replace(/\.[^/.]+$/, "");
		link.download = `${baseName}_cleaned${ext}`;
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const clearAll = () => {
		setImageSrc(null);
		setFileInfo(null);
		setCleanBlob(null);
		setIsDone(false);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<section>
				<PremiumDropZone
					onDrop={handleDrop}
					onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
					onDragLeave={() => setDragActive(false)}
					onClick={() => fileInputRef.current?.click()}
					dragActive={dragActive}
					icon={ImageIcon}
					title="Drop your photo here to strip metadata"
					subtitle="Accepts JPEG, PNG, or WebP files"
				/>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>

				{fileInfo && (
					<div className="mt-8 flex justify-between items-center px-4">
						<div className="flex items-center gap-4">
							<Badge variant="secondary" className="px-4 py-1.5 text-sm rounded-full">
								Loaded: {fileInfo.name} ({formatFileSize(fileInfo.size)})
							</Badge>
						</div>
						<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
							<TrashIcon className="h-4 w-4 mr-2" />
							Remove File
						</Button>
					</div>
				)}
			</section>

			{imageSrc && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Explanation / Actions */}
					<div className="lg:col-span-7 space-y-6">
						<GlassCard className="p-8 space-y-6">
							<h3 className="text-2xl font-bold flex items-center gap-3">
								<ShieldCheckIcon className="text-emerald-500 w-6 h-6" />
								Metadata Privacy Protection
							</h3>
							
							<div className="space-y-4 text-muted-foreground leading-relaxed">
								<p>
									Modern digital cameras and smartphones save hidden metadata called <strong>EXIF records</strong> inside every photo you take. This information often includes:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Exact GPS Coordinates (where the photo was taken)</li>
									<li>Camera or smartphone brand and model</li>
									<li>Exact date and time of capture</li>
									<li>Lens descriptions and aperture settings</li>
								</ul>
								<p>
									Sharing photos online with EXIF data active raises privacy concerns. Our tool draws the photo pixels onto a clean virtual canvas, rendering a new file that has <strong>0% EXIF or tracking metadata</strong>.
								</p>
							</div>

							<div className="border border-border/40 p-4 rounded-2xl flex items-start gap-4 bg-amber-500/[0.03]">
								<AlertTriangleIcon className="text-amber-500 w-6 h-6 mt-1 flex-shrink-0" />
								<div className="text-sm space-y-1">
									<h4 className="font-bold text-foreground">100% Browser-Side Privacy</h4>
									<p className="text-muted-foreground">
										Processing happens inside your web browser. Your private photographs are never sent or stored on our servers.
									</p>
								</div>
							</div>
						</GlassCard>
					</div>

					{/* Image Preview & Output */}
					<div className="lg:col-span-5 space-y-8">
						<GlassCard className="p-8 flex flex-col items-center justify-center text-center">
							<h3 className="text-xl font-bold mb-6">Source Preview</h3>
							<div className="w-full h-48 bg-muted/20 border border-border/60 rounded-3xl overflow-hidden flex items-center justify-center p-4">
								<img 
									src={imageSrc} 
									alt="Uploaded preview" 
									className="max-w-full max-h-full object-contain rounded-xl"
								/>
							</div>
						</GlassCard>

						<GlassCard className="p-8">
							{!isDone ? (
								<Button
									onClick={stripMetadata}
									disabled={isProcessing}
									className="w-full h-20 rounded-[2rem] text-xl font-black tracking-tighter shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
								>
									{isProcessing ? "PROCESSING..." : "STRIP METADATA"}
									<ZapIcon className="w-6 h-6 fill-current" />
								</Button>
							) : (
								<div className="space-y-4">
									<div className="flex items-center justify-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl">
										<CheckCircleIcon className="w-5 h-5" />
										<span className="font-bold">Metadata Cleaned!</span>
									</div>
									<Button
										onClick={downloadCleanImage}
										className="w-full h-20 rounded-[2rem] text-xl font-black tracking-tighter bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group text-white"
									>
										DOWNLOAD CLEANED IMAGE
										<DownloadIcon className="w-6 h-6" />
									</Button>
								</div>
							)}
						</GlassCard>
					</div>
				</div>
			)}
		</div>
	);
}
