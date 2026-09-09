"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Plus, Trash2, ListOrdered, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Pair {
	id: number;
	input: string;
	output: string;
}

type Format = "numbered" | "xml" | "markdown" | "chat";

const FORMATS: { value: Format; label: string }[] = [
	{ value: "numbered", label: "Numbered Turns" },
	{ value: "xml", label: "XML Tags" },
	{ value: "markdown", label: "Markdown Separators" },
	{ value: "chat", label: "Chat JSON Messages" },
];

let nextId = 4;

export default function FewShotFormatter() {
	const [instruction, setInstruction] = useState("");
	const [format, setFormat] = useState<Format>("numbered");
	const [copied, setCopied] = useState(false);
	const [pairs, setPairs] = useState<Pair[]>([
		{ id: 1, input: "", output: "" },
		{ id: 2, input: "", output: "" },
	]);

	const updatePair = (id: number, field: "input" | "output", value: string) => {
		setPairs((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
	};

	const addPair = () => {
		if (pairs.length >= 12) {
			toast.info("Maximum of 12 examples reached.");
			return;
		}
		setPairs((prev) => [...prev, { id: nextId++, input: "", output: "" }]);
	};

	const removePair = (id: number) => {
		setPairs((prev) => prev.filter((p) => p.id !== id));
	};

	const cleanPairs = useMemo(
		() => pairs.map((p) => ({ input: p.input.trim(), output: p.output.trim() })).filter((p) => p.input || p.output),
		[pairs],
	);

	const formatted = useMemo(() => {
		if (cleanPairs.length === 0 && !instruction.trim()) return "";
		const instr = instruction.trim();
		if (format === "numbered") {
			const blocks = cleanPairs.map((p, i) => `Example ${i + 1}\nInput: ${p.input || "(empty)"}\nOutput: ${p.output || "(empty)"}`);
			return (instr ? `${instr}\n\n` : "") + blocks.join("\n\n");
		}
		if (format === "xml") {
			const blocks = cleanPairs
				.map((p) => `<example>\n<input>${p.input}</input>\n<output>${p.output}</output>\n</example>`)
				.join("\n\n");
			return (instr ? `<instructions>\n${instr}\n</instructions>\n\n` : "") + blocks;
		}
		if (format === "markdown") {
			const blocks = cleanPairs
				.map((p, i) => `### Example ${i + 1}\n**Input:** ${p.input}\n**Output:** ${p.output}`)
				.join("\n\n---\n\n");
			return (instr ? `${instr}\n\n` : "") + blocks;
		}
		const messages: { role: string; content: string }[] = [];
		if (instr) messages.push({ role: "system", content: instr });
		for (const p of cleanPairs) {
			messages.push({ role: "user", content: p.input });
			messages.push({ role: "assistant", content: p.output });
		}
		return JSON.stringify(messages, null, 2);
	}, [cleanPairs, instruction, format]);

	const handleCopy = () => {
		navigator.clipboard.writeText(formatted);
		setCopied(true);
		toast.success("Formatted prompt copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
				<div className="space-y-5 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
					<div className="space-y-2">
						<Label htmlFor="task-instruction" className="text-xs font-semibold">Task Instruction (optional)</Label>
						<Textarea
							id="task-instruction"
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							placeholder="e.g. Classify each customer support ticket by urgency and topic…"
							className="min-h-[80px] text-sm resize-y"
						/>
					</div>

					<div className="flex items-center justify-between">
						<Label className="text-xs font-semibold">Example Pairs ({pairs.length}/12)</Label>
						<Button size="sm" variant="outline" onClick={addPair} className="h-7 text-xs gap-1">
							<Plus className="h-3.5 w-3.5" />
							Add Example
						</Button>
					</div>

					<div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
						{pairs.map((pair, index) => (
							<div key={pair.id} className="p-3.5 rounded-xl border border-border/60 bg-muted/30 space-y-2.5">
								<div className="flex items-center justify-between">
									<span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Example {index + 1}</span>
									<Button size="sm" variant="ghost" onClick={() => removePair(pair.id)} className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10">
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
								<Textarea
									value={pair.input}
									onChange={(e) => updatePair(pair.id, "input", e.target.value)}
									placeholder="Input…"
									className="min-h-[56px] text-sm resize-y"
								/>
								<Textarea
									value={pair.output}
									onChange={(e) => updatePair(pair.id, "output", e.target.value)}
									placeholder="Expected output…"
									className="min-h-[56px] text-sm resize-y"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-4 lg:sticky lg:top-6">
					<div className="space-y-2">
						<Label className="text-xs font-semibold">Output Format</Label>
						<Select value={format} onValueChange={(v) => setFormat(v as Format)}>
							<SelectTrigger className="w-full" aria-label="Output format">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{FORMATS.map((f) => (
									<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{format === "chat" ? <Braces className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : <ListOrdered className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
								<h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Live Preview</h4>
							</div>
							<Button size="sm" variant="outline" disabled={!formatted} onClick={handleCopy} className="h-7 text-xs gap-1.5">
								{copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
								Copy Formatted
							</Button>
						</div>
						<pre className={`p-3.5 rounded-xl bg-muted/50 border border-border/40 text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap ${format === "chat" ? "font-mono text-emerald-700 dark:text-emerald-400" : "font-mono text-foreground"}`}>
							{formatted || "Fill in the task and example pairs — the formatted prompt appears here instantly."}
						</pre>
						<p className="text-[11px] text-muted-foreground">Empty pairs are trimmed automatically. Only pairs with an input or output are included.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
