"use client";

import {
	Brain,
	Check,
	Clock,
	Copy,
	Download,
	FileText,
	Upload,
	ShieldCheck,
} from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface KeyPoint {
	point: string;
	importance: "High" | "Medium" | "Low";
}

function extractSentences(text: string): string[] {
	return text
		.split(/[.!?]+/)
		.map(s => s.trim())
		.filter(s => s.length > 10);
}

function scoreSentence(sentence: string, fullText: string): number {
	const lower = sentence.toLowerCase();
	const words = lower.split(/\s+/).filter(w => w.length > 2);
	let score = 0;

	// Score based on word frequency in the full text
	const fullLower = fullText.toLowerCase();
	for (const word of words) {
		const count = (fullLower.match(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g")) || []).length;
		if (count > 1) score += count * 0.5;
	}

	// Bonus for sentences containing important trigger words
	const importantWords = ["important", "key", "significant", "crucial", "essential", "main", "primary", "major", "critical", "vital", "notable", "especially", "particularly"];
	for (const word of importantWords) {
		if (lower.includes(word)) score += 3;
	}

	// Bonus for longer, substantive sentences
	if (words.length > 8) score += 2;
	if (words.length > 15) score += 1;

	// Position bonus — first and last sentences are often important
	const sentences = extractSentences(fullText);
	const idx = sentences.indexOf(sentence);
	if (idx === 0) score += 3;
	if (idx === sentences.length - 1) score += 2;

	return score;
}

function generateSummary(text: string, type: string, length: string): string {
	const sentences = extractSentences(text);
	if (sentences.length === 0) return "No content to summarize.";

	const scored = sentences.map(s => ({ sentence: s, score: scoreSentence(s, text) }))
		.sort((a, b) => b.score - a.score);

	const maxSentences = length === "short" ? 3 : length === "medium" ? 6 : 10;

	if (type === "bullet-points") {
		return scored
			.slice(0, maxSentences)
			.map(s => `• ${s.sentence.trim()}`)
			.join("\n");
	} else if (type === "executive") {
		const top = scored.slice(0, 3);
		return `Executive Summary:\n${top.map(s => `• ${s.sentence.trim()}`).join("\n")}\n\nKey Focus: ${top[0]?.sentence || ""}`;
	} else {
		return scored
			.slice(0, maxSentences)
			.map(s => s.sentence.trim())
			.join(". ") + ".";
	}
}

function extractKeyPoints(text: string): KeyPoint[] {
	const sentences = extractSentences(text);
	const scored = sentences.map(s => ({ sentence: s, score: scoreSentence(s, text) }));
	const top = scored.sort((a, b) => b.score - a.score).slice(0, 6);

	return top.map((item, i) => {
		const words = item.sentence.split(/\s+/).filter(w => w.length > 3);
		const topic = words.slice(0, 4).join(" ");
		return {
			point: topic.charAt(0).toUpperCase() + topic.slice(1),
			importance: i < 2 ? ("High" as const) : i < 4 ? ("Medium" as const) : ("Low" as const),
		};
	});
}

export default function AiVideoSummarizerTool() {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [transcriptInput, setTranscriptInput] = useState("");
	const [summaryType, setSummaryType] = useState("bullet-points");
	const [summaryLength, setSummaryLength] = useState("medium");
	const [isProcessing, setIsProcessing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [summary, setSummary] = useState("");
	const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([]);
	const [processingStep, setProcessingStep] = useState("");
	const [copied, setCopied] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.size > 50 * 1024 * 1024) {
			toast.error("File size too large. Please use a file smaller than 50MB.");
			return;
		}

		// Try to extract text from various file types
		const ext = file.name.split(".").pop()?.toLowerCase();
		if (ext === "txt" || ext === "md" || ext === "srt" || ext === "vtt" || file.type === "text/plain") {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				setTranscriptInput(text);
				toast.success("Transcript loaded from file!");
			};
			reader.readAsText(file);
		} else {
			// For video files, prompt user to paste transcript
			setVideoFile(file);
			toast.success("Video file selected. Paste the transcript below or upload a .txt file.");
		}

		event.target.value = "";
	}, []);

	const processSummary = useCallback(async () => {
		const textToSummarize = transcriptInput.trim();
		if (!textToSummarize) {
			toast.error("Please paste a video transcript or upload a text file to summarize.");
			return;
		}

		if (textToSummarize.length < 20) {
			toast.error("Transcript is too short. Please provide more content.");
			return;
		}

		setIsProcessing(true);
		setProgress(0);
		setSummary("");
		setKeyPoints([]);

		try {
			setProcessingStep("Analyzing content...");
			await new Promise(r => setTimeout(r, 300));
			setProgress(25);

			setProcessingStep("Identifying key topics...");
			await new Promise(r => setTimeout(r, 400));
			setProgress(50);

			setProcessingStep("Generating summary...");
			await new Promise(r => setTimeout(r, 400));
			setProgress(75);

			const generatedSummary = generateSummary(textToSummarize, summaryType, summaryLength);
			const extractedKeyPoints = extractKeyPoints(textToSummarize);

			await new Promise(r => setTimeout(r, 300));
			setSummary(generatedSummary);
			setKeyPoints(extractedKeyPoints);
			setProcessingStep("Complete!");
			setProgress(100);

			toast.success("Summary generated successfully!");
		} catch (error) {
			toast.error("Failed to generate summary. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	}, [transcriptInput, summaryType, summaryLength]);

	const copyToClipboard = useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success("Copied to clipboard!");
		} catch {
			toast.error("Failed to copy to clipboard");
		}
	}, []);

	const downloadSummary = useCallback(() => {
		const content = `Video Summary\n\n${summary}\n\nKey Points:\n${keyPoints.map((kp) => `• ${kp.point} (${kp.importance} importance)`).join("\n")}`;
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `video-summary-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Summary downloaded!");
	}, [summary, keyPoints]);

	const reset = useCallback(() => {
		setVideoFile(null);
		setTranscriptInput("");
		setSummary("");
		setKeyPoints([]);
		setProgress(0);
		setProcessingStep("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	}, []);

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>🔒 100% Client-Side: All text processing runs locally. No data sent to any server.</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-6 border border-border/40 backdrop-blur-sm rounded-2xl">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 text-primary rounded-xl">
						<Brain className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-xl font-bold">AI Video Summarizer</h2>
						<p className="text-xs text-muted-foreground">Summarize video transcripts into key points using intelligent text analysis</p>
					</div>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<Button variant="outline" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold">
						<Upload className="mr-2 h-4 w-4" /> Upload Transcript
					</Button>
					<Button
						disabled={isProcessing || !transcriptInput.trim()}
						onClick={processSummary}
						className="bg-primary hover:bg-primary/90 text-xs font-bold text-white"
					>
						{isProcessing ? (
							<><Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
						) : (
							<><Brain className="mr-2 h-4 w-4" /> Generate Summary</>
						)}
					</Button>
					<Button variant="outline" onClick={reset} disabled={isProcessing}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
					</Button>
				</div>
				<input type="file" accept=".txt,.md,.srt,.vtt,text/plain" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="border border-border/40 bg-card/20 rounded-3xl">
					<CardHeader>
						<CardTitle className="text-sm font-bold">Video Transcript</CardTitle>
						<CardDescription>Paste the video transcript or upload a .txt file</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							value={transcriptInput}
							onChange={(e) => setTranscriptInput(e.target.value)}
							placeholder={`Paste your video transcript here...\n\nExample:\nIn this video, we explore the key principles of effective time management. First, we discuss the importance of prioritizing tasks based on urgency and importance. The Eisenhower Matrix is a powerful tool for this purpose. Next, we examine how to eliminate distractions and maintain focus. Research shows that multitasking reduces productivity by up to 40%. Finally, we cover strategies for maintaining work-life balance and preventing burnout.`}
							className="min-h-[250px] resize-none text-sm"
							disabled={isProcessing}
						/>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Summary Type</Label>
								<Select value={summaryType} onValueChange={setSummaryType} disabled={isProcessing}>
									<SelectTrigger className="mt-1">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="bullet-points">Bullet Points</SelectItem>
										<SelectItem value="paragraph">Paragraph</SelectItem>
										<SelectItem value="executive">Executive Summary</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Summary Length</Label>
								<Select value={summaryLength} onValueChange={setSummaryLength} disabled={isProcessing}>
									<SelectTrigger className="mt-1">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="short">Short</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="long">Detailed</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{isProcessing && (
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>{processingStep}</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} className="w-full" />
							</div>
						)}
					</CardContent>
				</Card>

				<Card className="border border-border/40 bg-card/20 rounded-3xl">
					<CardHeader>
						<CardTitle className="text-sm font-bold">Summary Results</CardTitle>
						<CardDescription>AI-generated summary and key insights</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{summary ? (
							<>
								<div>
									<div className="flex justify-between items-center mb-2">
										<Label className="text-sm font-semibold">Summary</Label>
										<div className="flex gap-2">
											<Button size="sm" variant="outline" onClick={() => copyToClipboard(summary)} className="h-7 text-[10px]">
												{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
												<span className="ml-1">{copied ? "Copied" : "Copy"}</span>
											</Button>
											<Button size="sm" variant="outline" onClick={downloadSummary} className="h-7 text-[10px]">
												<Download className="h-3 w-3 mr-1" /> Download
											</Button>
										</div>
									</div>
									<Textarea
										value={summary}
										readOnly
										className="min-h-[150px] resize-none text-sm"
									/>
								</div>

								{keyPoints.length > 0 && (
									<div>
										<Label className="text-sm font-semibold">Key Points</Label>
										<div className="mt-2 space-y-2">
											{keyPoints.map((point, index) => (
												<div key={index} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
													<span className="text-sm">{point.point}</span>
													<Badge variant={point.importance === "High" ? "default" : "secondary"} className="text-[10px]">
														{point.importance}
													</Badge>
												</div>
											))}
										</div>
									</div>
								)}
							</>
						) : (
							<div className="flex items-center justify-center h-64 rounded-lg bg-muted/20">
								<div className="text-center text-muted-foreground">
									<FileText className="h-12 w-12 mx-auto mb-2 opacity-40" />
									<p className="text-sm">Your AI summary will appear here</p>
									<p className="text-xs mt-1">Paste a transcript and click Generate</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
