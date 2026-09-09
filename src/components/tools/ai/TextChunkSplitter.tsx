"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Download, Scissors, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Unit = "tokens" | "words" | "characters";

interface Chunk {
	text: string;
}

const SAMPLE = `Retrieval-Augmented Generation (RAG) improves large language model outputs by grounding them in external knowledge.

The pipeline has two phases: indexing and retrieval. During indexing, documents are cleaned, split into chunks, and converted into embedding vectors.

Chunking strategy matters enormously. Chunks that are too small lose context; chunks that are too large dilute retrieval precision and waste token budget.

Overlapping chunks preserve continuity across boundaries so that sentences spanning a split remain recoverable.

Paragraph-aware splitting respects natural document structure, which usually aligns with semantic units and produces higher-quality embeddings.`;

function measure(text: string, unit: Unit): number {
	if (!text) return 0;
	if (unit === "characters") return text.length;
	if (unit === "words") return (text.match(/\S+/g) || []).length;
	return Math.ceil(text.length / 4);
}

function getTail(text: string, amount: number, unit: Unit): string {
	if (!text || amount <= 0) return "";
	if (unit === "characters") return text.slice(-amount);
	if (unit === "tokens") {
		const chars = Math.min(amount * 4, text.length);
		const slice = text.slice(-chars);
		const spaceIdx = slice.search(/\s/);
		return spaceIdx === -1 ? slice : slice.slice(spaceIdx + 1);
	}
	const words = text.match(/\S+/g) || [];
	return words.slice(-amount).join(" ");
}

function hardSplit(text: string, size: number, overlap: number, unit: Unit): Chunk[] {
	if (!text.trim()) return [];
	const chunks: Chunk[] = [];
	if (unit === "words") {
		const words = text.match(/\S+/g) || [];
		const step = Math.max(1, size - overlap);
		for (let i = 0; i < words.length; i += step) {
			chunks.push({ text: words.slice(i, i + size).join(" ") });
			if (i + size >= words.length) break;
		}
		return chunks;
	}
	const charSize = unit === "tokens" ? size * 4 : size;
	const charOverlap = unit === "tokens" ? overlap * 4 : overlap;
	const step = Math.max(1, charSize - charOverlap);
	for (let i = 0; i < text.length; i += step) {
		chunks.push({ text: text.slice(i, i + charSize) });
		if (i + charSize >= text.length) break;
	}
	return chunks;
}

function buildChunks(text: string, size: number, overlap: number, unit: Unit, paragraphAware: boolean): Chunk[] {
	if (!text.trim() || size <= 0) return [];
	if (!paragraphAware) return hardSplit(text, size, overlap, unit);
	const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());
	const chunks: Chunk[] = [];
	let current = "";
	for (const para of paragraphs) {
		if (measure(para, unit) > size) {
			if (current.trim()) {
				chunks.push({ text: current.trim() });
				current = "";
			}
			chunks.push(...hardSplit(para, size, overlap, unit));
			continue;
		}
		const candidate = current ? `${current}\n\n${para}` : para;
		if (measure(candidate, unit) <= size) {
			current = candidate;
		} else {
			chunks.push({ text: current.trim() });
			current = getTail(current, overlap, unit);
			current = current ? `${current}\n\n${para}` : para;
		}
	}
	if (current.trim()) chunks.push({ text: current.trim() });
	return chunks;
}

