"use client";

import {
	Brush,
	Download,
	Eraser,
	RotateCcw,
	Sparkles,
	Trash2,
	Upload,
	Image as ImageIcon,
	Crop,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GeminiWatermarkRemover() {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [imageName, setImageName] = useState<string>("gemini-image");
	const [brushSize, setBrushSize] = useState<number>(30);
	const [toolMode, setToolMode] = useState<"brush" | "eraser">("brush");
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [hasMask, setHasMask] = useState<boolean>(false);
	const [history, setHistory] = useState<ImageData[]>([]);
	const [historyIndex, setHistoryIndex] = useState<number>(-1);

	const containerRef = useRef<HTMLDivElement>(null);
	const displayCanvasRef = useRef<HTMLCanvasElement>(null);
	const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
	const offscreenMaskCanvasRef = useRef<HTMLCanvasElement>(null);

	const isDrawingRef = useRef<boolean>(false);
	const lastPosRef = useRef<{ x: number; y: number } | null>(null);
	const imageObjRef = useRef<HTMLImageElement | null>(null);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (imageSrc) {
				URL.revokeObjectURL(imageSrc);
			}
		};
	}, [imageSrc]);

	// Handle file upload
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please upload a valid image file.");
			return;
		}

		const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
		setImageName(nameWithoutExt);

		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			imageObjRef.current = img;
			setupCanvases(img);
		};
		img.src = url;
		setImageSrc(url);
		setHistory([]);
		setHistoryIndex(-1);
		setHasMask(false);
	};

	// Setup canvases
	const setupCanvases = (img: HTMLImageElement) => {
		const offscreen = offscreenCanvasRef.current;
		const offscreenMask = offscreenMaskCanvasRef.current;
		const display = displayCanvasRef.current;

		if (!offscreen || !offscreenMask || !display) return;

		// Set offscreen canvas to native image size
		offscreen.width = img.width;
		offscreen.height = img.height;
		const oCtx = offscreen.getContext("2d");
		if (oCtx) {
			oCtx.drawImage(img, 0, 0);
		}

		// Set offscreen mask to native image size
		offscreenMask.width = img.width;
		offscreenMask.height = img.height;
		const mCtx = offscreenMask.getContext("2d");
		if (mCtx) {
			mCtx.fillStyle = "black";
			mCtx.fillRect(0, 0, img.width, img.height);
		}

		// Set display canvas size responsive to container width
		updateDisplayCanvas(img);
	};

	// Update display canvas rendering
	const updateDisplayCanvas = (img: HTMLImageElement) => {
		const display = displayCanvasRef.current;
		const container = containerRef.current;
		const offscreen = offscreenCanvasRef.current;
		const offscreenMask = offscreenMaskCanvasRef.current;

		if (!display || !container || !offscreen || !offscreenMask) return;

		const containerWidth = container.clientWidth;
		const scale = Math.min(1, containerWidth / img.width);

		const displayWidth = img.width * scale;
		const displayHeight = img.height * scale;

		display.width = displayWidth;
		display.height = displayHeight;

		redrawDisplay();
	};

	// Redraw display canvas by combining original and mask overlay
	const redrawDisplay = () => {
		const display = displayCanvasRef.current;
		const offscreen = offscreenCanvasRef.current;
		const offscreenMask = offscreenMaskCanvasRef.current;

		if (!display || !offscreen || !offscreenMask) return;

		const dCtx = display.getContext("2d");
		if (!dCtx) return;

		dCtx.clearRect(0, 0, display.width, display.height);

		// Draw original image scaled down
		dCtx.drawImage(offscreen, 0, 0, display.width, display.height);

		// Overlay the mask with semi-transparent red
		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = display.width;
		tempCanvas.height = display.height;
		const tempCtx = tempCanvas.getContext("2d");
		if (tempCtx) {
			tempCtx.drawImage(offscreenMask, 0, 0, display.width, display.height);
			const imgData = tempCtx.getImageData(0, 0, display.width, display.height);
			const data = imgData.data;
			// Replace white mask regions with semi-transparent red
			for (let i = 0; i < data.length; i += 4) {
				if (data[i] > 50) { // If white mask
					data[i] = 239;     // R
					data[i + 1] = 68;  // G
					data[i + 2] = 68;  // B
					data[i + 3] = 160; // Alpha (semi-transparent)
				} else {
					data[i + 3] = 0;   // Transparent elsewhere
				}
			}
			tempCtx.putImageData(imgData, 0, 0);
			dCtx.drawImage(tempCanvas, 0, 0);
		}
	};

	// Save history state for Undo action
	const pushHistory = () => {
		const offscreen = offscreenCanvasRef.current;
		if (!offscreen) return;
		const oCtx = offscreen.getContext("2d");
		if (!oCtx) return;

		const state = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push(state);
		
		// Keep history limit to 10 states
		if (newHistory.length > 10) {
			newHistory.shift();
		}
		
		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	// Undo action
	const handleUndo = () => {
		const offscreen = offscreenCanvasRef.current;
		if (!offscreen || historyIndex <= 0) return;

		const oCtx = offscreen.getContext("2d");
		if (!oCtx) return;

		const prevState = history[historyIndex - 1];
		oCtx.putImageData(prevState, 0, 0);
		setHistoryIndex(historyIndex - 1);
		redrawDisplay();
		toast.success("Undo successful!");
	};

	// Canvas coordinate resolver
	const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		const display = displayCanvasRef.current;
		if (!display) return null;

		const rect = display.getBoundingClientRect();
		
		let clientX = 0;
		let clientY = 0;

		if ("touches" in e) {
			if (e.touches.length === 0) return null;
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	};

	// Drawing handlers
	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const pos = getMousePos(e);
		if (!pos) return;

		isDrawingRef.current = true;
		lastPosRef.current = pos;
		draw(e);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawingRef.current || !lastPosRef.current) return;
		e.preventDefault();

		const pos = getMousePos(e);
		const display = displayCanvasRef.current;
		const offscreen = offscreenCanvasRef.current;
		const offscreenMask = offscreenMaskCanvasRef.current;

		if (!pos || !display || !offscreen || !offscreenMask) return;

		const mCtx = offscreenMask.getContext("2d");
		if (!mCtx) return;

		// Calculate coordinates scaled to full image resolution
		const scaleX = offscreen.width / display.width;
		const scaleY = offscreen.height / display.height;

		const currentX = pos.x * scaleX;
		const currentY = pos.y * scaleY;
		const lastX = lastPosRef.current.x * scaleX;
		const lastY = lastPosRef.current.y * scaleY;
		const radius = brushSize * scaleX;

		// Draw mask line (White = mask, Black = unmask)
		mCtx.beginPath();
		mCtx.strokeStyle = toolMode === "brush" ? "white" : "black";
		mCtx.lineWidth = radius * 2;
		mCtx.lineCap = "round";
		mCtx.lineJoin = "round";
		mCtx.moveTo(lastX, lastY);
		mCtx.lineTo(currentX, currentY);
		mCtx.stroke();

		lastPosRef.current = pos;
		setHasMask(true);
		redrawDisplay();
	};

	const stopDrawing = () => {
		isDrawingRef.current = false;
		lastPosRef.current = null;
	};

	// Gemini preset detection mask
	const applyGeminiPreset = () => {
		const offscreenMask = offscreenMaskCanvasRef.current;
		if (!offscreenMask) return;

		const mCtx = offscreenMask.getContext("2d");
		if (!mCtx) return;

		const width = offscreenMask.width;
		const height = offscreenMask.height;

		// Clear existing mask
		mCtx.fillStyle = "black";
		mCtx.fillRect(0, 0, width, height);

		// Google Gemini watermark logo is traditionally placed in the bottom-right corner.
		// We target the bottom 12% height and bottom 15% width of the image.
		const maskW = width * 0.15;
		const maskH = height * 0.12;
		const maskX = width - maskW - (width * 0.02); // 2% margin
		const maskY = height - maskH - (height * 0.02);

		mCtx.fillStyle = "white";
		mCtx.beginPath();
		// Round corners or rect for the preset
		mCtx.roundRect ? mCtx.roundRect(maskX, maskY, maskW, maskH, 10) : mCtx.rect(maskX, maskY, maskW, maskH);
		mCtx.fill();

		setHasMask(true);
		redrawDisplay();
		toast.success("Automatically targeted Gemini watermark corner region.");
	};

	// Gemini preset smart crop
	const applyGeminiCrop = () => {
		const offscreen = offscreenCanvasRef.current;
		const display = displayCanvasRef.current;
		const imageObj = imageObjRef.current;

		if (!offscreen || !display || !imageObj) return;

		// Save current state for undo
		pushHistory();

		const width = offscreen.width;
		const height = offscreen.height;

		// Gemini watermark is at the bottom right.
		// A smart crop slices 8% off the bottom of the image to remove it completely.
		const newHeight = Math.round(height * 0.92);

		offscreen.height = newHeight;
		const oCtx = offscreen.getContext("2d");
		if (oCtx) {
			oCtx.drawImage(imageObj, 0, 0, width, height, 0, 0, width, newHeight);
		}

		// Re-initialize mask to new height
		const offscreenMask = offscreenMaskCanvasRef.current;
		if (offscreenMask) {
			offscreenMask.height = newHeight;
			const mCtx = offscreenMask.getContext("2d");
			if (mCtx) {
				mCtx.fillStyle = "black";
				mCtx.fillRect(0, 0, width, newHeight);
			}
		}

		// Update display size
		const container = containerRef.current;
		if (container) {
			const containerWidth = container.clientWidth;
			const scale = Math.min(1, containerWidth / width);
			display.width = width * scale;
			display.height = newHeight * scale;
		}

		setHasMask(false);
		redrawDisplay();
		toast.success("Cropped off bottom watermark area.");
	};

	// Clear mask
	const clearMask = () => {
		const offscreenMask = offscreenMaskCanvasRef.current;
		if (!offscreenMask) return;

		const mCtx = offscreenMask.getContext("2d");
		if (mCtx) {
			mCtx.fillStyle = "black";
			mCtx.fillRect(0, 0, offscreenMask.width, offscreenMask.height);
		}
		setHasMask(false);
		redrawDisplay();
	};

	// Local Client-Side Pixel Inpainting Algorithm
	const removeWatermark = async () => {
		const offscreen = offscreenCanvasRef.current;
		const offscreenMask = offscreenMaskCanvasRef.current;

		if (!offscreen || !offscreenMask) return;

		setIsProcessing(true);
		toast.loading("Processing client-side inpainting...", { id: "inpaint" });

		// Save state to undo stack
		pushHistory();

		// Delay briefly to allow rendering main thread to update loader
		setTimeout(() => {
			try {
				const oCtx = offscreen.getContext("2d");
				const mCtx = offscreenMask.getContext("2d");

				if (!oCtx || !mCtx) {
					toast.dismiss("inpaint");
					toast.error("Failed to initialize canvas context.");
					setIsProcessing(false);
					return;
				}

				const width = offscreen.width;
				const height = offscreen.height;

				const imgData = oCtx.getImageData(0, 0, width, height);
				const maskData = mCtx.getImageData(0, 0, width, height);

				const pixels = imgData.data;
				const maskPixels = maskData.data;

				// Inpaint algorithm: Distance-based multi-pass boundary interpolation
				const mask = new Uint8Array(width * height);
				for (let i = 0; i < mask.length; i++) {
					// White pixels (>50) in mask represent the region to fill
					mask[i] = maskPixels[i * 4] > 50 ? 1 : 0;
				}

				const tempPixels = new Uint8ClampedArray(pixels);
				let changed = true;
				let pass = 0;
				const maxPasses = 60; // Multi-pass iteration limit

				while (changed && pass < maxPasses) {
					changed = false;
					const nextMask = new Uint8Array(mask);

					for (let y = 1; y < height - 1; y++) {
						for (let x = 1; x < width - 1; x++) {
							const idx = y * width + x;
							if (mask[idx] === 1) {
								let rSum = 0, gSum = 0, bSum = 0, count = 0;

								// Check surrounding 8-connected neighbors
								const neighbors = [
									idx - width - 1, idx - width, idx - width + 1,
									idx - 1,                      idx + 1,
									idx + width - 1, idx + width, idx + width + 1
								];

								for (const nIdx of neighbors) {
									if (mask[nIdx] === 0) {
										const pIdx = nIdx * 4;
										rSum += tempPixels[pIdx];
										gSum += tempPixels[pIdx + 1];
										bSum += tempPixels[pIdx + 2];
										count++;
									}
								}

								if (count > 0) {
									const pIdx = idx * 4;
									pixels[pIdx] = Math.round(rSum / count);
									pixels[pIdx + 1] = Math.round(gSum / count);
									pixels[pIdx + 2] = Math.round(bSum / count);
									pixels[pIdx + 3] = 255;
									nextMask[idx] = 0; // Resolved
									changed = true;
								}
							}
						}
					}
					mask.set(nextMask);
					// Fast sync back to temp buffer for next wave
					for (let i = 0; i < pixels.length; i++) {
						tempPixels[i] = pixels[i];
					}
					pass++;
				}

				// Final pass: Apply a subtle Gaussian box-blur to inpainted edges for blend smoothing
				const finalPixels = new Uint8ClampedArray(pixels);
				for (let y = 2; y < height - 2; y++) {
					for (let x = 2; x < width - 2; x++) {
						const idx = y * width + x;
						// If it was originally masked, apply blend smoothing
						if (maskPixels[idx * 4] > 50) {
							let r = 0, g = 0, b = 0, k = 0;
							for (let ky = -2; ky <= 2; ky++) {
								for (let kx = -2; kx <= 2; kx++) {
									const nIdx = (y + ky) * width + (x + kx);
									const pIdx = nIdx * 4;
									r += finalPixels[pIdx];
									g += finalPixels[pIdx + 1];
									b += finalPixels[pIdx + 2];
									k++;
								}
							}
							const pIdx = idx * 4;
							pixels[pIdx] = Math.round(r / k);
							pixels[pIdx + 1] = Math.round(g / k);
							pixels[pIdx + 2] = Math.round(b / k);
						}
					}
				}

				oCtx.putImageData(imgData, 0, 0);

				// Reset the mask canvas after removal completes
				mCtx.fillStyle = "black";
				mCtx.fillRect(0, 0, width, height);

				setHasMask(false);
				redrawDisplay();
				toast.dismiss("inpaint");
				toast.success("AI Watermark removal complete!");
			} catch (err) {
				console.error(err);
				toast.dismiss("inpaint");
				toast.error("Error during inpainting calculation.");
			} finally {
				setIsProcessing(false);
			}
		}, 100);
	};

	// Download image
	const downloadImage = () => {
		const offscreen = offscreenCanvasRef.current;
		if (!offscreen) return;

		try {
			const link = document.createElement("a");
			link.download = `${imageName}-clean.png`;
			link.href = offscreen.toDataURL("image/png");
			link.click();
			toast.success("Clean watermark-free image downloaded!");
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate download link.");
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Left Column: Canvas Workspace */}
			<div className="lg:col-span-2 flex flex-col gap-4">
				<Card className="border border-border/40 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
					<CardContent className="p-4 flex flex-col items-center justify-center min-h-[400px] relative">
						{!imageSrc ? (
							<div className="flex flex-col items-center gap-4 text-center p-8 border-2 border-dashed border-border/40 hover:border-primary/40 rounded-xl transition-all cursor-pointer relative w-full">
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="absolute inset-0 opacity-0 cursor-pointer"
								/>
								<div className="p-4 bg-primary/10 rounded-full text-primary">
									<ImageIcon className="h-8 w-8" />
								</div>
								<div className="space-y-1">
									<p className="text-sm font-semibold">Click or drag image here</p>
									<p className="text-xs text-muted-foreground">Supports PNG, JPG, JPEG, WEBP up to 20MB</p>
								</div>
							</div>
						) : (
							<div className="w-full flex flex-col items-center relative">
								{/* Canvases wrapper */}
								<div
									ref={containerRef}
									className="relative border border-border/30 rounded-xl overflow-hidden shadow-inner bg-black/10 flex items-center justify-center max-w-full"
								>
									<canvas
										ref={displayCanvasRef}
										onMouseDown={startDrawing}
										onMouseMove={draw}
										onMouseUp={stopDrawing}
										onMouseLeave={stopDrawing}
										onTouchStart={startDrawing}
										onTouchMove={draw}
										onTouchEnd={stopDrawing}
										className={`max-w-full block touch-none ${
											toolMode === "brush" ? "cursor-crosshair" : "cursor-cell"
										}`}
									/>
									{/* Offscreen original canvas (hidden) */}
									<canvas ref={offscreenCanvasRef} className="hidden" />
									{/* Offscreen mask canvas (hidden) */}
									<canvas ref={offscreenMaskCanvasRef} className="hidden" />
								</div>

								{/* Mobile instructions overlay */}
								<p className="text-[11px] text-muted-foreground mt-2 text-center">
									🎨 Paint over the Google Gemini watermark to highlight it.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Right Column: Settings & Tool Controls */}
			<div className="flex flex-col gap-4">
				<Card className="border border-border/40 bg-card/40 backdrop-blur-md rounded-2xl shadow-xl">
					<div className="p-4 border-b border-border/20 flex items-center gap-2 font-semibold">
						<Sparkles className="h-4 w-4 text-primary animate-pulse" />
						<span>Gemini Remover Controls</span>
					</div>
					<CardContent className="p-4 space-y-4">
						{!imageSrc ? (
							<div className="text-center py-8 text-sm text-muted-foreground">
								Upload a Gemini AI-generated image to activate controls.
							</div>
						) : (
							<>
								{/* Preset section */}
								<div className="space-y-2">
									<label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
										Quick Auto Presets
									</label>
									<div className="grid grid-cols-2 gap-2">
										<Button
											variant="outline"
											onClick={applyGeminiPreset}
											className="h-10 text-xs font-semibold border-primary/20 hover:border-primary/50 text-foreground"
										>
											<Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
											Auto-Mask Logo
										</Button>
										<Button
											variant="outline"
											onClick={applyGeminiCrop}
											className="h-10 text-xs font-semibold border-primary/20 hover:border-primary/50 text-foreground"
										>
											<Crop className="h-3.5 w-3.5 mr-2 text-primary" />
											Smart Crop Base
										</Button>
									</div>
								</div>

								<hr className="border-border/20" />

								{/* Tools Mode Selection */}
								<div className="space-y-2">
									<label className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
										Selection Mode
									</label>
									<div className="flex gap-2">
										<Button
											variant={toolMode === "brush" ? "default" : "outline"}
											onClick={() => setToolMode("brush")}
											className="flex-1 text-xs font-semibold"
										>
											<Brush className="h-3.5 w-3.5 mr-2" />
											Highlight Brush
										</Button>
										<Button
											variant={toolMode === "eraser" ? "default" : "outline"}
											onClick={() => setToolMode("eraser")}
											className="flex-1 text-xs font-semibold"
										>
											<Eraser className="h-3.5 w-3.5 mr-2" />
											Eraser
										</Button>
									</div>
								</div>

								{/* Brush size slider */}
								<div className="space-y-2">
									<div className="flex justify-between items-center text-xs font-semibold">
										<span className="text-muted-foreground">Brush Size</span>
										<span className="text-primary font-bold">{brushSize}px</span>
									</div>
									<input
										type="range"
										min="5"
										max="100"
										value={brushSize}
										onChange={(e) => setBrushSize(parseInt(e.target.value))}
										className="w-full accent-primary bg-muted/40 h-2 rounded-lg cursor-pointer"
									/>
								</div>

								{/* Mask actions */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										disabled={!hasMask}
										onClick={clearMask}
										className="flex-1 text-xs border-destructive/20 hover:bg-destructive/10 text-destructive font-semibold"
									>
										<Trash2 className="h-3.5 w-3.5 mr-2" />
										Clear Mask
									</Button>
									<Button
										variant="outline"
										disabled={historyIndex <= 0}
										onClick={handleUndo}
										className="flex-1 text-xs font-semibold"
									>
										<RotateCcw className="h-3.5 w-3.5 mr-2" />
										Undo Action
									</Button>
								</div>

								<hr className="border-border/20" />

								{/* Run Action */}
								<Button
									disabled={!hasMask || isProcessing}
									onClick={removeWatermark}
									className="w-full h-12 font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg transition-all"
								>
									<Sparkles className="h-4 w-4 mr-2" />
									{isProcessing ? "Processing..." : "Remove Highlighted Area"}
								</Button>

								{/* Download clean image */}
								<Button
									onClick={downloadImage}
									variant="outline"
									className="w-full h-12 font-bold border-emerald-500/30 hover:bg-emerald-500/5 hover:border-emerald-500/60 text-emerald-500 rounded-xl"
								>
									<Download className="h-4 w-4 mr-2" />
									Download Clear Image
								</Button>

								<hr className="border-border/20" />

								{/* Source Input details info */}
								<div className="space-y-2">
									<label className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">
										Target File Info
									</label>
									<div className="p-3 bg-muted/20 border border-border/20 rounded-xl text-xs space-y-1">
										<p className="truncate font-semibold text-foreground">
											Name: {imageName}.png
										</p>
										<p className="text-muted-foreground">
											Native Size: {imageObjRef.current?.width || 0} x {imageObjRef.current?.height || 0} px
										</p>
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
