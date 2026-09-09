"use client";

import { Check, Copy, Eraser, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Ops {
	fences: boolean;
	preferFirstBlock: boolean;
	prefixes: boolean;
	blankLines: boolean;
	quotes: boolean;
	smartQuotes: boolean;
	bullets: boolean;
	extractJson: boolean;
}

const PREFIX_REGEX =
	/^\s*(?:assistant|ai|bot|chatgpt|claude|gpt|copilot)\s*[:：]\s*/i;

function extractBalanced(text: string): {
	value: string;
	error: string | null;
} {
	const openers: Record<string, string> = { "{": "}", "[": "]" };
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch !== "{" && ch !== "[") continue;
		const close = openers[ch];
		let depth = 0;
		let inString = false;
		let escaped = false;
		for (let j = i; j < text.length; j++) {
			const c = text[j];
			if (escaped) {
				escaped = false;
				continue;
			}
			if (c === "\\") {
				if (inString) escaped = true;
				continue;
			}
			if (c === '"') inString = !inString;
			if (inString) continue;
			if (c === ch) depth++;
			else if (c === close) {
				depth--;
				if (depth === 0) {
					const candidate = text.slice(i, j + 1);
					try {
						return {
							value: JSON.stringify(JSON.parse(candidate), null, 2),
							error: null,
						};
					} catch (e) {
						return {
							value: candidate,
							error: `Found a ${ch === "{" ? "JSON object" : "JSON array"}-looking block but it failed to parse: ${(e as Error).message}`,
						};
					}
				}
			}
		}
	}
	return {
		value: "",
		error: "No balanced {...} or [...] block found in the input.",
	};
}

