"use client";

import React, { useState, useEffect } from "react";
import { 
	DatabaseIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	DownloadIcon,
	PlayIcon,
	SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DIALECTS = [
	{ value: "sql", label: "Standard SQL" },
	{ value: "mysql", label: "MySQL" },
	{ value: "postgresql", label: "PostgreSQL" },
	{ value: "sqlite", label: "SQLite" },
	{ value: "mariadb", label: "MariaDB" },
	{ value: "tsql", label: "Transact-SQL (T-SQL)" },
	{ value: "plsql", label: "Oracle PL/SQL" },
	{ value: "db2", label: "IBM DB2" },
	{ value: "redshift", label: "Amazon Redshift" },
	{ value: "spark", label: "Spark SQL" },
	{ value: "bigquery", label: "Google BigQuery" },
];

const DEFAULT_SQL = `SELECT users.id, users.name, SUM(orders.total) AS total_spent, orders.created_at FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE orders.status = 'completed' AND orders.total > 100 GROUP BY users.id, users.name, orders.created_at ORDER BY total_spent DESC, orders.created_at ASC LIMIT 10;`;

export default function SQLFormatterTool() {
	const [sqlInput, setSqlInput] = useState(DEFAULT_SQL);
	const [sqlOutput, setSqlOutput] = useState("");
	const [dialect, setDialect] = useState("sql");
	const [indentSize, setIndentSize] = useState("2");
	const [keywordCase, setKeywordCase] = useState("upper");
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");
	const [libReady, setLibReady] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if ((window as any).sqlFormatter) {
				setLibReady(true);
			} else {
				const script = document.createElement("script");
				script.src = "https://cdn.jsdelivr.net/npm/sql-formatter@15.4.0/dist/sql-formatter.min.js";
				script.async = true;
				script.onload = () => setLibReady(true);
				script.onerror = () => {
					toast.error("Failed to load SQL formatter library. Please refresh.");
				};
				document.body.appendChild(script);
			}
		}
	}, []);

	const formatSql = () => {
		if (!sqlInput.trim()) {
			setSqlOutput("");
			setError("");
			return;
		}

		if (!libReady || !(window as any).sqlFormatter) {
			toast.error("Formatter library is still loading. Please wait a moment.");
			return;
		}

		try {
			setError("");
			const formatted = (window as any).sqlFormatter.format(sqlInput, {
				language: dialect,
				tabWidth: parseInt(indentSize, 10),
				keywordCase: keywordCase === "preserve" ? undefined : keywordCase,
			});
			setSqlOutput(formatted);
		} catch (err: any) {
			setError(err.message || "Failed to format SQL query. Check syntax.");
			setSqlOutput("");
		}
	};

	useEffect(() => {
		if (libReady) {
			formatSql();
		}
	}, [sqlInput, dialect, indentSize, keywordCase, libReady]);

	const copyToClipboard = () => {
		if (!sqlOutput) return;
		navigator.clipboard.writeText(sqlOutput);
		setCopied(true);
		toast.success("SQL copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setSqlInput("");
		setSqlOutput("");
		setError("");
	};

	const downloadSql = () => {
		if (!sqlOutput) return;
		const blob = new Blob([sqlOutput], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `formatted_query.sql`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in">
			<div className="flex justify-between items-center px-4">
				<h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
					<DatabaseIcon className="w-5 h-5 text-primary" />
					SQL Formatter & Beautifier
				</h3>
				<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
					<TrashIcon className="h-4 w-4 mr-2" />
					Clear
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Settings panel */}
				<div className="lg:col-span-3">
					<GlassCard className="p-6 space-y-6">
						<div className="flex items-center gap-2 font-bold text-lg border-b pb-3">
							<SettingsIcon className="w-4 h-4 text-primary" />
							Format Options
						</div>

						{/* SQL Dialect selection */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-muted-foreground uppercase">SQL Dialect</label>
							<Select value={dialect} onValueChange={setDialect}>
								<SelectTrigger className="w-full bg-muted/40 border-border/40 rounded-xl">
									<SelectValue placeholder="Select Dialect" />
								</SelectTrigger>
								<SelectContent>
									{DIALECTS.map((d) => (
										<SelectItem key={d.value} value={d.value}>
											{d.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Indentation selection */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-muted-foreground uppercase">Indentation</label>
							<Select value={indentSize} onValueChange={setIndentSize}>
								<SelectTrigger className="w-full bg-muted/40 border-border/40 rounded-xl">
									<SelectValue placeholder="Select Indentation" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2">2 Spaces</SelectItem>
									<SelectItem value="4">4 Spaces</SelectItem>
									<SelectItem value="8">8 Spaces</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Keyword Casing selection */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-muted-foreground uppercase">Keyword Case</label>
							<Select value={keywordCase} onValueChange={setKeywordCase}>
								<SelectTrigger className="w-full bg-muted/40 border-border/40 rounded-xl">
									<SelectValue placeholder="Keyword Case" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="upper">UPPERCASE</SelectItem>
									<SelectItem value="lower">lowercase</SelectItem>
									<SelectItem value="preserve">Preserve Case</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="pt-2">
							<Button onClick={formatSql} disabled={!sqlInput.trim()} className="w-full rounded-xl bg-primary hover:scale-102 transition-all font-bold gap-2">
								<PlayIcon className="w-4 h-4" />
								Format SQL
							</Button>
						</div>
					</GlassCard>
				</div>

				{/* Inputs & Outputs panel */}
				<div className="lg:col-span-9 space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* SQL Input */}
						<GlassCard className="p-6 flex flex-col">
							<div className="flex justify-between items-center mb-4">
								<span className="font-bold text-lg">SQL Input</span>
								<Badge variant="secondary">Raw SQL</Badge>
							</div>
							<textarea
								value={sqlInput}
								onChange={(e) => setSqlInput(e.target.value)}
								placeholder="Paste your SQL statement here..."
								className="w-full h-[450px] bg-muted/20 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
							/>
							{error && (
								<div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono max-h-24 overflow-y-auto">
									Error: {error}
								</div>
							)}
						</GlassCard>

						{/* SQL Output */}
						<GlassCard className="p-6 flex flex-col">
							<div className="flex justify-between items-center mb-4">
								<span className="font-bold text-lg">Formatted Result</span>
								<Badge variant="outline">Beautified</Badge>
							</div>

							<div className="flex-1 min-h-[380px] max-h-[450px] overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-6 custom-scrollbar">
								{sqlOutput ? (
									<pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all text-primary-foreground/90">
										<code>{sqlOutput}</code>
									</pre>
								) : (
									<span className="text-muted-foreground text-sm italic">Formatted SQL output will appear here...</span>
								)}
							</div>

							<div className="mt-6 flex gap-4">
								<Button
									onClick={copyToClipboard}
									disabled={!sqlOutput}
									className="flex-1 h-12 rounded-2xl font-bold bg-primary hover:scale-102 active:scale-98 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
								>
									{copied ? (
										<>
											<CheckCircleIcon className="w-5 h-5" />
											COPIED!
										</>
									) : (
										<>
											<CopyIcon className="w-5 h-5" />
											COPY SQL
										</>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={downloadSql}
									disabled={!sqlOutput}
									className="h-12 w-12 rounded-2xl border border-border/40 flex items-center justify-center hover:bg-muted/40"
									title="Download SQL File"
								>
									<DownloadIcon className="w-5 h-5" />
								</Button>
							</div>
						</GlassCard>
					</div>
				</div>
			</div>
		</div>
	);
}
