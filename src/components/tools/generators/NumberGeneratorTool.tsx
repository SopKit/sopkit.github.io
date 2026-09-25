"use client";

import { useState, useCallback, useMemo } from "react";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
} from "@/components/tools/shared/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw, Download, ShieldCheck, Dices, Sparkles, BarChart3, Shuffle } from "lucide-react";

type PresetType = "custom" | "dice" | "lottery" | "pin" | "coin";
type OutputFormat = "comma" | "newline" | "space" | "json" | "bullets";
type SortOption = "none" | "asc" | "desc";

export default function NumberGeneratorTool() {
	// Mode & Presets
	const [preset, setPreset] = useState<PresetType>("custom");
	const [min, setMin] = useState<string>("1");
	const [max, setMax] = useState<string>("100");
	const [count, setCount] = useState<string>("10");
	const [unique, setUnique] = useState<boolean>(true);
	const [useCrypto, setUseCrypto] = useState<boolean>(true);
	const [sortOrder, setSortOrder] = useState<SortOption>("none");
	const [outputFormat, setOutputFormat] = useState<OutputFormat>("comma");
	const [decimalPlaces, setDecimalPlaces] = useState<string>("0");

	// Results
	const [results, setResults] = useState<number[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

	// Preset Handlers
	const applyPreset = (type: PresetType) => {
		setPreset(type);
		if (type === "custom") {
			setMin("1");
			setMax("100");
			setCount("10");
			setUnique(true);
			setDecimalPlaces("0");
		} else if (type === "dice") {
			setMin("1");
			setMax("6");
			setCount("2");
			setUnique(false);
			setDecimalPlaces("0");
		} else if (type === "lottery") {
			setMin("1");
			setMax("49");
			setCount("6");
			setUnique(true);
			setSortOrder("asc");
			setDecimalPlaces("0");
		} else if (type === "pin") {
			setMin("0");
			setMax("9");
			setCount("6");
			setUnique(false);
			setOutputFormat("space");
			setDecimalPlaces("0");
		} else if (type === "coin") {
			setMin("0");
			setMax("1");
			setCount("10");
			setUnique(false);
			setDecimalPlaces("0");
		}
	};

	// Secure CSPRNG or standard PRNG
	const getRandomFloat = useCallback((cryptoMode: boolean): number => {
		if (cryptoMode && typeof window !== "undefined" && window.crypto?.getRandomValues) {
			const buffer = new Uint32Array(1);
			window.crypto.getRandomValues(buffer);
			return buffer[0] / (0xffffffff + 1);
		}
		return Math.random();
	}, []);

	const generate = useCallback(() => {
		setIsGenerating(true);
		try {
			const lo = Number(min);
			const hi = Number(max);
			const n = Math.max(1, Math.min(10000, Math.floor(Number(count) || 1)));
			const decimals = Math.max(0, Math.min(6, Math.floor(Number(decimalPlaces) || 0)));

			if (isNaN(lo) || isNaN(hi)) {
				toast.error("Please enter valid minimum and maximum boundaries.");
				setIsGenerating(false);
				return;
			}

			if (lo >= hi) {
				toast.error("Minimum value must be strictly less than maximum value.");
				setIsGenerating(false);
				return;
			}

			const isInteger = decimals === 0;

			if (isInteger && unique && n > hi - lo + 1) {
				toast.error(`Range [${lo}, ${hi}] contains only ${hi - lo + 1} integers, but ${n} unique numbers were requested.`);
				setIsGenerating(false);
				return;
			}

			const nums: number[] = [];
			const used = new Set<number>();
			const maxAttempts = n * 50;
			let attempts = 0;

			while (nums.length < n && attempts < maxAttempts) {
				attempts++;
				const rand = getRandomFloat(useCrypto);
				let val: number;

				if (isInteger) {
					val = lo + Math.floor(rand * (hi - lo + 1));
				} else {
					val = Number((lo + rand * (hi - lo)).toFixed(decimals));
				}

				if (unique) {
					if (!used.has(val)) {
						used.add(val);
						nums.push(val);
					}
				} else {
					nums.push(val);
				}
			}

			if (sortOrder === "asc") {
				nums.sort((a, b) => a - b);
			} else if (sortOrder === "desc") {
				nums.sort((a, b) => b - a);
			}

			setResults(nums);
			toast.success(`Generated ${nums.length} random number${nums.length > 1 ? "s" : ""}!`);
		} finally {
			setIsGenerating(false);
		}
	}, [min, max, count, decimalPlaces, unique, useCrypto, sortOrder, getRandomFloat]);

	// Formatted Output String
	const formattedOutput = useMemo(() => {
		if (results.length === 0) return "";
		switch (outputFormat) {
			case "comma":
				return results.join(", ");
			case "newline":
				return results.join("\n");
			case "space":
				return results.join(" ");
			case "json":
				return JSON.stringify(results, null, 2);
			case "bullets":
				return results.map((n, i) => `${i + 1}. ${n}`).join("\n");
			default:
				return results.join(", ");
		}
	}, [results, outputFormat]);

	// Statistics
	const stats = useMemo(() => {
		if (results.length === 0) return null;
		const sum = results.reduce((acc, curr) => acc + curr, 0);
		const avg = sum / results.length;
		const minVal = Math.min(...results);
		const maxVal = Math.max(...results);

		const sorted = [...results].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

		return {
			count: results.length,
			sum: Number(sum.toFixed(3)),
			avg: Number(avg.toFixed(3)),
			median: Number(median.toFixed(3)),
			min: minVal,
			max: maxVal,
		};
	}, [results]);

	const handleCopy = () => {
		if (!formattedOutput) return;
		navigator.clipboard.writeText(formattedOutput);
		toast.success("Numbers copied to clipboard!");
	};

	const handleDownload = () => {
		if (!formattedOutput) return;
		const ext = outputFormat === "json" ? "json" : "txt";
		const blob = new Blob([formattedOutput], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `random-numbers-${Date.now()}.${ext}`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success(`Saved as ${link.download}`);
	};

	return (
		<ToolShell>
			{/* Mode Presets */}
			<div className="flex flex-wrap items-center gap-2 mb-6">
				<Button
					size="sm"
					variant={preset === "custom" ? "default" : "outline"}
					onClick={() => applyPreset("custom")}
					className="rounded-full"
				>
					Custom Range
				</Button>
				<Button
					size="sm"
					variant={preset === "dice" ? "default" : "outline"}
					onClick={() => applyPreset("dice")}
					className="rounded-full gap-1.5"
				>
					<Dices className="h-4 w-4" /> Dice (2d6)
				</Button>
				<Button
					size="sm"
					variant={preset === "lottery" ? "default" : "outline"}
					onClick={() => applyPreset("lottery")}
					className="rounded-full gap-1.5"
				>
					<Sparkles className="h-4 w-4" /> Lottery 6/49
				</Button>
				<Button
					size="sm"
					variant={preset === "pin" ? "default" : "outline"}
					onClick={() => applyPreset("pin")}
					className="rounded-full gap-1.5"
				>
					<ShieldCheck className="h-4 w-4" /> 6-Digit PIN
				</Button>
				<Button
					size="sm"
					variant={preset === "coin" ? "default" : "outline"}
					onClick={() => applyPreset("coin")}
					className="rounded-full gap-1.5"
				>
					<Shuffle className="h-4 w-4" /> Coin Flips (0/1)
				</Button>
			</div>

			<ToolGrid>
				{/* Settings Main Panel */}
				<ToolGridMain>
					<ToolPanel>
						<ToolSectionTitle
							title="Range & Quantity Settings"
							description="Configure numeric bounds, volume, and precision parameters."
						/>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
							<ToolField label="Minimum (Inclusive)">
								<Input
									type="number"
									value={min}
									onChange={(e) => {
										setMin(e.target.value);
										setPreset("custom");
									}}
									className="font-mono"
								/>
							</ToolField>
							<ToolField label="Maximum (Inclusive)">
								<Input
									type="number"
									value={max}
									onChange={(e) => {
										setMax(e.target.value);
										setPreset("custom");
									}}
									className="font-mono"
								/>
							</ToolField>
							<ToolField label="Count (Up to 10,000)">
								<Input
									type="number"
									min="1"
									max="10000"
									value={count}
									onChange={(e) => {
										setCount(e.target.value);
										setPreset("custom");
									}}
									className="font-mono"
								/>
							</ToolField>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
							<ToolField label="Decimal Places (0 for integers)">
								<Input
									type="number"
									min="0"
									max="6"
									value={decimalPlaces}
									onChange={(e) => setDecimalPlaces(e.target.value)}
									className="font-mono"
								/>
							</ToolField>
							<ToolField label="Sort Order">
								<Select value={sortOrder} onValueChange={(val: SortOption) => setSortOrder(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Sort order" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="none">Original (Unsorted)</SelectItem>
										<SelectItem value="asc">Ascending (Low to High)</SelectItem>
										<SelectItem value="desc">Descending (High to Low)</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>
							<ToolField label="Delimiter & Format">
								<Select value={outputFormat} onValueChange={(val: OutputFormat) => setOutputFormat(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="comma">Comma Separated (1, 2, 3)</SelectItem>
										<SelectItem value="newline">One Per Line (\n)</SelectItem>
										<SelectItem value="space">Space Separated (1 2 3)</SelectItem>
										<SelectItem value="json">JSON Array ([1, 2, 3])</SelectItem>
										<SelectItem value="bullets">Numbered List (1. 2.)</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>
						</div>

						{/* Toggles */}
						<div className="mt-6 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
								<div className="space-y-0.5 pr-2">
									<Label htmlFor="unique-toggle" className="text-sm font-semibold cursor-pointer">
										Unique Numbers Only
									</Label>
									<p className="text-xs text-muted-foreground">
										Disallow repeat numbers (sampling without replacement).
									</p>
								</div>
								<Switch id="unique-toggle" checked={unique} onCheckedChange={setUnique} />
							</div>

							<div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
								<div className="space-y-0.5 pr-2">
									<Label htmlFor="crypto-toggle" className="text-sm font-semibold cursor-pointer flex items-center gap-1.5">
										<ShieldCheck className="h-4 w-4 text-emerald-500" />
										Cryptographic CSPRNG
									</Label>
									<p className="text-xs text-muted-foreground">
										Web Crypto API entropy for security, PINs, and fair draws.
									</p>
								</div>
								<Switch id="crypto-toggle" checked={useCrypto} onCheckedChange={setUseCrypto} />
							</div>
						</div>

						<div className="mt-6 flex flex-wrap gap-3">
							<Button
								size="lg"
								onClick={generate}
								disabled={isGenerating}
								className="gap-2 font-semibold shadow-sm"
							>
								<RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
								Generate Numbers
							</Button>
							{results.length > 0 && (
								<>
									<Button variant="outline" size="lg" onClick={handleCopy} className="gap-2">
										<Copy className="h-4 w-4" /> Copy All
									</Button>
									<Button variant="outline" size="lg" onClick={handleDownload} className="gap-2">
										<Download className="h-4 w-4" /> Download
									</Button>
								</>
							)}
						</div>
					</ToolPanel>

					{/* Visual Badges Display */}
					{results.length > 0 && (
						<ToolPanel className="mt-6">
							<ToolSectionTitle
								title="Generated Sequence"
								description={`${results.length} number${results.length > 1 ? "s" : ""} generated locally in your browser.`}
							/>
							<div className="flex flex-wrap gap-2 mt-4 max-h-60 overflow-y-auto p-1">
								{results.map((n, i) => (
									<span
										key={i}
										className="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-mono font-bold border border-primary/20 hover:bg-primary/20 transition-colors"
									>
										{n}
									</span>
								))}
							</div>
						</ToolPanel>
					)}

					{/* Raw Text Output */}
					{results.length > 0 && (
						<ToolPanel className="mt-6">
							<div className="flex items-center justify-between mb-3">
								<ToolSectionTitle
									title="Formatted Output"
									description="Ready for spreadsheets, codebases, or documentation."
								/>
								<Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 text-xs">
									<Copy className="h-3.5 w-3.5" /> Quick Copy
								</Button>
							</div>
							<Textarea
								readOnly
								rows={8}
								className="font-mono text-sm bg-muted/30 resize-y"
								value={formattedOutput}
							/>
						</ToolPanel>
					)}
				</ToolGridMain>

				{/* Sidebar Stats and Explanations */}
				<ToolGridSide>
					{stats ? (
						<ToolPanel>
							<ToolSectionTitle
								title="Statistical Summary"
								description="Computed distribution metrics from your current batch."
							/>
							<div className="space-y-3 mt-4 text-sm">
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Sample Size (N)</span>
									<span className="font-mono font-bold">{stats.count}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Sum Total</span>
									<span className="font-mono font-semibold">{stats.sum}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Arithmetic Mean (Avg)</span>
									<span className="font-mono font-semibold">{stats.avg}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Median Value</span>
									<span className="font-mono font-semibold">{stats.median}</span>
								</div>
								<div className="flex justify-between py-2 border-b border-border/50">
									<span className="text-muted-foreground">Minimum Generated</span>
									<span className="font-mono font-semibold">{stats.min}</span>
								</div>
								<div className="flex justify-between py-2">
									<span className="text-muted-foreground">Maximum Generated</span>
									<span className="font-mono font-semibold">{stats.max}</span>
								</div>
							</div>
						</ToolPanel>
					) : (
						<ToolPanel>
							<div className="text-center py-6 text-muted-foreground space-y-2">
								<BarChart3 className="h-8 w-8 mx-auto opacity-50" />
								<p className="text-sm font-medium">No Numbers Generated Yet</p>
								<p className="text-xs">
									Configure your range and click Generate to view live summary statistics.
								</p>
							</div>
						</ToolPanel>
					)}

					<ToolPanel className="mt-6">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<ShieldCheck className="h-4 w-4 text-emerald-500" />
								100% Cryptographic Sandbox
							</h3>
							<p>
								When CSPRNG mode is toggled, randomness is harvested directly from your hardware operating system via <code className="bg-muted px-1 py-0.5 rounded font-mono">crypto.getRandomValues()</code>.
							</p>
							<p>
								Zero seeds, generated keys, or numbers ever transit across the internet. Everything runs in your browser's V8 or JavaScriptCore runtime.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