function clean(input: string, ops: Ops): string {
	let out = input;
	if (ops.fences) {
		const fenceRegex = /```[^\n]*\n([\s\S]*?)```/g;
		const blocks: string[] = [];
		let m: RegExpExecArray | null = fenceRegex.exec(out);
		while (m !== null) {
			blocks.push(m[1]);
			m = fenceRegex.exec(out);
		}
		out =
			ops.preferFirstBlock && blocks.length > 0
				? blocks[0]
				: out.replace(fenceRegex, "$1");
	}
	if (ops.prefixes) {
		out = out
			.split("\n")
			.map((l) => l.replace(PREFIX_REGEX, ""))
			.join("\n");
	}
	if (ops.smartQuotes) {
		out = out
			.replace(/[\u201C\u201D\u201E]/g, '"')
			.replace(/[\u2018\u2019]/g, "'");
	}
	if (ops.quotes) {
		out = out
			.trim()
			.replace(/^["'\u201C\u201D]+/, "")
			.replace(/["'\u201C\u201D]+$/, "")
			.trim();
	}
	if (ops.bullets) {
		out = out.replace(/^(\s*)[*•‣▪]\s+/gm, "$1- ");
	}
	if (ops.blankLines) {
		out = out.replace(/\n{3,}/g, "\n\n");
	}
	return out.trim();
}

const SAMPLE = `Assistant: Here is your data:

\`\`\`json
{
  "name": "SopKit",
  "tools": ["prompt improver", "token counter",],
  "free": true
}
\`\`\`

“Let me know if you need anything else!”

*   Item one
•   Item two`;

export default function LlmOutputCleaner() {
	const [input, setInput] = useState("");
	const [ops, setOps] = useState<Ops>({
		fences: true,
		preferFirstBlock: false,
		prefixes: true,
		blankLines: true,
		quotes: false,
		smartQuotes: true,
		bullets: true,
		extractJson: false,
	});
	const [copied, setCopied] = useState(false);

	const result = useMemo(() => {
		if (!input.trim()) return { output: "", jsonError: null as string | null };
		let output = clean(input, ops);
		let jsonError: string | null = null;
		if (ops.extractJson) {
			const extracted = extractBalanced(output);
			if (extracted.error) {
				jsonError = extracted.error;
			} else {
				output = extracted.value;
			}
		}
		return { output, jsonError };
	}, [input, ops]);

	const stats = useMemo(
		() => ({
			beforeChars: input.length,
			afterChars: result.output.length,
			beforeTokens: Math.round(
				(input.length / 4 +
					(input.trim() ? input.trim().split(/\s+/).length * 1.33 : 0)) /
					2,
			),
			afterTokens: Math.round(
				(result.output.length / 4 +
					(result.output.trim()
						? result.output.trim().split(/\s+/).length * 1.33
						: 0)) /
					2,
			),
		}),
		[input, result],
	);

	const toggle = (key: keyof Ops) => (checked: boolean) =>
		setOps((prev) => ({ ...prev, [key]: checked }));

	const handleCopy = () => {
		if (!result.output) return;
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(result.output)
				.then(() => toast.success("Copied to clipboard"))
				.catch(() => toast.error("Copy failed"));
		} else {
			toast.error("Clipboard unavailable");
			return;
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const OPS_LIST: Array<{ key: keyof Ops; label: string; desc: string }> = [
		{
			key: "fences",
			label: "Strip code fences",
			desc: "Remove ```lang … ``` wrappers",
		},
		{
			key: "preferFirstBlock",
			label: "Keep first block only",
			desc: "When multiple fences exist",
		},
		{
			key: "prefixes",
			label: "Remove chat prefixes",
			desc: 'Strip "Assistant:", "ChatGPT:" etc.',
		},
		{
			key: "blankLines",
			label: "Collapse blank lines",
			desc: "Max one blank line between paragraphs",
		},
		{
			key: "quotes",
			label: "Trim outer quotes",
			desc: "Drop wrapping quotation marks",
		},
		{
			key: "smartQuotes",
			label: "Straighten smart quotes",
			desc: "\u201C \u2019 become \" '",
		},
		{ key: "bullets", label: "Normalize bullets", desc: "* • ▪ all become -" },
		{
			key: "extractJson",
			label: "Extract JSON",
			desc: "Pretty-print first balanced {} or []",
		},
	];

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs font-semibold text-teal-600 dark:text-teal-400">
				<Eraser className="h-4.5 w-4.5 shrink-0" />
				<span>
					All cleaning happens locally in your browser — paste anything safely.
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-1 space-y-4 p-6 rounded-2xl bg-card border border-border/60 shadow-sm self-start w-full">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold">Cleaning Options</h3>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setInput(SAMPLE)}
							className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
						>
							<Sparkles className="h-3.5 w-3.5" /> Sample Input
						</Button>
					</div>
					<div className="space-y-3.5">
						{OPS_LIST.map((op) => (
							<div
								key={op.key}
								className={`flex items-center justify-between gap-3 ${op.key === "preferFirstBlock" && !ops.fences ? "opacity-40 pointer-events-none" : ""}`}
							>
								<div className="space-y-0.5">
									<Label
										htmlFor={`op-${op.key}`}
										className="text-xs font-semibold cursor-pointer"
									>
										{op.label}
									</Label>
									<p className="text-[10px] text-muted-foreground">{op.desc}</p>
								</div>
								<Switch
									id={`op-${op.key}`}
									className=""
									checked={ops[op.key]}
									onCheckedChange={toggle(op.key)}
								/>
							</div>
						))}
					</div>
				</div>

				<div className="lg:col-span-2 space-y-6">
					<div className="space-y-3 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
						<Label htmlFor="dirty-input" className="text-sm font-bold">
							Raw LLM Output
						</Label>
						<Textarea
							id="dirty-input"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder='Paste messy AI output here… e.g.

Assistant: ```python
print("hello")
```'
							className="min-h-[160px] font-mono text-xs leading-relaxed"
						/>
					</div>

					<div className="space-y-3 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h3 className="text-sm font-bold flex items-center gap-1.5">
								<Check className="h-4 w-4 text-teal-500" /> Cleaned Output
							</h3>
							<Button
								size="sm"
								onClick={handleCopy}
								disabled={!result.output}
								className="gap-1.5 text-xs h-8"
							>
								{copied ? (
									<Check className="h-3.5 w-3.5" />
								) : (
									<Copy className="h-3.5 w-3.5" />
								)}{" "}
								{copied ? "Copied" : "Copy"}
							</Button>
						</div>
						<pre
							className={`min-h-[140px] max-h-[420px] overflow-auto p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-xs leading-relaxed whitespace-pre-wrap ${result.output ? "" : "italic text-muted-foreground"}`}
						>
							{result.output ||
								"The cleaned result appears here as you type and toggle options."}
						</pre>
						{result.jsonError && (
							<p className="text-xs font-semibold text-red-600 dark:text-red-400 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
								{result.jsonError}
							</p>
						)}
						<div className="flex flex-wrap gap-2 pt-1">
							<Badge variant="secondary" className="tabular-nums">
								Before: {stats.beforeChars.toLocaleString()} chars · ~
								{stats.beforeTokens.toLocaleString()} tokens
							</Badge>
							<Badge className="tabular-nums">
								After: {stats.afterChars.toLocaleString()} chars · ~
								{stats.afterTokens.toLocaleString()} tokens
							</Badge>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
