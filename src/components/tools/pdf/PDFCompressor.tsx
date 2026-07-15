"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Loader2, Minimize2, ShieldCheck, Settings2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PdfCompressor() {
	const [file, setFile] = useState<File | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [originalSize, setOriginalSize] = useState(0);
	const [newSize, setNewSize] = useState(0);
	const [progress, setProgress] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);

	// Compression Options
	const [preset, setPreset] = useState("recommended");
	const [quality, setQuality] = useState(0.7); // 0.1 to 1.0
	const [scale, setScale] = useState(0.75); // 0.2 to 1.0

	// Handle preset changes
	useEffect(() => {
		if (preset === "recommended") {
			setQuality(0.7);
			setScale(0.75);
		} else if (preset === "extreme") {
			setQuality(0.4);
			setScale(0.5);
		} else if (preset === "low") {
			setQuality(0.85);
			setScale(1.0);
		}
	}, [preset]);

	const loadPdfJs = async () => {
		if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
			script.onload = () => {
				const pdfjs = (window as any).pdfjsLib;
				pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
				resolve(pdfjs);
			};
			script.onerror = () => reject(new Error("Failed to load PDF.js engine."));
			document.head.appendChild(script);
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && selectedFile.type === "application/pdf") {
			setFile(selectedFile);
			setOriginalSize(selectedFile.size);
			setDownloadUrl(null);
			setNewSize(0);
			setCurrentPage(0);
			setTotalPages(0);
			setProgress(0);
		} else {
			toast.error("Please upload a valid PDF file.");
		}
	};

	const compressPdf = async () => {
		if (!file) return;

		setIsProcessing(true);
		setProgress(0);
		setCurrentPage(0);

		try {
			// 1. Lazy load pdf-lib and PDF.js script from CDN
			const [pdfLib, pdfjs] = await Promise.all([
				import("pdf-lib"),
				loadPdfJs()
			]);

			const fileBuffer = await file.arrayBuffer();

			// 2. Load PDF document in PDF.js for rendering pages to canvas
			const pdf = await (pdfjs as any).getDocument({ data: fileBuffer }).promise;
			const numPages = pdf.numPages;
			setTotalPages(numPages);

			// 3. Create a brand new PDF via pdf-lib
			const compressedPdfDoc = await pdfLib.PDFDocument.create();

			for (let i = 1; i <= numPages; i++) {
				setCurrentPage(i);
				setProgress(Math.round(((i - 1) / numPages) * 100));

				// Get the page object
				const page = await pdf.getPage(i);
				const viewport = page.getViewport({ scale });

				// Render page to a hidden canvas
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) throw new Error("Could not create 2D canvas context.");

				canvas.width = viewport.width;
				canvas.height = viewport.height;

				await page.render({
					canvasContext: ctx,
					viewport: viewport
				}).promise;

				// Convert canvas image to JPEG with specified quality compression
				const dataUrl = canvas.toDataURL("image/jpeg", quality);
				const base64 = dataUrl.split(",")[1];
				const imgBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

				// Embed JPEG and write it into the new document
				const embeddedImage = await compressedPdfDoc.embedJpg(imgBytes);
				const newPage = compressedPdfDoc.addPage([viewport.width, viewport.height]);
				newPage.drawImage(embeddedImage, {
					x: 0,
					y: 0,
					width: viewport.width,
					height: viewport.height
				});
			}

			setProgress(100);

			// 4. Save and serve the compressed PDF bytes
			const pdfBytes = await compressedPdfDoc.save();
			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);

			setDownloadUrl(url);
			setNewSize(blob.size);

			const savings = originalSize - blob.size;
			if (savings > 0) {
				toast.success(`PDF Compressed! Saved ${((savings / originalSize) * 100).toFixed(0)}% space.`);
			} else {
				toast.info("PDF processed successfully (already optimized).");
			}
		} catch (error) {
			console.error("PDF compression failure:", error);
			toast.error("Failed to compress PDF. Please verify that the document is not password-protected.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-8">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Local & Private: All PDF compression runs directly inside your browser. Your files never leave your computer.</span>
			</div>

			<Card className="p-8 space-y-6">
				<div className="space-y-4">
					<Label htmlFor="pdf-upload" className="text-base font-bold flex items-center gap-2">
						<FileText className="h-4.5 w-4.5 text-primary" />
						1. Upload PDF Document
					</Label>
					<div className="border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 rounded-2xl p-6 transition-all cursor-pointer relative text-center">
						<input
							id="pdf-upload"
							type="file"
							accept=".pdf"
							onChange={handleFileChange}
							className="absolute inset-0 opacity-0 cursor-pointer"
						/>
						{file ? (
							<div className="flex flex-col items-center gap-2 text-primary">
								<FileText className="w-10 h-10 text-primary" />
								<span className="font-bold text-foreground text-sm line-clamp-1">{file.name}</span>
								<span className="text-xs text-muted-foreground">
									Original File Size: {(originalSize / 1024 / 1024).toFixed(2)} MB
								</span>
							</div>
						) : (
							<div className="flex flex-col items-center gap-3 text-muted-foreground py-4">
								<FileText className="w-10 h-10 text-muted-foreground/60" />
								<span className="text-sm font-semibold">Click to upload or drag & drop PDF file</span>
								<span className="text-xs text-muted-foreground/50">Supports standard document PDF uploads</span>
							</div>
						)}
					</div>
				</div>

				{file && (
					<div className="space-y-5 p-4 border border-border/30 bg-background/30 rounded-xl">
						<h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
							<Settings2 className="h-3.5 w-3.5" />
							Compression Settings
						</h4>

						<div className="space-y-4">
							{/* Preset controls */}
							<div className="space-y-2">
								<label className="text-[11px] font-bold text-muted-foreground uppercase">
									Compression Preset
								</label>
								<div className="flex rounded-lg border border-border bg-background p-1 gap-1">
									{[
										{ id: "low", label: "Low (High Quality)" },
										{ id: "recommended", label: "Recommended" },
										{ id: "extreme", label: "Extreme (Lower Quality)" },
										{ id: "custom", label: "Custom Settings" },
									].map((p) => (
										<button
											key={p.id}
											type="button"
											onClick={() => setPreset(p.id)}
											className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-md transition-colors ${preset === p.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
										>
											{p.label}
										</button>
									))}
								</div>
							</div>

							{/* Sliders for custom settings */}
							{preset === "custom" && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/10 animate-in">
									{/* Quality */}
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<label className="text-[11px] font-bold text-muted-foreground uppercase">
												Image Compression
											</label>
											<span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
												{Math.round(quality * 100)}%
											</span>
										</div>
										<input
											type="range"
											min="0.1"
											max="1.0"
											step="0.05"
											value={quality}
											onChange={(e) => setQuality(parseFloat(e.target.value))}
											className="w-full accent-primary bg-muted/40 h-1.5 rounded-lg appearance-none cursor-pointer"
										/>
									</div>

									{/* Scale */}
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<label className="text-[11px] font-bold text-muted-foreground uppercase">
												Resolution Downscale
											</label>
											<span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
												{Math.round(scale * 100)}%
											</span>
										</div>
										<input
											type="range"
											min="0.2"
											max="1.0"
											step="0.05"
											value={scale}
											onChange={(e) => setScale(parseFloat(e.target.value))}
											className="w-full accent-primary bg-muted/40 h-1.5 rounded-lg appearance-none cursor-pointer"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Progress Indicator */}
				{isProcessing && (
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-bold text-muted-foreground">
							<span>Processing Page {currentPage} of {totalPages || "?"} ...</span>
							<span>{progress}%</span>
						</div>
						<div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
							<div
								className="bg-primary h-full transition-all duration-300 rounded-full"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				)}

				<Button
					onClick={compressPdf}
					disabled={!file || isProcessing}
					className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/95 text-white"
				>
					{isProcessing ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
							Compressing Page {currentPage} of {totalPages || "?"}...
						</>
					) : (
						<>
							<Minimize2 className="w-5 h-5 mr-2" />
							Compress & Optimize PDF
						</>
					)}
				</Button>

				{/* Results section */}
				{downloadUrl && (
					<div className="pt-6 border-t border-border/30 space-y-4 animate-in">
						<div className="flex items-center justify-between text-sm p-4 bg-muted/30 border border-border/30 rounded-xl">
							<span className="text-xs font-bold text-muted-foreground uppercase">Compression Results</span>
							<div className="flex items-center gap-3">
								<span className="text-sm font-semibold">
									New Size: <span className="font-bold text-foreground">{(newSize / 1024 / 1024).toFixed(2)} MB</span>
								</span>
								{newSize < originalSize ? (
									<span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-xs">
										-{((1 - newSize / originalSize) * 100).toFixed(0)}% Small
									</span>
								) : (
									<span className="text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded text-xs">
										Already Optimized
									</span>
								)}
							</div>
						</div>

						<Button
							asChild
							variant="outline"
							className="w-full h-12 text-base font-bold border-primary text-primary hover:bg-primary/10"
						>
							<a href={downloadUrl} download={`compressed-${file?.name || "document.pdf"}`}>
								<Download className="w-5 h-5 mr-2" /> Download Compressed PDF
							</a>
						</Button>
					</div>
				)}
			</Card>

			{/* Informational SEO and Content Section */}
			<div className="p-6 border border-border/30 bg-card/25 rounded-2xl space-y-4">
				<h3 className="text-base font-bold flex items-center gap-1.5 text-foreground">
					<Sparkles className="h-4.5 w-4.5 text-primary" />
					How does the PDF Compressor work?
				</h3>
				<div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
					<p>
						Large PDF documents are usually composed of high-resolution images, document attachments, and embedded fonts. 
						Our online compressor runs completely inside your browser using canvas downscaling and JPEG image density reduction. 
					</p>
					<p>
						By selecting different quality options (Recommended, Extreme, or Custom), you can choose to resize images and rebuild the PDF structure without transferring any sensitive data to external servers, making it 100% compliant with corporate security guidelines and data privacy regulations.
					</p>
				</div>
			</div>
		</div>
	);
}
