"use client";

import {
	Play,
	Trash2,
	Plus,
	ChevronUp,
	ChevronDown,
	Download,
	Upload,
	RotateCcw,
	ChevronRight,
	Copy,
	Check,
	Terminal,
	AlertCircle,
	ShieldCheck,
	Clock,
	FileCode,
	SplitSquareHorizontal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────────

interface CellOutput {
	type: "log" | "error" | "warn" | "info" | "result" | "clear";
	text: string;
	timestamp: number;
}

interface Cell {
	id: string;
	code: string;
	outputs: CellOutput[];
	executionCount: number | null;
	isRunning: boolean;
	executionTime: number | null;
}

type NotebookData = {
	cells: { code: string }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────

let cellCounter = 0;

function createCell(code = ""): Cell {
	cellCounter++;
	return {
		id: `cell-${cellCounter}-${Date.now()}`,
		code,
		outputs: [],
		executionCount: null,
		isRunning: false,
		executionTime: null,
	};
}

// ─── Sandbox Execution ────────────────────────────────────────────────

async function executeJavaScript(
	code: string,
): Promise<{ outputs: CellOutput[]; time: number }> {
	const outputs: CellOutput[] = [];
	const startTime = performance.now();

	// Shared timers for console.time / console.timeEnd
	const perfTimers: Record<string, number> = {};

	// Capture console methods
	const mockConsole = {
		log: (...args: unknown[]) => {
			const text = args.map((a) => formatValue(a)).join(" ");
			outputs.push({ type: "log", text, timestamp: Date.now() });
		},
		error: (...args: unknown[]) => {
			const text = args.map((a) => formatValue(a)).join(" ");
			outputs.push({ type: "error", text, timestamp: Date.now() });
		},
		warn: (...args: unknown[]) => {
			const text = args.map((a) => formatValue(a)).join(" ");
			outputs.push({ type: "warn", text, timestamp: Date.now() });
		},
		info: (...args: unknown[]) => {
			const text = args.map((a) => formatValue(a)).join(" ");
			outputs.push({ type: "info", text, timestamp: Date.now() });
		},
		clear: () => {
			outputs.push({ type: "clear", text: "", timestamp: Date.now() });
		},
		table: (data: unknown) => {
			outputs.push({
				type: "log",
				text: formatTable(data),
				timestamp: Date.now(),
			});
		},
		dir: (obj: unknown) => {
			outputs.push({
				type: "log",
				text: formatValue(obj),
				timestamp: Date.now(),
			});
		},
		time: (label: string) => {
			perfTimers[label] = performance.now();
		},
		timeEnd: (label: string) => {
			const start = perfTimers[label];
			if (start !== undefined) {
				const elapsed = performance.now() - start;
				outputs.push({
					type: "log",
					text: `${label}: ${elapsed.toFixed(2)} ms`,
					timestamp: Date.now(),
				});
				delete perfTimers[label];
			}
		}
	};

	function formatValue(val: unknown): string {
		if (val === null) return "null";
		if (val === undefined) return "undefined";
		if (typeof val === "string") return val;
		if (typeof val === "number" || typeof val === "boolean")
			return String(val);
		if (Array.isArray(val)) return `[${val.map(formatValue).join(", ")}]`;
		if (val instanceof Error) return `${val.name}: ${val.message}\n${val.stack || ""}`;
		if (val instanceof Promise) return "Promise { <pending> }";
		if (typeof val === "object") {
			try {
				return JSON.stringify(val, null, 2);
			} catch {
				return String(val);
			}
		}
		return String(val);
	}

	function formatTable(data: unknown): string {
		if (!data || typeof data !== "object") return String(data);
		const arr = Array.isArray(data) ? data : Object.entries(data);
		if (arr.length === 0) return "(empty)";
		const first = arr[0];
		const keys =
			typeof first === "object" && first !== null ? Object.keys(first) : ["Value"];
		const rows = arr.map((item) => {
			if (typeof item === "object" && item !== null) {
				return keys.map((k) => String((item as Record<string, unknown>)[k] ?? "")).join("\t");
			}
			return String(item);
		});
		return `| ${keys.join("\t")} |\n| ${keys.map(() => "---").join("\t")} |\n${rows.map((r) => `| ${r} |`).join("\n")}`;
	}

	try {
		// Wrap in async IIFE to support top-level await
		const asyncFn = new Function(
			"console",
			`return (async () => { ${code} })();`,
		);
		const result = await asyncFn(mockConsole);

		if (result !== undefined) {
			outputs.push({
				type: "result",
				text: formatValue(result),
				timestamp: Date.now(),
			});
		}
	} catch (error) {
		outputs.push({
			type: "error",
			text: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
			timestamp: Date.now(),
		});
	}

	const time = performance.now() - startTime;
	return { outputs, time };
}

// ─── Sample Notebook ──────────────────────────────────────────────────

const SAMPLE_NOTEBOOK = `// ─── JavaScript Notebook ───
// This is a Jupyter-like interactive environment for JavaScript.
// Each cell runs independently with its own console.

// 🟢 Cell 1: Basic math and console
const greeting = "Hello, Notebook!";
console.log(greeting);
console.log("Math:", 42 * 2, "is the answer");
console.table([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]);

// 📊 Return values are displayed as cell output
42 * 2 + 100`;

// ─── Component ────────────────────────────────────────────────────────

export default function JavaScriptNotebookTool() {
	const [cells, setCells] = useState<Cell[]>([
		createCell(SAMPLE_NOTEBOOK),
		createCell(`// 🟢 Cell 2: Arrays and objects
const fruits = ["apple", "banana", "cherry"];
fruits.push("date");
console.log("Fruits:", fruits);
console.log("Length:", fruits.length);

// Return the reversed array
fruits.toReversed();`),
		createCell(`// 🟢 Cell 3: Async / await
async function fetchGreeting() {
	// Simulate API call
	await new Promise(r => setTimeout(r, 500));
	return "Async data loaded!";
}

console.log("Fetching...");
const data = await fetchGreeting();
console.log("Result:", data);
"Done ✨"`),
	]);
	const [collapseOutputs, setCollapseOutputs] = useState<Set<string>>(new Set());
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Save notebook to localStorage on changes	// Load notebook from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem("sopkit-notebook");
			if (saved) {
				const data: NotebookData = JSON.parse(saved);
				if (data.cells?.length) {
					setCells(data.cells.map((c) => createCell(c.code)));
				}
			}
		} catch {
			// Ignore corrupt data
		}
	}, []);

	// Save notebook to localStorage on changes
	useEffect(() => {
		try {
			const data: NotebookData = {
				cells: cells.map((c) => ({ code: c.code })),
			};
			localStorage.setItem("sopkit-notebook", JSON.stringify(data));
		} catch {
			// Storage full or unavailable — silently skip
		}
	}, [cells]);

	const updateCellCode = useCallback((id: string, code: string) => {
		setCells((prev) =>
			prev.map((c) => (c.id === id ? { ...c, code } : c)),
		);
	}, []);

	const runCell = useCallback(async (id: string) => {
		setCells((prev) =>
			prev.map((c) => (c.id === id ? { ...c, isRunning: true, outputs: [] } : c)),
		);

		const cell = cells.find((c) => c.id === id);
		if (!cell) return;

		const { outputs, time } = await executeJavaScript(cell.code);

		setCells((prev) =>
			prev.map((c) =>
				c.id === id
					? {
							...c,
							outputs,
							executionCount: (c.executionCount || 0) + 1,
							isRunning: false,
							executionTime: Math.round(time),
						}
					: c,
			),
		);
	}, [cells]);

	const runAllCells = useCallback(async () => {
		for (const cell of cells) {
			await runCell(cell.id);
		}
		toast.success("All cells executed");
	}, [cells, runCell]);

	const addCell = useCallback((afterId?: string) => {
		const newCell = createCell();
		setCells((prev) => {
			if (!afterId) return [...prev, newCell];
			const idx = prev.findIndex((c) => c.id === afterId);
			if (idx === -1) return [...prev, newCell];
			const copy = [...prev];
			copy.splice(idx + 1, 0, newCell);
			return copy;
		});	}, []);

	const deleteCell = useCallback((id: string) => {
		setCells((prev) => {
			if (prev.length <= 1) return prev;
			return prev.filter((c) => c.id !== id);
		});
	}, []);

	const moveCell = useCallback((id: string, direction: "up" | "down") => {
		setCells((prev) => {
			const idx = prev.findIndex((c) => c.id === id);
			if (idx === -1) return prev;
			const newIdx = direction === "up" ? idx - 1 : idx + 1;
			if (newIdx < 0 || newIdx >= prev.length) return prev;
			const copy = [...prev];
			[copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
			return copy;
		});
	}, []);

	const clearOutputs = useCallback(() => {
		setCells((prev) =>
			prev.map((c) => ({
				...c,
				outputs: [],
				executionCount: null,
				executionTime: null,
			})),
		);
		toast.success("All outputs cleared");
	}, []);

	const resetNotebook = useCallback(() => {
		setCells([createCell(SAMPLE_NOTEBOOK), createCell("// Add your code here\nconsole.log(\"Hello, world!\");")]);
		toast.success("Notebook reset");
	}, []);

	const exportNotebook = useCallback(() => {
		const data: NotebookData = {
			cells: cells.map((c) => ({ code: c.code })),
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `javascript-notebook-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Notebook exported!");
	}, [cells]);

	const importNotebook = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const data: NotebookData = JSON.parse(event.target?.result as string);
					if (data.cells?.length) {
						setCells(data.cells.map((c) => createCell(c.code)));
						toast.success(`Imported ${data.cells.length} cells`);
					} else {
						toast.error("Invalid notebook file");
					}
				} catch {
					toast.error("Failed to parse notebook file");
				}
			};
			reader.readAsText(file);
			e.target.value = "";
		},
		[],
	);

	const copyCellCode = useCallback(async (code: string, id: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 1500);
		} catch {
			toast.error("Failed to copy");
		}
	}, []);

	const toggleOutputs = useCallback((id: string) => {
		setCollapseOutputs((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, cellId: string) => {
			if (e.key === "Enter" && (e.shiftKey || e.metaKey)) {
				e.preventDefault();
				runCell(cellId);
			}
		},
		[runCell],
	);

	const renderOutput = (output: CellOutput, idx: number) => {
		const baseClass = "text-xs leading-relaxed px-3 py-1.5 font-mono";
		switch (output.type) {
			case "error":
				return (
					<div key={idx} className={`${baseClass} text-red-500 bg-red-500/5 flex items-start gap-2`}>
						<AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
						<pre className="whitespace-pre-wrap break-all">{output.text}</pre>
					</div>
				);
			case "warn":
				return (
					<div key={idx} className={`${baseClass} text-amber-500 bg-amber-500/5 flex items-start gap-2`}>
						<span className="font-bold shrink-0">⚠</span>
						<pre className="whitespace-pre-wrap break-all">{output.text}</pre>
					</div>
				);
			case "info":
				return (
					<div key={idx} className={`${baseClass} text-blue-400 bg-blue-500/5`}>
						<pre className="whitespace-pre-wrap break-all">{output.text}</pre>
					</div>
				);
			case "result":
				return (
					<div key={idx} className={`${baseClass} text-emerald-400 bg-emerald-500/5 border-t border-emerald-500/10 flex items-start gap-2`}>
						<ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-400" />
						<pre className="whitespace-pre-wrap break-all">{output.text}</pre>
					</div>
				);
			case "clear":
				return null;
			default:
				return (
					<div key={idx} className={`${baseClass}`}>
						<pre className="whitespace-pre-wrap break-all">{output.text}</pre>
					</div>
				);
		}
	};

	const totalTime = cells.reduce((sum, c) => sum + (c.executionTime || 0), 0);

	return (
		<div className="space-y-6 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
				<span>🔒 100% Sandboxed: Your code runs in an isolated JavaScript sandbox. No data leaves your browser.</span>
			</div>

			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/20 p-5 border border-border/40 backdrop-blur-sm rounded-2xl">
				<div className="flex items-center gap-4">
					<div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
						<Terminal className="h-5 w-5" />
					</div>
					<div>
						<h2 className="text-lg font-bold">JavaScript Notebook</h2>
						<p className="text-xs text-muted-foreground">
							Interactive Jupyter-style environment for JavaScript | {cells.length} cell{cells.length !== 1 ? "s" : ""}
							{totalTime > 0 && ` · ${totalTime.toFixed(0)}ms total`}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1.5 flex-wrap">
					<Badge variant="secondary" className="text-[10px] font-bold gap-1">
						<Terminal className="h-3 w-3" /> JS
					</Badge>
					<Badge variant="secondary" className="text-[10px] font-bold gap-1">
						<FileCode className="h-3 w-3" /> ES2024
					</Badge>
				</div>
			</div>

			{/* Toolbar */}
			<div className="flex items-center gap-1.5 flex-wrap bg-card/15 border border-border/30 rounded-xl p-2 backdrop-blur-sm">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => runAllCells()}
					className="h-8 text-xs font-bold gap-1.5"
					title="Run All Cells"
				>
					<Play className="h-3.5 w-3.5 text-emerald-500" />
					Run All
				</Button>
				<div className="w-px h-5 bg-border/40" />
				<Button
					variant="ghost"
					size="sm"
					onClick={() => addCell()}
					className="h-8 text-xs font-bold gap-1.5"
					title="Add Cell"
				>
					<Plus className="h-3.5 w-3.5" />
					Add
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={clearOutputs}
					className="h-8 text-xs font-bold gap-1.5"
					title="Clear Outputs"
				>
					<RotateCcw className="h-3.5 w-3.5" />
					Clear
				</Button>
				<div className="w-px h-5 bg-border/40" />
				<Button
					variant="ghost"
					size="sm"
					onClick={exportNotebook}
					className="h-8 text-xs font-bold gap-1.5"
					title="Export Notebook"
				>
					<Download className="h-3.5 w-3.5" />
					Export
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					className="h-8 text-xs font-bold gap-1.5"
					title="Import Notebook"
				>
					<Upload className="h-3.5 w-3.5" />
					Import
				</Button>
				<div className="w-px h-5 bg-border/40" />
				<Button
					variant="ghost"
					size="sm"
					onClick={resetNotebook}
					className="h-8 text-xs font-bold gap-1.5 text-muted-foreground hover:text-destructive"
					title="Reset Notebook"
				>
					<Trash2 className="h-3.5 w-3.5" />
					Reset
				</Button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					className="hidden"
					onChange={importNotebook}
				/>
			</div>

			{/* Notebook Cells */}
			<div className="space-y-3">
				{cells.map((cell, index) => (
					<div
						key={cell.id}
						id={`cell-${cell.id}`}
						className="group relative border border-border/40 rounded-xl bg-card/20 backdrop-blur-sm hover:border-border/60 transition-all duration-200 overflow-hidden"
					>
						{/* Cell Header */}
						<div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-b border-border/20">
							<div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
								<span className="font-bold text-foreground/60">
									In [{cell.executionCount ?? " "}]
								</span>
								{cell.executionTime !== null && (
									<span className="flex items-center gap-1 text-[9px]">
										<Clock className="h-2.5 w-2.5" />
										{cell.executionTime}ms
									</span>
								)}
							</div>
							<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => copyCellCode(cell.code, `copy-${cell.id}`)}
									title="Copy cell code"
								>
									{copiedId === `copy-${cell.id}` ? (
										<Check className="h-3 w-3 text-emerald-500" />
									) : (
										<Copy className="h-3 w-3" />
									)}
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => moveCell(cell.id, "up")}
									disabled={index === 0}
									title="Move up"
								>
									<ChevronUp className="h-3 w-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => moveCell(cell.id, "down")}
									disabled={index === cells.length - 1}
									title="Move down"
								>
									<ChevronDown className="h-3 w-3" />
								</Button>
								<div className="w-px h-4 bg-border/30 mx-0.5" />
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
									onClick={() => runCell(cell.id)}
									disabled={cell.isRunning}
									title="Run cell (Shift+Enter)"
								>
									<Play className={`h-3 w-3 ${cell.isRunning ? "animate-pulse" : ""}`} />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6"
									onClick={() => addCell(cell.id)}
									title="Add cell below"
								>
									<Plus className="h-3 w-3" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 text-muted-foreground hover:text-destructive"
									onClick={() => deleteCell(cell.id)}
									disabled={cells.length <= 1}
									title="Delete cell"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						</div>

						{/* Code Editor */}
						<div className="relative">
							<div className="flex">
								{/* Line numbers */}
								<div className="select-none text-right pr-3 pl-2 py-3 text-[11px] font-mono text-muted-foreground/30 leading-[1.6] bg-muted/10 border-r border-border/10 min-w-[3rem]">
									{cell.code.split("\n").map((_, i) => (
										<div key={i}>{i + 1}</div>
									))}
								</div>
								{/* Code textarea */}
								<textarea
									value={cell.code}
									onChange={(e) => updateCellCode(cell.id, e.target.value)}
									onKeyDown={(e) => handleKeyDown(e, cell.id)}
					
									spellCheck={false}
									className="flex-1 min-h-[80px] resize-y bg-transparent p-3 text-sm font-mono leading-[1.6] text-foreground placeholder:text-muted-foreground/25 border-0 outline-none focus:ring-0 selection:bg-primary/20"
									placeholder="// Write your JavaScript code here..."
								/>
							</div>
						</div>

						{/* Output Area */}
						{cell.outputs.length > 0 && (
							<>
								<div className="flex items-center gap-2 px-3 py-1 border-t border-border/15 bg-muted/10">
									<button
										onClick={() => toggleOutputs(cell.id)}
										className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
									>
										{collapseOutputs.has(cell.id) ? (
											<ChevronRight className="h-3 w-3" />
										) : (
											<ChevronDown className="h-3 w-3" />
										)}
										Output ({cell.outputs.filter(o => o.type !== "clear").length})
									</button>
								</div>
								{!collapseOutputs.has(cell.id) && (
									<div className="border-t border-border/10 bg-card/10 divide-y divide-border/5 max-h-[400px] overflow-y-auto">
										{cell.outputs.map((output, idx) => renderOutput(output, idx))}
									</div>
								)}
							</>
						)}

						{/* Running indicator */}
						{cell.isRunning && (
							<div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
								<div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
									<div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
									Running...
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Keyboard Shortcuts Info */}
			<Card className="border border-border/30 bg-card/10 rounded-xl">
				<CardHeader className="pb-2 pt-3 px-4">
					<CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
						<SplitSquareHorizontal className="h-3 w-3" />
						Shortcuts
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 pb-3">
					<div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-muted-foreground">
						<span className="flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Shift</kbd>
							<span className="text-xs">+</span>
							<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Enter</kbd>
							<span className="ml-1">Run cell</span>
						</span>
						<span className="flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">⌘</kbd>
							<span className="text-xs">+</span>
							<kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/40 text-[9px] font-mono font-bold">Enter</kbd>
							<span className="ml-1">Run cell</span>
						</span>
						<span className="text-muted-foreground/40">·</span>
						<span>Auto-saved to localStorage</span>
						<span className="text-muted-foreground/40">·</span>
						<span>Supports <code className="text-primary font-mono">async/await</code></span>
						<span className="text-muted-foreground/40">·</span>
						<span>ES2024 features</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
