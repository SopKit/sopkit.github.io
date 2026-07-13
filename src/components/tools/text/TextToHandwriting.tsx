"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Sliders, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function TextToHandwriting() {
	const [text, setText] = useState("Dear Reader,\n\nThis is a live preview of the text to handwriting converter. You can change the paper style (lined, grid, or plain), choose the font style, ink color, line spacing, and download this handwritten sheet directly as a high-quality PNG image.\n\nBest regards,\nSopKit Team");
	const [paperStyle, setPaperStyle] = useState("lined"); // "lined", "grid", "plain"
	const [inkColor, setInkColor] = useState("blue"); // "blue", "black", "red"
	const [fontSize, setFontSize] = useState([20]);
	const [lineHeight, setLineHeight] = useState([30]);
	const [fontFamily, setFontFamily] = useState("Caveat, cursive");

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const inkHexMap: Record<string, string> = {
		blue: "#1d4ed8",
		black: "#111827",
		red: "#dc2626",
	};

	const drawCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = 800;
		const height = 1000;
		canvas.width = width;
		canvas.height = height;

		// 1. Draw Paper Background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, width, height);

		if (paperStyle === "lined") {
			ctx.strokeStyle = "#e2e8f0";
			ctx.lineWidth = 1;
			const gap = lineHeight[0];
			for (let y = 100; y < height; y += gap) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
			// Left Margin Line
			ctx.strokeStyle = "#fca5a5";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(120, 0);
			ctx.lineTo(120, height);
			ctx.stroke();
		} else if (paperStyle === "grid") {
			ctx.strokeStyle = "#f1f5f9";
			ctx.lineWidth = 1;
			const gap = 30;
			// Horizontal grid lines
			for (let y = 0; y < height; y += gap) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
			// Vertical grid lines
			for (let x = 0; x < width; x += gap) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
		}

		// 2. Render Handwriting Text
		ctx.font = `${fontSize[0]}px ${fontFamily}`;
		ctx.fillStyle = inkHexMap[inkColor] || "#1d4ed8";
		ctx.textBaseline = "bottom";

		const lines = text.split("\n");
		const startX = paperStyle === "lined" ? 140 : 40;
		const startY = 100;
		const stepY = lineHeight[0];

		let currentY = startY;
		const maxWidth = width - startX - 40;

		lines.forEach((line) => {
			const words = line.split(" ");
			let currentLine = "";

			words.forEach((word) => {
				const testLine = currentLine ? `${currentLine} ${word}` : word;
				const metrics = ctx.measureText(testLine);
				
				if (metrics.width > maxWidth && currentLine) {
					ctx.fillText(currentLine, startX, currentY);
					currentY += stepY;
					currentLine = word;
				} else {
					currentLine = testLine;
				}
			});

			if (currentLine) {
				ctx.fillText(currentLine, startX, currentY);
				currentY += stepY;
			}
		});
	};

	useEffect(() => {
		// Import the web fonts dynamically
		const link = document.createElement("link");
		link.href = "https://fonts.googleapis.com/css2?family=Caveat&family=Sacramento&family=Shadows+Into+Light&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		link.onload = () => {
			drawCanvas();
		};

		// Draw initially and on input change
		drawCanvas();

		return () => {
			document.head.removeChild(link);
		};
	}, [text, paperStyle, inkColor, fontSize, lineHeight, fontFamily]);

	const downloadImage = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const link = document.createElement("a");
		link.download = "handwritten_sopkit.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Left Column Settings */}
			<div className="lg:col-span-5 space-y-4">
				<Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
					<CardContent className="p-5 space-y-5">
						<div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
							<Sliders className="h-4 w-4" />
							<span>Canvas Settings</span>
						</div>

						<div className="space-y-3">
							<Label htmlFor="paper-style">Paper Style</Label>
							<Select value={paperStyle} onValueChange={setPaperStyle}>
								<SelectTrigger id="paper-style" className="h-10 bg-background/50 border-border/40">
									<SelectValue placeholder="Select Paper Style" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="lined">Lined Notebook Paper</SelectItem>
									<SelectItem value="grid">Grid Sheet Paper</SelectItem>
									<SelectItem value="plain">Plain White Paper</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label htmlFor="font-family">Handwriting Font</Label>
							<Select value={fontFamily} onValueChange={setFontFamily}>
								<SelectTrigger id="font-family" className="h-10 bg-background/50 border-border/40">
									<SelectValue placeholder="Select Handwriting Style" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Caveat, cursive">Caveat (Messy Cursive)</SelectItem>
									<SelectItem value="Sacramento, cursive">Sacramento (Elegant Script)</SelectItem>
									<SelectItem value="Shadows Into Light, cursive">Shadows Into Light (Printed Handwriting)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<Label htmlFor="ink-color">Ink Color</Label>
							<Select value={inkColor} onValueChange={setInkColor}>
								<SelectTrigger id="ink-color" className="h-10 bg-background/50 border-border/40">
									<SelectValue placeholder="Select Ink Color" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="blue">Blue Gel Pen</SelectItem>
									<SelectItem value="black">Black Ballpoint Pen</SelectItem>
									<SelectItem value="red">Red Sign Pen</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between">
								<Label htmlFor="font-size">Font Size ({fontSize[0]}px)</Label>
							</div>
							<Slider
								id="font-size"
								value={fontSize}
								onValueChange={setFontSize}
								min={14}
								max={40}
								step={1}
								className="py-2"
							/>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between">
								<Label htmlFor="line-height">Line Spacing ({lineHeight[0]}px)</Label>
							</div>
							<Slider
								id="line-height"
								value={lineHeight}
								onValueChange={setLineHeight}
								min={24}
								max={60}
								step={1}
								className="py-2"
							/>
						</div>

						<div className="space-y-2 pt-2 border-t border-border/40">
							<Label htmlFor="handwritten-textarea">Enter Text Content</Label>
							<Textarea
								id="handwritten-textarea"
								value={text}
								onChange={(e) => setText(e.target.value)}
								rows={6}
								className="bg-background/50 border-border/40 text-sm focus-visible:ring-primary/20 resize-none font-sans"
							/>
						</div>

						<Button
							onClick={downloadImage}
							className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
						>
							<Download className="h-5 w-5" />
							Download PNG Image
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Right Column Canvas Preview */}
			<div className="lg:col-span-7 space-y-4">
				<Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-xl min-h-[400px] flex flex-col justify-between overflow-hidden">
					<CardContent className="p-4 flex flex-col items-center justify-center">
						<div className="w-full text-center mb-2">
							<span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 justify-center">
								<Shield className="h-3.5 w-3.5 text-emerald-500" />
								Processed entirely in your browser sandbox
							</span>
						</div>
						<div className="border border-border/40 rounded-lg overflow-hidden shadow-md max-w-full max-h-[700px] overflow-y-auto bg-white">
							<canvas ref={canvasRef} className="max-w-full block h-auto" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
