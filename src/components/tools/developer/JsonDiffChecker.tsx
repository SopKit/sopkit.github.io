"use client";

import { useState, useMemo } from "react";
import { GitCompare, Check, Copy, RefreshCw, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DiffResult {
	path: string;
	type: "added" | "removed" | "modified" | "unchanged";
	leftValue?: any;
	rightValue?: any;
}

export default function JsonDiffChecker() {
	const [leftJson, setLeftJson] = useState<string>(
		JSON.stringify(
			{
				name: "SopKit",
				version: "2.4.0",
				description: "Privacy-first online toolkit",
				features: ["No uploads", "Instant processing", "100% free"],
				settings: {
					darkMode: true,
					telemetry: false,
					maxConcurrent: 4,
				},
			},
			null,
			2
		)
	);

	const [rightJson, setRightJson] = useState<string>(
		JSON.stringify(
			{
				name: "SopKit",
				version: "2.5.0",
				description: "Privacy-first online toolkit for creators & devs",
				features: ["No uploads", "Instant processing", "100% free", "Offline support"],
				settings: {
					darkMode: true,
					telemetry: false,
					maxConcurrent: 8,
					autoSave: true,
				},
			},
			null,
			2
		)
	);

	// Parse and compare
	const comparison = useMemo(() => {
		let leftParsed: any = null;
		let rightParsed: any = null;
		let leftError: string | null = null;
		let rightError: string | null = null;

		try {
			if (leftJson.trim()) leftParsed = JSON.parse(leftJson);
		} catch (e: any) {
			leftError = e.message;
		}

		try {
			if (rightJson.trim()) rightParsed = JSON.parse(rightJson);
		} catch (e: any) {
			rightError = e.message;
		}

		if (leftError || rightError || !leftParsed || !rightParsed) {
			return { diffs: [], leftError, rightError, stats: { added: 0, removed: 0, modified: 0 } };
		}

		const diffs: DiffResult[] = [];
		const stats = { added: 0, removed: 0, modified: 0 };

		const compareObjects = (obj1: any, obj2: any, currentPath = "") => {
			const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

			for (const key of Array.from(allKeys).sort()) {
				const propPath = currentPath ? `${currentPath}.${key}` : key;
				const in1 = obj1 !== undefined && key in obj1;
				const in2 = obj2 !== undefined && key in obj2;

				if (in1 && !in2) {
					diffs.push({ path: propPath, type: "removed", leftValue: obj1[key] });
					stats.removed++;
				} else if (!in1 && in2) {
					diffs.push({ path: propPath, type: "added", rightValue: obj2[key] });
					stats.added++;
				} else {
					const val1 = obj1[key];
					const val2 = obj2[key];

					if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
						compareObjects(val1, val2, propPath);
					} else if (val1 !== val2) {
						diffs.push({ path: propPath, type: "modified", leftValue: val1, rightValue: val2 });
						stats.modified++;
					}
				}
			}
		};

		compareObjects(leftParsed, rightParsed);

		return { diffs, leftError, rightError, stats };
	}, [leftJson, rightJson]);

	const formatJson = (side: "left" | "right") => {
		try {
			if (side === "left") {
				setLeftJson(JSON.stringify(JSON.parse(leftJson), null, 2));
			} else {
				setRightJson(JSON.stringify(JSON.parse(rightJson), null, 2));
			}
			toast.success(`Beautified ${side} JSON`);
		} catch (e: any) {
			toast.error(`Invalid JSON in ${side} editor: ${e.message}`);
		}
	};

	const swapSides = () => {
		const temp = leftJson;
		setLeftJson(rightJson);
		setRightJson(temp);
		toast.info("Swapped Left and Right JSON.");
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Diff: JSON structures are compared purely inside browser memory with zero network uploads.</span>
			</div>

			{/* Editors Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left JSON */}
				<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
							<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Original JSON (Left)</h3>
						</div>
						<div className="flex items-center gap-1.5">
							<Button size="sm" variant="ghost" onClick={() => formatJson("left")} className="h-7 text-xs">
								Format
							</Button>
							<Button size="sm" variant="ghost" onClick={() => setLeftJson("")} className="h-7 text-xs text-muted-foreground hover:text-foreground">
								Clear
							</Button>
						</div>
					</div>
					<Textarea
						value={leftJson}
						onChange={(e) => setLeftJson(e.target.value)}
						placeholder="Paste original JSON..."
						aria-label="Original JSON Input"
						className="min-h-[260px] font-mono text-xs leading-relaxed bg-muted/20 border-border/60 focus-visible:ring-1"
					/>
					{comparison.leftError && (
						<p className="text-xs text-destructive flex items-center gap-1.5 font-medium">
							<AlertCircle className="w-3.5 h-3.5" />
							{comparison.leftError}
						</p>
					)}
				</div>

				{/* Right JSON */}
				<div className="p-5 rounded-2xl bg-card border border-border/60 shadow-sm space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
							<h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Modified JSON (Right)</h3>
						</div>
						<div className="flex items-center gap-1.5">
							<Button size="sm" variant="ghost" onClick={() => formatJson("right")} className="h-7 text-xs">
								Format
							</Button>
							<Button size="sm" variant="ghost" onClick={swapSides} className="h-7 text-xs gap-1">
								<RefreshCw className="w-3 h-3" /> Swap
							</Button>
						</div>
					</div>
					<Textarea
						value={rightJson}
						onChange={(e) => setRightJson(e.target.value)}
						placeholder="Paste modified JSON..."
						aria-label="Modified JSON Input"
						className="min-h-[260px] font-mono text-xs leading-relaxed bg-muted/20 border-border/60 focus-visible:ring-1"
					/>
					{comparison.rightError && (
						<p className="text-xs text-destructive flex items-center gap-1.5 font-medium">
							<AlertCircle className="w-3.5 h-3.5" />
							{comparison.rightError}
						</p>
					)}
				</div>
			</div>

			{/* Comparison Diff Breakdown */}
			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
							<GitCompare className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-base font-bold text-foreground">Diff Report</h3>
							<p className="text-xs text-muted-foreground">Deep key-by-key comparison results</p>
						</div>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						<Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
							+{comparison.stats.added} Added
						</Badge>
						<Badge variant="outline" className="text-xs border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/5">
							-{comparison.stats.removed} Removed
						</Badge>
						<Badge variant="outline" className="text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
							~{comparison.stats.modified} Changed
						</Badge>
					</div>
				</div>

				{comparison.diffs.length === 0 && !comparison.leftError && !comparison.rightError && (
					<div className="p-8 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-1">
						<Check className="w-8 h-8 mx-auto" />
						<p className="font-bold text-sm">JSON objects are 100% identical</p>
						<p className="text-xs opacity-80">No differences detected across all keys and nested properties.</p>
					</div>
				)}

				{comparison.diffs.length > 0 && (
					<div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
						{comparison.diffs.map((diff, idx) => (
							<div
								key={idx}
								className={`p-3.5 rounded-xl border text-xs font-mono transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2 ${
									diff.type === "added"
										? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
										: diff.type === "removed"
										? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
										: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
								}`}
							>
								<div className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className={`text-[10px] uppercase font-bold ${
											diff.type === "added"
												? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
												: diff.type === "removed"
												? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
												: "bg-amber-500/20 text-amber-700 dark:text-amber-300"
										}`}
									>
										{diff.type}
									</Badge>
									<span className="font-bold">{diff.path}</span>
								</div>

								<div className="text-[11px] truncate max-w-md">
									{diff.type === "added" && <span>+ {JSON.stringify(diff.rightValue)}</span>}
									{diff.type === "removed" && <span>- {JSON.stringify(diff.leftValue)}</span>}
									{diff.type === "modified" && (
										<span>
											<span className="line-through opacity-70">{JSON.stringify(diff.leftValue)}</span>
											{" → "}
											<span className="font-bold">{JSON.stringify(diff.rightValue)}</span>
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
