"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, ShieldCheck, Download, RefreshCw, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Alignment = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
	const [headers, setHeaders] = useState<string[]>(["Feature", "Starter", "Pro", "Enterprise"]);
	const [alignments, setAlignments] = useState<Alignment[]>(["left", "center", "center", "center"]);
	const [rows, setRows] = useState<string[][]>([
		["Cloud Storage", "5 GB", "50 GB", "Unlimited"],
		["Team Members", "1", "5", "Unlimited"],
		["24/7 Support", "Email", "Priority", "Dedicated Manager"],
		["Custom Domains", "No", "Yes", "Yes"],
	]);
	const [copied, setCopied] = useState(false);

	const markdownOutput = useMemo(() => {
		// Calculate column widths
		const colWidths = headers.map((header, colIdx) => {
			let maxLen = header.trim().length;
			for (const row of rows) {
				const cellLen = (row[colIdx] || "").trim().length;
				if (cellLen > maxLen) maxLen = cellLen;
			}
			return Math.max(maxLen, 3);
		});

		// Format header line
		const headerLine = `| ${headers.map((h, i) => h.padEnd(colWidths[i])).join(" | ")} |`;

		// Format separator line
		const separatorLine = `| ${alignments
			.map((align, i) => {
				const w = colWidths[i];
				if (align === "center") return `:${"-".repeat(Math.max(w - 2, 1))}:`;
				if (align === "right") return `${"-".repeat(Math.max(w - 1, 1))}:`;
				return `:${"-".repeat(Math.max(w - 1, 1))}`;
			})
			.join(" | ")} |`;

		// Format row lines
		const rowLines = rows.map(
			(row) =>
				`| ${headers
					.map((_, i) => {
						const val = (row[i] || "").trim();
						const w = colWidths[i];
						if (alignments[i] === "right") return val.padStart(w);
						if (alignments[i] === "center") {
							const totalPad = w - val.length;
							const padLeft = Math.floor(totalPad / 2);
							const padRight = totalPad - padLeft;
							return " ".repeat(padLeft) + val + " ".repeat(padRight);
						}
						return val.padEnd(w);
					})
					.join(" | ")} |`
		);

		return [headerLine, separatorLine, ...rowLines].join("\n");
	}, [headers, alignments, rows]);

	const addRow = () => {
		setRows([...rows, new Array(headers.length).fill("")]);
		toast.success("Added new row.");
	};

	const removeRow = (index: number) => {
		if (rows.length <= 1) {
			toast.error("Table must have at least one data row.");
			return;
		}
		setRows(rows.filter((_, i) => i !== index));
	};

	const addColumn = () => {
		setHeaders([...headers, `Col ${headers.length + 1}`]);
		setAlignments([...alignments, "left"]);
		setRows(rows.map((row) => [...row, ""]));
		toast.success("Added new column.");
	};

	const removeColumn = (colIdx: number) => {
		if (headers.length <= 1) {
			toast.error("Table must have at least one column.");
			return;
		}
		setHeaders(headers.filter((_, i) => i !== colIdx));
		setAlignments(alignments.filter((_, i) => i !== colIdx));
		setRows(rows.map((row) => row.filter((_, i) => i !== colIdx)));
	};

	const handleHeaderChange = (colIdx: number, value: string) => {
		const newHeaders = [...headers];
		newHeaders[colIdx] = value;
		setHeaders(newHeaders);
	};

	const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
		const newRows = [...rows];
		newRows[rowIdx][colIdx] = value;
		setRows(newRows);
	};

	const toggleAlignment = (colIdx: number) => {
		const newAlignments = [...alignments];
		const current = newAlignments[colIdx];
		if (current === "left") newAlignments[colIdx] = "center";
		else if (current === "center") newAlignments[colIdx] = "right";
		else newAlignments[colIdx] = "left";
		setAlignments(newAlignments);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(markdownOutput);
		setCopied(true);
		toast.success("Markdown table copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		const blob = new Blob([markdownOutput], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "table.md";
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Downloaded table.md!");
	};

	const resetTable = () => {
		setHeaders(["Header 1", "Header 2", "Header 3"]);
		setAlignments(["left", "left", "left"]);
		setRows([
			["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
			["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
		]);
		toast.info("Reset to default 3x2 table.");
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			{/* Privacy Badge */}
			<div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
				<ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
				<span>100% Client-Side Generator: Edit spreadsheet rows and generate Markdown syntax in your browser with no network uploads.</span>
			</div>

			{/* Interactive Visual Table Editor */}
			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
							<TableIcon className="h-4 w-4" />
						</div>
						<div>
							<h3 className="text-base font-bold text-foreground">Table Visual Editor</h3>
							<p className="text-xs text-muted-foreground">{rows.length} Rows × {headers.length} Columns</p>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<Button size="sm" variant="outline" onClick={addColumn} className="h-8 text-xs gap-1 border-border/60">
							<Plus className="h-3.5 w-3.5" />
							Add Column
						</Button>
						<Button size="sm" variant="outline" onClick={addRow} className="h-8 text-xs gap-1 border-border/60">
							<Plus className="h-3.5 w-3.5" />
							Add Row
						</Button>
						<Button size="sm" variant="ghost" onClick={resetTable} className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground">
							<RefreshCw className="h-3.5 w-3.5" />
							Reset
						</Button>
					</div>
				</div>

				{/* Table Grid Scroll Container */}
				<div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/20">
					<table className="w-full border-collapse text-xs">
						<thead>
							<tr className="bg-muted/60 border-b border-border/60">
								<th className="p-2.5 text-center text-muted-foreground w-10 font-bold">#</th>
								{headers.map((header, colIdx) => (
									<th key={colIdx} className="p-2.5 min-w-[140px] text-left">
										<div className="flex items-center gap-1.5">
											<Input
												type="text"
												value={header}
												onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
												aria-label={`Column ${colIdx + 1} header`}
												className="h-7 text-xs font-bold bg-card border-border/60 focus-visible:ring-1"
											/>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => toggleAlignment(colIdx)}
												className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
												aria-label={`Toggle alignment: current ${alignments[colIdx]}`}
												title={`Align: ${alignments[colIdx]}`}
											>
												{alignments[colIdx] === "left" && <AlignLeft className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
												{alignments[colIdx] === "center" && <AlignCenter className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
												{alignments[colIdx] === "right" && <AlignRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
											</Button>
											<Button
												size="icon"
												variant="ghost"
												onClick={() => removeColumn(colIdx)}
												className="h-7 w-7 shrink-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
												aria-label={`Delete column ${colIdx + 1}`}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((row, rowIdx) => (
								<tr key={rowIdx} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
									<td className="p-2 text-center text-muted-foreground font-mono text-[11px] select-none">
										<div className="flex items-center justify-center gap-1">
											<span>{rowIdx + 1}</span>
											<button
												type="button"
												onClick={() => removeRow(rowIdx)}
												className="text-muted-foreground/40 hover:text-destructive transition-colors ml-1"
												title="Delete row"
											>
												<Trash2 className="h-3 w-3" />
											</button>
										</div>
									</td>
									{headers.map((_, colIdx) => (
										<td key={colIdx} className="p-2">
											<Input
												type="text"
												value={row[colIdx] || ""}
												onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
												aria-label={`Row ${rowIdx + 1}, Column ${colIdx + 1}`}
												className="h-7 text-xs bg-card/60 border-border/40 focus-visible:ring-1"
												placeholder="Value..."
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Markdown Code Output */}
			<div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Generated Markdown</h3>
					<div className="flex items-center gap-2">
						<Button size="sm" variant="outline" onClick={handleDownload} className="h-8 text-xs gap-1.5 rounded-lg border-border/60">
							<Download className="h-3.5 w-3.5" />
							Download .md
						</Button>
						<Button size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow-sm">
							{copied ? (
								<>
									<Check className="h-3.5 w-3.5" />
									<span>Copied!</span>
								</>
							) : (
								<>
									<Copy className="h-3.5 w-3.5" />
									<span>Copy Markdown</span>
								</>
							)}
						</Button>
					</div>
				</div>
				<pre className="p-4 rounded-xl bg-muted/60 border border-border/50 font-mono text-xs leading-relaxed text-foreground overflow-x-auto whitespace-pre">
					{markdownOutput}
				</pre>
			</div>
		</div>
	);
}
