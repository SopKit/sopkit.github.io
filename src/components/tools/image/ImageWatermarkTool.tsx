"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
	TypeIcon, 
	UploadIcon, 
	DownloadIcon, 
	Settings2Icon, 
	EyeIcon,
	FileImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function ImageWatermarkTool() {
	const [imageSrc, setImageSrc] = useState<string>("");
	const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
	const [watermarkText, setWatermarkText] = useState("SopKit");
	const [watermarkImgSrc, setWatermarkImgSrc] = useState<string>("");
	const [opacity, setOpacity] = useState(40); // 0-100
	const [size, setSize] = useState(30); // scale percentage or font size
	const [position, setPosition] = useState("center"); // center, top-left, top-right, bottom-left, bottom-right, tile
	const [textColor, setTextColor] = useState("#ffffff");

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mainImgRef = useRef<HTMLImageElement | null>(null);
	const wmImgRef = useRef<HTMLImageElement | null>(null);

	const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			setImageSrc(reader.result as string);
			toast.success("Main image loaded successfully!");
		};
		reader.readAsDataURL(file);
	};

	const handleWmImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			setWatermarkImgSrc(reader.result as string);
			toast.success("Watermark image loaded!");
		};
		reader.readAsDataURL(file);
	};

	// Draw watermark on preview canvas
	const drawWatermark = () => {
		const canvas = canvasRef.current;
		if (!canvas || !imageSrc || !mainImgRef.current) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const img = mainImgRef.current;
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;

		// Draw base image
		ctx.drawImage(img, 0, 0);

		// Configure opacity
		ctx.globalAlpha = opacity / 100;

		if (watermarkType === "text") {
			// Configure text settings
			const fontSize = Math.round((canvas.width * size) / 600);
			ctx.font = `bold ${fontSize}px sans-serif`;
			ctx.fillStyle = textColor;
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";

			const metrics = ctx.measureText(watermarkText);
			const textWidth = metrics.width;
			const textHeight = fontSize;

			const margin = canvas.width * 0.05;

			if (position === "center") {
				ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
			} else if (position === "top-left") {
				ctx.textAlign = "left";
				ctx.fillText(watermarkText, margin, margin + textHeight / 2);
			} else if (position === "top-right") {
				ctx.textAlign = "right";
				ctx.fillText(watermarkText, canvas.width - margin, margin + textHeight / 2);
			} else if (position === "bottom-left") {
				ctx.textAlign = "left";
				ctx.fillText(watermarkText, margin, canvas.height - margin - textHeight / 2);
			} else if (position === "bottom-right") {
				ctx.textAlign = "right";
				ctx.fillText(watermarkText, canvas.width - margin, canvas.height - margin - textHeight / 2);
			} else if (position === "tile") {
				ctx.textAlign = "left";
				const stepX = textWidth * 2;
				const stepY = textHeight * 3;
				for (let x = 0; x < canvas.width + stepX; x += stepX) {
					for (let y = 0; y < canvas.height + stepY; y += stepY) {
						ctx.save();
						ctx.translate(x, y);
						ctx.rotate(-Math.PI / 6); // slanted pattern
						ctx.fillText(watermarkText, 0, 0);
						ctx.restore();
					}
				}
			}
		} else if (watermarkType === "image" && wmImgRef.current) {
			const wmImg = wmImgRef.current;
			// Scale watermark image proportional to canvas
			const baseScale = (canvas.width * (size / 100)) / wmImg.naturalWidth;
			const wmWidth = wmImg.naturalWidth * baseScale;
			const wmHeight = wmImg.naturalHeight * baseScale;

			const margin = canvas.width * 0.05;

			if (position === "center") {
				ctx.drawImage(wmImg, (canvas.width - wmWidth) / 2, (canvas.height - wmHeight) / 2, wmWidth, wmHeight);
			} else if (position === "top-left") {
				ctx.drawImage(wmImg, margin, margin, wmWidth, wmHeight);
			} else if (position === "top-right") {
				ctx.drawImage(wmImg, canvas.width - wmWidth - margin, margin, wmWidth, wmHeight);
			} else if (position === "bottom-left") {
				ctx.drawImage(wmImg, margin, canvas.height - wmHeight - margin, wmWidth, wmHeight);
			} else if (position === "bottom-right") {
				ctx.drawImage(wmImg, canvas.width - wmWidth - margin, canvas.height - wmHeight - margin, wmWidth, wmHeight);
			} else if (position === "tile") {
				const stepX = wmWidth * 2;
				const stepY = wmHeight * 2;
				for (let x = 0; x < canvas.width; x += stepX) {
					for (let y = 0; y < canvas.height; y += stepY) {
						ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
					}
				}
			}
		}

		ctx.globalAlpha = 1.0; // Reset
	};

	useEffect(() => {
		if (imageSrc) {
			const img = new Image();
			img.onload = () => {
				mainImgRef.current = img;
				drawWatermark();
			};
			img.src = imageSrc;
		}
	}, [imageSrc, watermarkType, watermarkText, watermarkImgSrc, opacity, size, position, textColor]);

	const handleWmImageLoad = () => {
		if (watermarkImgSrc) {
			const img = new Image();
			img.onload = () => {
				wmImgRef.current = img;
				drawWatermark();
			};
			img.src = watermarkImgSrc;
		}
	};

	useEffect(() => {
		handleWmImageLoad();
	}, [watermarkImgSrc]);

	const handleDownload = () => {
		const canvas = canvasRef.current;
		if (!canvas || !imageSrc) return;

		const link = document.createElement("a");
		link.download = "watermarked-image.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
		toast.success("Watermarked image downloaded!");
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Settings Controls */}
				<GlassCard className="p-6 space-y-6">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<Settings2Icon className="h-4 w-4" />
						<span>Watermark Settings</span>
					</div>

					<div className="space-y-4">
						{/* Step 1: Base Image */}
						<div className="space-y-2">
							<span className="text-xs font-bold text-muted-foreground">1. Upload Image to Protect</span>
							<Button variant="outline" className="relative cursor-pointer w-full">
								<UploadIcon className="h-4 w-4 mr-2" />
								{imageSrc ? "Change Image" : "Upload Main Image"}
								<input 
									type="file" 
									accept="image/*" 
									onChange={handleMainImageChange}
									className="absolute inset-0 opacity-0 cursor-pointer"
								/>
							</Button>
						</div>

						{imageSrc && (
							<>
								{/* Step 2: Type Selection */}
								<div className="space-y-2">
									<span className="text-xs font-bold text-muted-foreground">2. Watermark Type</span>
									<div className="flex gap-2">
										<Button 
											variant={watermarkType === "text" ? "default" : "outline"} 
											className="flex-1 font-semibold"
											onClick={() => setWatermarkType("text")}
										>
											<TypeIcon className="h-4 w-4 mr-2" /> Text
										</Button>
										<Button 
											variant={watermarkType === "image" ? "default" : "outline"} 
											className="flex-1 font-semibold"
											onClick={() => setWatermarkType("image")}
										>
											<FileImageIcon className="h-4 w-4 mr-2" /> Image Logo
										</Button>
									</div>
								</div>

								{/* Step 3: Type details */}
								{watermarkType === "text" ? (
									<div className="space-y-3">
										<div className="space-y-1">
											<span className="text-xs font-semibold text-muted-foreground">Watermark Text</span>
											<input
												type="text"
												value={watermarkText}
												onChange={(e) => setWatermarkText(e.target.value)}
												className="w-full p-2 bg-muted/40 border border-border/40 rounded-xl text-sm focus:outline-none"
											/>
										</div>
										<div className="flex gap-2 items-center">
											<span className="text-xs font-semibold text-muted-foreground">Text Color</span>
											<input
												type="color"
												value={textColor}
												onChange={(e) => setTextColor(e.target.value)}
												className="w-8 h-8 p-0.5 border-0 rounded cursor-pointer"
											/>
										</div>
									</div>
								) : (
									<div className="space-y-2">
										<span className="text-xs font-semibold text-muted-foreground">Watermark Logo Image</span>
										<Button variant="outline" className="relative cursor-pointer w-full">
											<UploadIcon className="h-4 w-4 mr-2" />
											Upload Logo / Watermark
											<input 
												type="file" 
												accept="image/*" 
												onChange={handleWmImageChange}
												className="absolute inset-0 opacity-0 cursor-pointer"
											/>
										</Button>
									</div>
								)}

								{/* Opacity */}
								<div className="space-y-2">
									<div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
										<span>Opacity</span>
										<span>{opacity}%</span>
									</div>
									<input
										type="range"
										min="10"
										max="100"
										value={opacity}
										onChange={(e) => setOpacity(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
									/>
								</div>

								{/* Size / Scale */}
								<div className="space-y-2">
									<div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
										<span>{watermarkType === "text" ? "Font Size Scale" : "Logo Size Scale"}</span>
										<span>{size}%</span>
									</div>
									<input
										type="range"
										min="5"
										max="80"
										value={size}
										onChange={(e) => setSize(Number(e.target.value))}
										className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
									/>
								</div>

								{/* Position */}
								<div className="space-y-2">
									<span className="text-xs font-bold text-muted-foreground">Placement</span>
									<div className="grid grid-cols-3 gap-2">
										{["top-left", "top-right", "center", "bottom-left", "bottom-right", "tile"].map((pos) => (
											<Button
												key={pos}
												variant={position === pos ? "default" : "outline"}
												size="sm"
												className="capitalize font-semibold text-xs h-8"
												onClick={() => setPosition(pos)}
											>
												{pos.replace("-", " ")}
											</Button>
										))}
									</div>
								</div>
							</>
						)}
					</div>

					<Button 
						onClick={handleDownload} 
						disabled={!imageSrc}
						className="w-full font-bold"
					>
						<DownloadIcon className="h-4 w-4 mr-2" />
						Download Watermarked Image
					</Button>
				</GlassCard>

				{/* Preview Canvas */}
				<GlassCard className="p-6 flex flex-col items-center justify-center min-h-[350px]">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
						<EyeIcon className="h-4 w-4" />
						<span>Live Preview</span>
					</div>

					{imageSrc ? (
						<div className="max-w-full overflow-auto max-h-[350px] border border-border/40 rounded-xl shadow-inner bg-muted/10">
							<canvas ref={canvasRef} className="max-w-full h-auto object-contain rounded" />
						</div>
					) : (
						<div className="w-60 h-60 border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-4 bg-muted/10 text-muted-foreground rounded-2xl">
							<UploadIcon className="h-8 w-8 mb-2 opacity-50" />
							<p className="text-xs font-semibold">Upload an image to see preview</p>
						</div>
					)}
				</GlassCard>
			</div>
		</div>
	);
}
