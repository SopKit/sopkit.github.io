"use client";

import { useState } from "react";
import { Download, FileText, Loader2, Scissors, ShieldCheck, Settings, Layers, List } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PdfSplitter() {
	const [file, setFile] = useState<File | null>(null);
	const [splitMode, setSplitMode] = useState<"range" | "separate" | "equal">("range");
	const [range, setRange] = useState("");
	const [equalPartSize, setEqualPartSize] = useState(1);
	const [isProcessing, setIsProcessing] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [downloadUrls, setDownloadUrls] = useState<{ name: string; url: string }[]>([]);
	const [pageCount, setPageCount] = useState(0);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"))) {
			setFile(selectedFile);
			setDownloadUrl(null);
			setDownloadUrls([]);
			setRange("");

			try {
				const { PDFDocument } = await import("pdf-lib");
				const buffer = await selectedFile.arrayBuffer();
				const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
				setPageCount(doc.getPageCount());
			} catch (err) {
				console.error("Failed to read PDF page count:", err);
				setPageCount(0);
				toast.error("Failed to parse PDF document structure.");
			}
		} else {
			toast.error("Please upload a valid PDF file.");
		}
	};

	const executeSplit = async () => {
		if (!file || pageCount === 0) return;

		setIsProcessing(true);
		setDownloadUrl(null);
		setDownloadUrls([]);

		try {
			const { PDFDocument } = await import("pdf-lib");
			const fileBuffer = await file.arrayBuffer();
			const originalDoc = await PDFDocument.load(fileBuffer);

			if (splitMode === "range") {
				if (!range.trim()) {
					toast.error("Please enter a page range.");
					setIsProcessing(false);
					return;
				}

				const newPdf = await PDFDocument.create();
				const pagesToKeep = new Set<number>();

				// Parse range: "1-5, 8, 11-13"
				const parts = range.split(",");
				for (const part of parts) {
					const trimmed = part.trim();
					if (trimmed.includes("-")) {
						const [start, end] = trimmed.split("-").map((num) => parseInt(num, 10));
						if (!Number.isNaN(start) && !Number.isNaN(end)) {
							for (let i = start; i <= end; i++) {
								if (i >= 1 && i <= pageCount) {
									pagesToKeep.add(i - 1);
								}
							}
						}
					} else {
						const pageNum = parseInt(trimmed, 10);
						if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
							pagesToKeep.add(pageNum - 1);
						}
					}
				}

				if (pagesToKeep.size === 0) {
					throw new Error("No valid pages selected within range limits.");
				}

				const sortedPages = Array.from(pagesToKeep).sort((a, b) => a - b);
				const copiedPages = await newPdf.copyPages(originalDoc, sortedPages);
				copiedPages.forEach((page) => newPdf.addPage(page));

				const pdfBytes = await newPdf.save();
				const blob = new Blob([pdfBytes], { type: "application/pdf" });
				const url = URL.createObjectURL(blob);
				setDownloadUrl(url);
				toast.success("PDF split successfully!");

			} else if (splitMode === "separate") {
				// Split into individual pages
				const urlsList: { name: string; url: string }[] = [];
				for (let i = 0; i < pageCount; i++) {
					const singlePageDoc = await PDFDocument.create();
					const [copiedPage] = await singlePageDoc.copyPages(originalDoc, [i]);
					singlePageDoc.addPage(copiedPage);

					const pdfBytes = await singlePageDoc.save();
					const blob = new Blob([pdfBytes], { type: "application/pdf" });
					const url = URL.createObjectURL(blob);
					urlsList.push({
						name: `Page ${i + 1} - ${file.name}`,
						url,
					});
				}
				setDownloadUrls(urlsList);
				toast.success(`Split into ${urlsList.length} separate documents.`);

			} else if (splitMode === "equal") {
				if (equalPartSize <= 0 || equalPartSize > pageCount) {
					toast.error(`Please select a chunk size between 1 and ${pageCount}`);
					setIsProcessing(false);
					return;
				}

				const urlsList: { name: string; url: string }[] = [];
				let startPage = 0;

				while (startPage < pageCount) {
					const chunkDoc = await PDFDocument.create();
					const endPage = Math.min(startPage + equalPartSize, pageCount);
					const pagesIndices = Array.from({ length: endPage - startPage }, (_, index) => startPage + index);

					const copiedPages = await chunkDoc.copyPages(originalDoc, pagesIndices);
					copiedPages.forEach((page) => chunkDoc.addPage(page));

					const pdfBytes = await chunkDoc.save();
					const blob = new Blob([pdfBytes], { type: "application/pdf" });
					const url = URL.createObjectURL(blob);
					urlsList.push({
						name: `Pages ${startPage + 1} to ${endPage} - ${file.name}`,
						url,
					});

					startPage = endPage;
				}

				setDownloadUrls(urlsList);
				toast.success(`Split into ${urlsList.length} equal parts.`);
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Failed to split PDF document.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-8">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Client-Side Sandbox: Your documents are split locally. No bytes are sent to any remote server.</span>
			</div>

			<Card className="p-8 space-y-6">
				{/* 1. Upload Section */}
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
									Original PDF ({pageCount > 0 ? `${pageCount} Pages` : "Reading structure..."})
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

				{/* 2. Custom Split Mode Selector */}
				{file && pageCount > 0 && (
					<div className="space-y-5 p-4 border border-border/30 bg-background/30 rounded-xl">
						<h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
							<Settings className="h-3.5 w-3.5" />
							Split Settings
						</h4>

						<div className="space-y-4">
							<div className="flex rounded-lg border border-border bg-background p-1 gap-1">
								{[
									{ id: "range", label: "Page Range", icon: Scissors },
									{ id: "separate", label: "Extract All Pages", icon: Layers },
									{ id: "equal", label: "Split Equal Parts", icon: List },
								].map((mode) => (
									<button
										key={mode.id}
										type="button"
										onClick={() => {
											setSplitMode(mode.id as any);
											setDownloadUrl(null);
											setDownloadUrls([]);
										}}
										className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-1.5 px-2 rounded-md transition-colors ${splitMode === mode.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
									>
										<mode.icon className="w-3.5 h-3.5" />
										{mode.label}
									</button>
								))}
							</div>

							{/* Conditional details */}
							{splitMode === "range" && (
								<div className="space-y-2 animate-in">
									<div className="flex justify-between items-center">
										<Label htmlFor="range-input" className="text-xs font-bold text-muted-foreground uppercase">
											Page Range to Extract
										</Label>
										<span className="text-[10px] text-muted-foreground font-mono">e.g. 1-3, 5 (Max {pageCount})</span>
									</div>
									<Input
										id="range-input"
										placeholder={`Enter range, e.g. 1-3, 5, 7-${pageCount}`}
										value={range}
										onChange={(e) => setRange(e.target.value)}
										className="bg-muted/10 border-border/30"
									/>
								</div>
							)}

							{splitMode === "equal" && (
								<div className="space-y-2 animate-in flex items-center gap-4">
									<div className="flex-1 space-y-1">
										<Label htmlFor="equal-input" className="text-xs font-bold text-muted-foreground uppercase">
											Pages per Document Part
										</Label>
										<p className="text-[10px] text-muted-foreground">Every part will contain at most this number of pages.</p>
									</div>
									<Input
										id="equal-input"
										type="number"
										min="1"
										max={pageCount}
										value={equalPartSize}
										onChange={(e) => setEqualPartSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
										className="bg-muted/10 border-border/30 max-w-[100px] text-center"
									/>
								</div>
							)}
						</div>
					</div>
				)}

				<Button
					onClick={executeSplit}
					disabled={!file || pageCount === 0 || isProcessing}
					className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/95 text-white"
				>
					{isProcessing ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
							Splitting PDF Document...
						</>
					) : (
						<>
							<Scissors className="w-5 h-5 mr-2" /> Split PDF
						</>
					)}
				</Button>

				{/* 3. Single Download Area */}
				{downloadUrl && (
					<div className="pt-6 border-t border-border/30 space-y-4 animate-in">
						<Label className="text-base font-bold block">3. Download Split PDF</Label>
						<Button
							asChild
							variant="outline"
							className="w-full h-12 text-base font-bold border-primary text-primary hover:bg-primary/10"
						>
							<a href={downloadUrl} download={`split-${file?.name || "document.pdf"}`}>
								<Download className="w-5 h-5 mr-2" /> Download Split PDF
							</a>
						</Button>
					</div>
				)}

				{/* 4. Multi-Download Area (For Separate or Equal split modes) */}
				{downloadUrls.length > 0 && (
					<div className="pt-6 border-t border-border/30 space-y-4 animate-in">
						<Label className="text-base font-bold block">3. Download Extracted Files ({downloadUrls.length})</Label>
						<div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
							{downloadUrls.map((item, index) => (
								<div key={index} className="flex items-center justify-between p-3 border border-border/30 bg-muted/10 rounded-xl text-xs">
									<span className="font-semibold text-foreground line-clamp-1 max-w-[320px]">{item.name}</span>
									<Button asChild size="sm" variant="link" className="text-primary font-bold gap-1 text-[11px]">
										<a href={item.url} download={item.name}>
											<Download className="w-3.5 h-3.5" /> Download
										</a>
									</Button>
								</div>
							))}
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
