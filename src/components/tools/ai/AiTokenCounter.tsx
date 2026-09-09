"use client";

import { Calculator, Check, Coins, Copy, Info, Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface ModelPricing {
	id: string;
	name: string;
	inputPer1M: number;
	outputPer1M: number;
	note?: string;
}

const MODELS: ModelPricing[] = [
	{ id: "gpt-5", name: "GPT-5", inputPer1M: 1.25, outputPer1M: 10 },
	{
		id: "gpt-4o-mini",
		name: "GPT-4o mini",
		inputPer1M: 0.15,
		outputPer1M: 0.6,
	},
	{
		id: "claude-sonnet-4-5",
		name: "Claude Sonnet 4.5",
		inputPer1M: 3,
		outputPer1M: 15,
	},
	{
		id: "claude-opus-4-1",
		name: "Claude Opus 4.1",
		inputPer1M: 15,
		outputPer1M: 75,
	},
	{
		id: "gemini-2.5-flash",
		name: "Gemini 2.5 Flash",
		inputPer1M: 0.3,
		outputPer1M: 2.5,
	},
	{
		id: "llama-4-scout",
		name: "Llama 4 Scout",
		inputPer1M: 0.11,
		outputPer1M: 0.34,
		note: "typical hosted price",
	},
];

function estimateTokens(text: string): number {
	if (!text.trim()) return 0;
	const charEstimate = Math.ceil(text.length / 4);
	const wordEstimate = Math.ceil(text.trim().split(/\s+/).length * 1.33);
	return Math.round((charEstimate + wordEstimate) / 2);
}

const fmtUsd = (n: number) =>
	n >= 100
		? `$${n.toFixed(2)}`
		: n >= 0.01
			? `$${n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}`
			: `$${n.toFixed(6)}`;

export default function AiTokenCounter() {
	const [modelId, setModelId] = useState("gpt-5");
	const [text, setText] = useState("");
	const [outputTokens, setOutputTokens] = useState(500);
	const [batchText, setBatchText] = useState("");
	const [copied, setCopied] = useState(false);

	const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

	const singleStats = useMemo(() => {
		const tokens = estimateTokens(text);
		const chars = text.length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		const inputCost = (tokens / 1_000_000) * model.inputPer1M;
		const outputCost = (outputTokens / 1_000_000) * model.outputPer1M;
		const perRequest = inputCost + outputCost;
		return {
			tokens,
			chars,
			words,
			inputCost,
			outputCost,
			perRequest,
			perThousand: perRequest * 1000,
		};
	}, [text, outputTokens, model]);

	const batchRows = useMemo(() => {
		const lines = batchText.split("\n");
		let totalTokens = 0;
		let totalCost = 0;
		const rows = lines
			.map((line, i) => {
				const tokens = estimateTokens(line);
				const cost = (tokens / 1_000_000) * model.inputPer1M;
				totalTokens += tokens;
				totalCost += cost;
				return { lineNo: i + 1, text: line, chars: line.length, tokens, cost };
			})
			.filter((r) => r.text.trim().length > 0);
		return { rows, totalTokens, totalCost };
	}, [batchText, model]);

	const handleCopySummary = () => {
		const summary = `Model: ${model.name}\nInput: ${singleStats.tokens} tokens ≈ ${fmtUsd(singleStats.inputCost)}\nOutput: ${outputTokens} tokens ≈ ${fmtUsd(singleStats.outputCost)}\nTotal per request: ≈ ${fmtUsd(singleStats.perRequest)}\nPer 1,000 requests: ≈ ${fmtUsd(singleStats.perThousand)}\n(Pricing approximate — verify with provider.)`;
		if (navigator.clipboard?.writeText) {
			navigator.clipboard
				.writeText(summary)
				.then(() => toast.success("Copied to clipboard"))
				.catch(() => toast.error("Copy failed"));
		} else {
			toast.error("Clipboard unavailable in this browser");
			return;
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400 text-xs font-semibold">
				<Info className="h-4.5 w-4.5 shrink-0" />
				<span>
					Prices are approximate published rates per 1M tokens (USD), as of
					early 2026 — always verify with your provider before budgeting.
				</span>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				{MODELS.map((m) => (
					<button
						key={m.id}
						type="button"
						onClick={() => setModelId(m.id)}
						className={`p-3 rounded-xl border text-left transition-all ${m.id === modelId ? "border-sky-500/60 bg-sky-500/10 shadow-sm ring-1 ring-sky-500/30" : "border-border/60 bg-card hover:border-border"}`}
					>
						<p
							className={`text-xs font-bold truncate ${m.id === modelId ? "text-sky-600 dark:text-sky-400" : "text-foreground"}`}
						>
							{m.name}
						</p>
						<p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
							${m.inputPer1M}/${m.outputPer1M} per 1M
						</p>
					</button>
				))}
			</div>

			<Tabs defaultValue="single">
				<TabsList className="grid w-full grid-cols-2 max-w-md">
					<TabsTrigger value="single" className="gap-1.5">
						<Calculator className="h-3.5 w-3.5" /> Single Request
					</TabsTrigger>
					<TabsTrigger value="batch" className="gap-1.5">
						<Layers className="h-3.5 w-3.5" /> Batch Paste
					</TabsTrigger>
				</TabsList>

				<TabsContent value="single" className="space-y-6 pt-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-4 p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
							<Label htmlFor="token-text" className="text-sm font-bold">
								Prompt Text
							</Label>
							<Textarea
								id="token-text"
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder="Type or paste the prompt you plan to send…"
								className="min-h-[160px] font-mono text-sm"
							/>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								Estimate = average of{" "}
								<code className="font-mono bg-muted px-1 rounded">
									ceil(chars / 4)
								</code>{" "}
								and{" "}
								<code className="font-mono bg-muted px-1 rounded">
									words × 1.33
								</code>
								. Real tokenizers vary ±10–20%.
							</p>

							<div className="space-y-3 pt-1">
								<div className="flex items-center justify-between text-xs font-semibold">
									<Label htmlFor="out-tokens">Expected Output Tokens</Label>
									<span className="tabular-nums text-sky-600 dark:text-sky-400">
										{outputTokens.toLocaleString()}
									</span>
								</div>
								<Slider
									id="out-tokens"
									value={[outputTokens]}
									min={0}
									max={8000}
									step={50}
									onValueChange={(v) => setOutputTokens(v[0])}
								/>
								<Input
									type="number"
									min={0}
									value={outputTokens}
									onChange={(e) =>
										setOutputTokens(Math.max(0, Number(e.target.value) || 0))
									}
									className="h-9 w-32 text-xs"
									aria-label="Output tokens number input"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div className="grid grid-cols-3 gap-3">
								<div className="p-4 rounded-xl bg-card border border-border/60 text-center shadow-sm">
									<p className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
										Chars
									</p>
									<p className="text-lg font-black tabular-nums">
										{singleStats.chars.toLocaleString()}
									</p>
								</div>
								<div className="p-4 rounded-xl bg-card border border-border/60 text-center shadow-sm">
									<p className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">
										Words
									</p>
									<p className="text-lg font-black tabular-nums">
										{singleStats.words.toLocaleString()}
									</p>
								</div>
								<div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-center shadow-sm">
									<p className="text-[10px] uppercase tracking-wide text-sky-600 dark:text-sky-400 font-bold">
										Tokens
									</p>
									<p className="text-lg font-black tabular-nums text-sky-600 dark:text-sky-400">
										{singleStats.tokens.toLocaleString()}
									</p>
								</div>
							</div>

							<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
								<div className="flex items-center gap-2">
									<Coins className="h-4 w-4 text-amber-500" />
									<h3 className="text-sm font-bold">
										Estimated Cost — {model.name}
									</h3>
								</div>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Input ({singleStats.tokens.toLocaleString()} tok)
										</span>
										<span className="font-semibold tabular-nums">
											{fmtUsd(singleStats.inputCost)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Output ({outputTokens.toLocaleString()} tok)
										</span>
										<span className="font-semibold tabular-nums">
											{fmtUsd(singleStats.outputCost)}
										</span>
									</div>
									<div className="h-px bg-border" />
									<div className="flex justify-between text-base">
										<span className="font-bold">Per request</span>
										<span className="font-black tabular-nums">
											{fmtUsd(singleStats.perRequest)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-bold text-foreground">
											Per 1,000 requests
										</span>
										<span className="font-black tabular-nums">
											{fmtUsd(singleStats.perThousand)}
										</span>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={handleCopySummary}
									className="gap-1.5 text-xs"
								>
									{copied ? (
										<Check className="h-3.5 w-3.5 text-emerald-500" />
									) : (
										<Copy className="h-3.5 w-3.5" />
									)}{" "}
									Copy Estimate
								</Button>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="batch" className="space-y-4 pt-6">
					<Textarea
						value={batchText}
						onChange={(e) => setBatchText(e.target.value)}
						placeholder={
							"Paste one prompt per line…\nSummarize this article for a newsletter\nTranslate these product titles into German\nWrite 5 subject lines for a launch email"
						}
						className="min-h-[140px] font-mono text-sm"
					/>
					{batchRows.rows.length > 0 && (
						<div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full text-xs">
									<thead>
										<tr className="bg-muted/60 text-left text-muted-foreground uppercase tracking-wider text-[10px]">
											<th className="px-4 py-2.5 font-bold">#</th>
											<th className="px-4 py-2.5 font-bold">Line Preview</th>
											<th className="px-4 py-2.5 font-bold text-right">
												Chars
											</th>
											<th className="px-4 py-2.5 font-bold text-right">
												Est. Tokens
											</th>
											<th className="px-4 py-2.5 font-bold text-right">
												Est. Cost ({model.name})
											</th>
										</tr>
									</thead>
									<tbody>
										{batchRows.rows.map((r) => (
											<tr key={r.lineNo} className="border-t border-border/40">
												<td className="px-4 py-2 text-muted-foreground tabular-nums">
													{r.lineNo}
												</td>
												<td className="px-4 py-2 max-w-[280px] truncate font-mono text-[11px]">
													{r.text.trim() || (
														<span className="italic text-muted-foreground">
															(empty)
														</span>
													)}
												</td>
												<td className="px-4 py-2 text-right tabular-nums">
													{r.chars.toLocaleString()}
												</td>
												<td className="px-4 py-2 text-right tabular-nums font-semibold">
													{r.tokens.toLocaleString()}
												</td>
												<td className="px-4 py-2 text-right tabular-nums">
													{fmtUsd(r.cost)}
												</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr className="border-t-2 border-border bg-muted/40 font-black">
											<td className="px-4 py-2.5" colSpan={2}>
												Totals
											</td>
											<td className="px-4 py-2.5 text-right tabular-nums">
												{batchRows.rows
													.reduce((s, r) => s + r.chars, 0)
													.toLocaleString()}
											</td>
											<td className="px-4 py-2.5 text-right tabular-nums text-sky-600 dark:text-sky-400">
												{batchRows.totalTokens.toLocaleString()}
											</td>
											<td className="px-4 py-2.5 text-right tabular-nums">
												{fmtUsd(batchRows.totalCost)}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