export default function TextChunkSplitter() {
	const [text, setText] = useState("");
	const [unit, setUnit] = useState<Unit>("tokens");
	const [chunkSize, setChunkSize] = useState(500);
	const [overlapSize, setOverlapSize] = useState(50);
	const [paragraphAware, setParagraphAware] = useState(true);
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	const overlapInvalid = overlapSize >= chunkSize && chunkSize > 0;

	const chunks = useMemo(
		() => buildChunks(text, chunkSize, paragraphAware ? Math.min(overlapSize, chunkSize - 1) : overlapSize, unit, paragraphAware),
		[text, chunkSize, overlapSize, unit, paragraphAware],
	);

	const stats = useMemo(() => {
		if (chunks.length === 0) return { avg: 0, totalTokens: 0, totalChars: 0 };
		const totalChars = chunks.reduce((sum, c) => sum + c.text.length, 0);
		const totalUnits = chunks.reduce((sum, c) => sum + measure(c.text, unit), 0);
		return { avg: Math.round(totalUnits / chunks.length), totalTokens: Math.ceil(totalChars / 4), totalChars };
	}, [chunks, unit]);

	const handleCopy = (value: string, key: string) => {
		navigator.clipboard.writeText(value);
		toast.success("Copied to clipboard!");
		if (/^\d+$/.test(key)) {
			setCopiedIndex(Number(key));
		} else {
			setCopiedIndex(-1);
		}
		setTimeout(() => setCopiedIndex(null), 2000);
	};

	const handleDownloadAll = () => {
		const blob = new Blob([chunks.map((c) => c.text).join("\n\n---\n\n")], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "text-chunks.txt";
		a.click();
		URL.revokeObjectURL(url);
		toast.success(`Downloaded ${chunks.length} chunks as text-chunks.txt`);
	};

	const copyAllText = useMemo(() => chunks.map((c) => `--- Chunk ${1 + chunks.indexOf(c)} ---\n${c.text}`).join("\n\n"), [chunks]);

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm">
				<Layers className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Splitter: Your documents never leave your browser. Ideal for RAG pipelines, embeddings, and LLM context prep.</span>
			</div>

			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<h3 className="text-base font-bold text-foreground">Source Document</h3>
					</div>
					<Button variant="ghost" size="sm" onClick={() => setText(SAMPLE)} className="h-8 text-xs gap-1">
						Load Sample
					</Button>
				</div>
				<Textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Paste your long document here. Use blank lines to separate paragraphs for structure-aware splitting…"
					className="min-h-[200px] font-mono text-sm resize-y"
				/>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
				<div className="space-y-2">
					<Label className="text-xs font-semibold">Split Unit</Label>
					<Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
						<SelectTrigger className="w-full" aria-label="Split unit">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="tokens">Tokens (~chars / 4)</SelectItem>
							<SelectItem value="words">Words</SelectItem>
							<SelectItem value="characters">Characters</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="chunk-size" className="text-xs font-semibold">Chunk Size</Label>
					<Input
						id="chunk-size"
						type="number"
						min={1}
						value={chunkSize}
						onChange={(e) => setChunkSize(Math.max(1, Number(e.target.value) || 1))}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="overlap-size" className="text-xs font-semibold">Overlap</Label>
					<Input
						id="overlap-size"
						type="number"
						min={0}
						value={overlapSize}
						onChange={(e) => setOverlapSize(Math.max(0, Number(e.target.value) || 0))}
					/>
					{overlapInvalid && <p className="text-[11px] text-red-600 dark:text-red-400">Overlap must be smaller than chunk size.</p>}
				</div>
				<div className="flex items-end gap-3 pb-1">
					<Switch id="paragraph-aware" className="mb-0.5" checked={paragraphAware} onCheckedChange={setParagraphAware} />
					<Label htmlFor="paragraph-aware" className="text-xs font-semibold leading-snug cursor-pointer">
						Paragraph-aware
					</Label>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2 text-xs font-medium">
					<span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300">{chunks.length} chunks</span>
					<span className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300">avg ~{stats.avg} {unit}</span>
					<span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{stats.totalChars.toLocaleString()} chars · ~{stats.totalTokens.toLocaleString()} tokens</span>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="outline" disabled={chunks.length === 0} onClick={() => handleCopy(copyAllText, "all")} className="gap-1.5 h-9">
						{copiedIndex === -1 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
						Copy All
					</Button>
					<Button size="sm" disabled={chunks.length === 0} onClick={handleDownloadAll} className="gap-1.5 h-9">
						<Download className="h-3.5 w-3.5" />
						Download All (.txt)
					</Button>
				</div>
			</div>

			{chunks.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-2 p-12 rounded-2xl border border-dashed border-border text-muted-foreground">
					<Scissors className="h-8 w-8 opacity-40" />
					<p className="text-sm">Paste a document above to generate chunks instantly.</p>
				</div>
			) : (
				<div className="space-y-4">
					{chunks.map((chunk, index) => (
						<div key={index} className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
							<div className="flex items-center justify-between gap-3">
								<span className="text-xs font-bold text-foreground">
									Chunk {index + 1} <span className="font-normal text-muted-foreground">· ~{Math.ceil(chunk.text.length / 4)} tokens · {chunk.text.length.toLocaleString()} chars</span>
								</span>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleCopy(chunk.text, String(index))}
									className="h-7 text-xs gap-1.5"
								>
									{copiedIndex === index ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
									Copy
								</Button>
							</div>
							<p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-48 overflow-y-auto">{chunk.text}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
