"use client";

import React, { useState, useRef } from "react";
import { 
	CropIcon, 
	UploadIcon, 
	DownloadIcon, 
	ZoomInIcon, 
	MoveIcon,
	RefreshCwIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function CircularImageCropTool() {
	const [imageSrc, setImageSrc] = useState<string>("");
	const [scale, setScale] = useState<number>(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	
	const imageRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file.");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setImageSrc(reader.result as string);
			setScale(1);
			setPosition({ x: 0, y: 0 });
			toast.success("Image loaded successfully!");
		};
		reader.readAsDataURL(file);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!imageSrc) return;
		setIsDragging(true);
		setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || !imageSrc) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Touch support
	const handleTouchStart = (e: React.TouchEvent) => {
		if (!imageSrc || e.touches.length !== 1) return;
		setIsDragging(true);
		setDragStart({
			x: e.touches[0].clientX - position.x,
			y: e.touches[0].clientY - position.y
		});
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !imageSrc || e.touches.length !== 1) return;
		setPosition({
			x: e.touches[0].clientX - dragStart.x,
			y: e.touches[0].clientY - dragStart.y
		});
	};

	const handleExport = () => {
		if (!imageSrc || !imageRef.current) return;

		const canvas = document.createElement("canvas");
		const size = 400; // Target output resolution
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear with transparency
		ctx.clearRect(0, 0, size, size);

		// Draw circular clipping path
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.clip();

		// Calculate drawing dimensions based on current scale and position
		const img = imageRef.current;
		const cont = containerRef.current;
		if (!cont) return;

		const scaleFactor = size / 240; // 240px is container size in CSS

		const drawWidth = img.naturalWidth * (scale * (240 / img.width)) * scaleFactor;
		const drawHeight = img.naturalHeight * (scale * (240 / img.width)) * scaleFactor;
		const drawX = (size / 2) - (drawWidth / 2) + (position.x * scaleFactor);
		const drawY = (size / 2) - (drawHeight / 2) + (position.y * scaleFactor);

		ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

		// Export as PNG
		canvas.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "circular-profile-picture.png";
			link.click();
			toast.success("Profile picture exported successfully!");
		}, "image/png");
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Upload & Controls */}
				<GlassCard className="p-6 flex flex-col justify-between space-y-4">
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<CropIcon className="h-4 w-4" />
							<span>Crop Options</span>
						</div>

						<div className="flex items-center gap-3">
							<Button variant="outline" className="relative cursor-pointer flex-grow">
								<UploadIcon className="h-4 w-4 mr-2" />
								Upload Image
								<input 
									type="file" 
									accept="image/*" 
									onChange={handleFileChange}
									className="absolute inset-0 opacity-0 cursor-pointer"
								/>
							</Button>
							{imageSrc && (
								<Button 
									variant="ghost" 
									size="icon" 
									onClick={() => {
										setImageSrc("");
										setPosition({ x: 0, y: 0 });
										setScale(1);
									}}
								>
									<RefreshCwIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							)}
						</div>

						{imageSrc && (
							<div className="space-y-4 pt-2">
								{/* Zoom */}
								<div className="space-y-2">
									<div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
										<span className="flex items-center gap-1"><ZoomInIcon className="h-3 w-3" /> Scale / Zoom</span>
										<span>{Math.round(scale * 100)}%</span>
									</div>
									<input
										type="range"
										min="0.5"
										max="4"
										step="0.05"
										value={scale}
										onChange={(e) => setScale(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
									/>
								</div>

								{/* Info */}
								<div className="p-3 bg-muted/20 border border-border/20 rounded-xl text-xs text-muted-foreground space-y-1.5">
									<p className="flex items-center gap-1.5">
										<MoveIcon className="h-3.5 w-3.5" />
										Drag image inside circular frame to reposition
									</p>
								</div>
							</div>
						)}
					</div>

					<Button 
						onClick={handleExport} 
						disabled={!imageSrc}
						className="w-full font-bold"
					>
						<DownloadIcon className="h-4 w-4 mr-2" />
						Download Circular PNG
					</Button>
				</GlassCard>

				{/* Visual Interactive Preview */}
				<GlassCard className="p-6 flex flex-col items-center justify-center min-h-[350px]">
					<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
						Live Circular Preview
					</span>

					{imageSrc ? (
						<div 
							ref={containerRef}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleMouseUp}
							className="w-60 h-60 rounded-full border-4 border-primary/40 shadow-inner overflow-hidden relative cursor-move select-none bg-muted/40"
						>
							<img
								ref={imageRef}
								src={imageSrc}
								alt="Crop Preview"
								style={{
									transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
									transformOrigin: "center",
									transition: isDragging ? "none" : "transform 0.1s ease-out",
									maxWidth: "100%",
									height: "auto",
									position: "absolute",
									top: "calc(50% - 120px * (height / width))",
									left: 0
								}}
								className="pointer-events-none select-none"
							/>
						</div>
					) : (
						<div className="w-60 h-60 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-4 bg-muted/10 text-muted-foreground">
							<UploadIcon className="h-8 w-8 mb-2 opacity-50" />
							<p className="text-xs font-semibold">Upload an image to start crop</p>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
}
