"use client";

import { useState } from "react";
import { Download, FileText, Loader2, Plus, X, MoveUp, MoveDown, ShieldCheck, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MergeFile {
	id: string;
	file: File;
	name: string;
	size: number;
	pageCount: number;
	pageRange: string; // e.g. "1-3, 5" or empty for all
}

export default function PdfMerger() {
	const [files, setFiles] = useState<MergeFile[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		const validFiles: MergeFile[] = [];

		setIsProcessing(true);
		try {
			const { PDFDocument } = await import("pdf-lib");

			for (const file of selectedFiles) {
				if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
					let pageCount = 0;
					try {
						const fileBuffer = await file.arrayBuffer();
						const doc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
						pageCount = doc.getPageCount();
					} catch (err) {
						console.error("Failed to load PDF pages count for file:", file.name, err);
					}

					validFiles.push({
						id: Math.random().toString(36).substring(2, 9),
						file,
						name: file.name,
						size: file.size,
						pageCount,
						pageRange: "",
					});
				}
			}

			if (validFiles.length > 0) {
				setFiles((prev) => [...prev, ...validFiles]);
				setDownloadUrl(null);
				toast.success(`${validFiles.length} PDF files added.`);
			} else if (selectedFiles.length > 0) {
				toast.error("Please upload valid PDF files.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to load PDF editing engine.");
		} finally {
			setIsProcessing(false);
			e.target.value = ""; // Reset input
		}
	};

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id));
		setDownloadUrl(null);
	};

	const moveFile = (index: number, direction: number) => {
		const newFiles = [...files];
		if (direction === -1 && index > 0) {
			[newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
		} else if (direction === 1 && index < newFiles.length - 1) {
			[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
		}
		setFiles(newFiles);
		setDownloadUrl(null);
	};

	const handleRangeChange = (id: string, range: string) => {
		setFiles((prev) =>
			prev.map((f) => (f.id === id ? { ...f, pageRange: range } : f))
		);
		setDownloadUrl(null);
	};

	const mergePdfs = async () => {
		if (files.length < 2) {
			toast.error("Please add at least 2 PDF files to merge.");
			return;
		}

		setIsProcessing(true);
		try {
			const { PDFDocument } = await import("pdf-lib");
			const mergedPdf = await PDFDocument.create();

			for (const fileObj of files) {
				const fileBuffer = await fileObj.file.arrayBuffer();
				const pdf = await PDFDocument.load(fileBuffer);
				const totalPages = pdf.getPageCount();

				let pagesToKeep: number[] = [];

				if (fileObj.pageRange.trim()) {
					// Parse custom page range (e.g. "1-3, 5")
					const parts = fileObj.pageRange.split(",");
					for (const part of parts) {
						const trimmed = part.trim();
						if (trimmed.includes("-")) {
							const [start, end] = trimmed.split("-").map((num) => parseInt(num, 10));
							if (!Number.isNaN(start) && !Number.isNaN(end)) {
								for (let i = start; i <= end; i++) {
									if (i >= 1 && i <= totalPages) {
										pagesToKeep.push(i - 1); // 0-indexed
									}
								}
							}
						} else {
							const pageNum = parseInt(trimmed, 10);
							if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
								pagesToKeep.push(pageNum - 1);
							}
						}
					}
				} else {
					// Keep all pages
					pagesToKeep = Array.from({ length: totalPages }, (_, i) => i);
				}

				if (pagesToKeep.length > 0) {
					// Deduplicate pages keeping order
					const uniquePages = Array.from(new Set(pagesToKeep));
					const copiedPages = await mergedPdf.copyPages(pdf, uniquePages);
					copiedPages.forEach((page) => mergedPdf.addPage(page));
				}
			}

			const pdfBytes = await mergedPdf.save();
			const blob = new Blob([pdfBytes], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			setDownloadUrl(url);
			toast.success("PDF files merged successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to merge PDFs. One of the documents may be password protected or corrupted.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-8">
			{/* Privacy Warning */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Client-Side Sandbox: Your documents are merged locally in browser memory. No data is sent to external servers.</span>
			</div>

			<Card className="p-8 space-y-6">
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<Label className="text-base font-bold flex items-center gap-2">
							<FileText className="h-4.5 w-4.5 text-primary" />
							PDF Files to Merge ({files.length})
						</Label>
						<div className="relative">
							<input
								id="add-more"
								type="file"
								accept=".pdf"
								multiple
								onChange={handleFileChange}
								className="absolute inset-0 opacity-0 cursor-pointer"
							/>
							<Button variant="outline" size="sm" className="gap-2 pointer-events-none text-xs font-bold border-primary text-primary hover:bg-primary/5">
								<Plus className="w-4 h-4" /> Add Files
							</Button>
						</div>
					</div>

					{files.length === 0 ? (
						<div className="border-2 border-dashed border-border/40 hover:border-primary/40 bg-card/25 rounded-2xl p-8 transition-all cursor-pointer relative text-center">
							<input
								id="pdf-upload"
								type="file"
								accept=".pdf"
								multiple
								onChange={handleFileChange}
								className="absolute inset-0 opacity-0 cursor-pointer"
							/>
							<div className="flex flex-col items-center gap-3 text-muted-foreground">
								<FileText className="w-12 h-12 text-muted-foreground/60" />
								<span className="text-sm font-semibold">Click to select PDF files to merge</span>
								<span className="text-xs text-muted-foreground/50">Supports uploading multiple PDFs at once</span>
							</div>
						</div>
					) : (
						<div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
							{files.map((fileObj, index) => (
								<div
									key={fileObj.id}
									className="flex flex-col gap-3 p-4 border border-border/30 bg-background/40 hover:bg-background/80 rounded-xl transition-all"
								>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-2 overflow-hidden">
											<span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg shrink-0">
												{index + 1}
											</span>
											<span className="truncate font-bold text-foreground text-sm" title={fileObj.name}>
												{fileObj.name}
											</span>
											<span className="text-xs text-muted-foreground shrink-0">
												({(fileObj.size / 1024 / 1024).toFixed(2)} MB — {fileObj.pageCount} pages)
											</span>
										</div>
										<div className="flex items-center gap-1 shrink-0">
											<Button
												onClick={() => moveFile(index, -1)}
												disabled={index === 0}
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground hover:text-foreground"
											>
												<MoveUp className="w-4 h-4" />
											</Button>
											<Button
												onClick={() => moveFile(index, 1)}
												disabled={index === files.length - 1}
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground hover:text-foreground"
											>
												<MoveDown className="w-4 h-4" />
											</Button>
											<Button
												onClick={() => removeFile(fileObj.id)}
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</div>

									{/* Custom page range row */}
									<div className="flex items-center gap-2 pl-8 pt-1 border-t border-border/10">
										<Settings className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
										<Label htmlFor={`range-${fileObj.id}`} className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">
											Page Range:
										</Label>
										<Input
											id={`range-${fileObj.id}`}
											type="text"
											placeholder="All pages (e.g. 1-3, 5)"
											value={fileObj.pageRange}
											onChange={(e) => handleRangeChange(fileObj.id, e.target.value)}
											className="h-7 text-xs bg-muted/20 border-border/30 rounded-lg max-w-[200px]"
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<Button
					onClick={mergePdfs}
					disabled={files.length < 2 || isProcessing}
					className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/95 text-white"
				>
					{isProcessing ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
							Merging Documents...
						</>
					) : (
						<>
							<Plus className="w-5 h-5 mr-2" /> Merge PDFs
						</>
					)}
				</Button>

				{downloadUrl && (
					<div className="pt-6 border-t border-border/30 space-y-4 animate-in">
						<Label className="text-base font-bold block">2. Download Merged File</Label>
						<Button
							asChild
							variant="outline"
							className="w-full h-12 text-base font-bold border-primary text-primary hover:bg-primary/10"
						>
							<a href={downloadUrl} download="merged-document.pdf">
								<Download className="w-5 h-5 mr-2" /> Download Merged PDF
							</a>
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
}
