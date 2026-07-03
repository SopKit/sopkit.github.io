"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
	FileTextIcon, 
	EyeIcon, 
	DownloadIcon, 
	TrashIcon,
	Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

declare global {
	interface Window {
		PDFLib: any;
		html2canvas: any;
	}
}

export default function MarkdownToPdfTool() {
	const [markdown, setMarkdown] = useState(`# Document Title

This is a clean, print-ready PDF document compiled directly from **Markdown** in your browser.

## Features
- **Privacy First:** 100% local client-side conversion.
- **Strict Styling:** Custom CSS layout optimized for A4 document pages.
- **Fast:** Instant rendering and download.

### How to use
1. Edit this text in the left panel.
2. See the compiled preview update in real-time in the right panel.
3. Click the **Download PDF** button to save the file.

---

> "This tool runs entirely in your browser using local canvas buffers, guaranteeing total security for your private files."
`);

	const [html, setHtml] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [pdflib, setPdflib] = useState<any>(null);
	const previewRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Load PDF-Lib from CDN
		if (!window.PDFLib) {
			const script = document.createElement("script");
			script.src = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
			script.async = true;
			script.onload = () => setPdflib(window.PDFLib);
			script.onerror = () => {
				toast.error("Failed to load PDF library. Please refresh and check connection.");
			};
			document.head.appendChild(script);
		} else {
			setPdflib(window.PDFLib);
		}

		// Load html2canvas from CDN
		if (!window.html2canvas) {
			const script = document.createElement("script");
			script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
			script.async = true;
			script.onerror = () => {
				toast.error("Failed to load page rendering library. Please refresh.");
			};
			document.head.appendChild(script);
		}
	}, []);

	const compileMarkdown = (md: string) => {
		let rawHtml = md;

		// Escape basic HTML tags to prevent XSS
		rawHtml = rawHtml
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		// Code blocks
		rawHtml = rawHtml.replace(/```([\s\S]*?)```/g, (match, code) => {
			return `<pre style="background: #f4f4f5; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; overflow-x: auto; margin: 16px 0;"><code>${code.trim()}</code></pre>`;
		});

		// Headings
		rawHtml = rawHtml.replace(/^### (.*?)$/gm, '<h3 style="font-size: 16px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #18181b;">$1</h3>');
		rawHtml = rawHtml.replace(/^## (.*?)$/gm, '<h2 style="font-size: 20px; font-weight: 800; margin-top: 24px; margin-bottom: 12px; color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 4px;">$1</h2>');
		rawHtml = rawHtml.replace(/^# (.*?)$/gm, '<h1 style="font-size: 26px; font-weight: 900; margin-top: 28px; margin-bottom: 16px; color: #18181b; text-align: center;">$1</h1>');

		// Bold & Italic
		rawHtml = rawHtml.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
		rawHtml = rawHtml.replace(/\*(.*?)\*/g, "<em>$1</em>");

		// Inline code
		rawHtml = rawHtml.replace(/`([^`]+)`/g, '<code style="background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #2563eb;">$1</code>');

		// Blockquotes
		rawHtml = rawHtml.replace(/^> (.*?)$/gm, '<blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; font-style: italic; margin: 16px 0; color: #71717a;">$1</blockquote>');

		// Horizontal rule
		rawHtml = rawHtml.replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0;" />');

		// Lists
		rawHtml = rawHtml.replace(/^\- (.*?)$/gm, '<li style="margin-left: 20px; list-style-type: disc; margin-top: 4px; margin-bottom: 4px; color: #3f3f46;">$1</li>');
		rawHtml = rawHtml.replace(/^\* (.*?)$/gm, '<li style="margin-left: 20px; list-style-type: disc; margin-top: 4px; margin-bottom: 4px; color: #3f3f46;">$1</li>');

		// Handle paragraphs
		const lines = rawHtml.split(/\n{2,}/);
		rawHtml = lines.map(line => {
			const trimmed = line.trim();
			if (
				trimmed.startsWith("<h") || 
				trimmed.startsWith("<li") || 
				trimmed.startsWith("<pre") || 
				trimmed.startsWith("<block") ||
				trimmed.startsWith("<hr") ||
				trimmed === ""
			) {
				return line;
			}
			return `<p style="margin-top: 12px; margin-bottom: 12px; color: #3f3f46; line-height: 1.6;">${line.replace(/\n/g, "<br>")}</p>`;
		}).join("\n");

		setHtml(rawHtml);
	};

	useEffect(() => {
		compileMarkdown(markdown);
	}, [markdown]);

	const handleDownloadPdf = async () => {
		if (!pdflib || !window.html2canvas || !previewRef.current) {
			toast.error("Libraries are still loading. Please wait...");
			return;
		}

		setIsProcessing(true);
		try {
			const canvas = await window.html2canvas(previewRef.current, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: "#ffffff"
			});

			const imgData = canvas.toDataURL("image/jpeg", 0.95);
			const { PDFDocument } = pdflib;
			const pdfDoc = await PDFDocument.create();
			
			// Scale down canvas dimension to standard PDF points size (A4 / Letter scale)
			const width = canvas.width * 0.75 / 2;
			const height = canvas.height * 0.75 / 2;

			const page = pdfDoc.addPage([width, height]);
			const img = await pdfDoc.embedJpg(imgData);
			
			page.drawImage(img, {
				x: 0,
				y: 0,
				width: width,
				height: height,
			});

			const pdfBytes = await pdfDoc.save();
			const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `markdown-document-${Date.now()}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("PDF document generated and downloaded successfully!");
		} catch (err: any) {
			console.error("PDF compile error:", err);
			toast.error("Failed to generate PDF. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<FileTextIcon className="h-5 w-5 text-primary" />
					<span className="text-sm font-semibold text-muted-foreground">Markdown to PDF Converter</span>
				</div>
				<div className="flex gap-2">
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => setMarkdown("")}
						className="gap-1.5"
					>
						<TrashIcon className="h-4 w-4" />
						Clear
					</Button>
					<Button 
						size="sm" 
						onClick={handleDownloadPdf}
						disabled={isProcessing}
						className="gap-1.5 shadow-md"
					>
						{isProcessing ? (
							<Loader2Icon className="h-4 w-4 animate-spin" />
						) : (
							<DownloadIcon className="h-4 w-4" />
						)}
						{isProcessing ? "Processing..." : "Download PDF"}
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
				{/* Left Input Editor Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<span>Markdown Editor</span>
					</div>
					<textarea
						value={markdown}
						onChange={(e) => setMarkdown(e.target.value)}
						className="flex-grow w-full min-h-[400px] lg:min-h-[500px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
						placeholder="Write your markdown here..."
					/>
				</GlassCard>

				{/* Right PDF Preview Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3 overflow-hidden">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<EyeIcon className="h-4 w-4" />
						<span>Print-Ready Preview</span>
					</div>
					<div className="flex-grow overflow-auto max-h-[600px] border border-border/30 rounded-2xl bg-white p-8">
						<div 
							ref={previewRef}
							style={{ 
								fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
								color: '#27272a',
								fontSize: '14px',
								backgroundColor: '#ffffff'
							}}
							className="prose prose-zinc max-w-none text-left"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
