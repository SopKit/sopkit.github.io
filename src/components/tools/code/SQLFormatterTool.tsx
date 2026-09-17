"use client";

import { Code, Copy, Database, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SQLFormatter() {
	const [sqlInput, setSqlInput] = useState("");
	const [formattedSql, setFormattedSql] = useState("");
	const [sqlDialect, setSqlDialect] = useState("standard");
	const [indentSize, setIndentSize] = useState("2");
	const [keywordCase, setKeywordCase] = useState("upper");

	const formatSQL = () => {
		if (!sqlInput.trim()) {
			toast.error("Please enter some SQL to format");
			return;
		}

		try {
			// Simple SQL formatter implementation
			let formatted = sqlInput;

			// Remove extra whitespace
			formatted = formatted.replace(/\s+/g, " ").trim();

			// Define SQL keywords
			const keywords = [
				"SELECT",
				"FROM",
				"WHERE",
				"JOIN",
				"INNER JOIN",
				"LEFT JOIN",
				"RIGHT JOIN",
				"FULL JOIN",
				"GROUP BY",
				"ORDER BY",
				"HAVING",
				"INSERT",
				"UPDATE",
				"DELETE",
				"CREATE",
				"ALTER",
				"DROP",
				"TABLE",
				"INDEX",
				"VIEW",
				"PROCEDURE",
				"FUNCTION",
				"TRIGGER",
				"DATABASE",
				"SCHEMA",
				"PRIMARY KEY",
				"FOREIGN KEY",
				"REFERENCES",
				"CONSTRAINT",
				"CHECK",
				"DEFAULT",
				"NULL",
				"NOT NULL",
				"UNIQUE",
				"AUTO_INCREMENT",
				"IF EXISTS",
				"IF NOT EXISTS",
				"CASE",
				"WHEN",
				"THEN",
				"ELSE",
				"END",
				"AS",
				"DISTINCT",
				"ALL",
				"UNION",
				"INTERSECT",
				"EXCEPT",
				"IN",
				"EXISTS",
				"BETWEEN",
				"LIKE",
				"AND",
				"OR",
				"NOT",
				"IS",
				"COUNT",
				"SUM",
				"AVG",
				"MIN",
				"MAX",
				"SUBSTRING",
				"CONCAT",
				"UPPER",
				"LOWER",
				"TRIM",
				"LENGTH",
			];

			// Apply keyword casing
			keywords.forEach((keyword) => {
				const regex = new RegExp(`\\b${keyword}\\b`, "gi");
				const replacement =
					keywordCase === "upper"
						? keyword.toUpperCase()
						: keyword.toLowerCase();
				formatted = formatted.replace(regex, replacement);
			});

			// Add line breaks and indentation
			const indent = " ".repeat(parseInt(indentSize, 10));

			// Major clauses on new lines
			const majorClauses = [
				"SELECT",
				"FROM",
				"WHERE",
				"GROUP BY",
				"ORDER BY",
				"HAVING",
				"UNION",
			];
			majorClauses.forEach((clause) => {
				const regex = new RegExp(`\\b${clause}\\b`, "gi");
				formatted = formatted.replace(regex, `\n${clause}`);
			});

			// JOIN clauses with indentation
			const joinTypes = [
				"JOIN",
				"INNER JOIN",
				"LEFT JOIN",
				"RIGHT JOIN",
				"FULL JOIN",
			];
			joinTypes.forEach((join) => {
				const regex = new RegExp(`\\b${join}\\b`, "gi");
				formatted = formatted.replace(regex, `\n${indent}${join}`);
			});

			// Subqueries and parentheses
			formatted = formatted.replace(/\(/g, `(\n${indent}`);
			formatted = formatted.replace(/\)/g, "\n)");

			// Clean up extra newlines and trim
			formatted = formatted.replace(/\n\s*\n/g, "\n").trim();

			// Split into lines and apply proper indentation
			const lines = formatted.split("\n");
			let indentLevel = 0;
			const formattedLines = lines.map((line) => {
				const trimmedLine = line.trim();
				if (!trimmedLine) return "";

				// Decrease indent for closing parentheses
				if (trimmedLine.startsWith(")")) {
					indentLevel = Math.max(0, indentLevel - 1);
				}

				const indentedLine = indent.repeat(indentLevel) + trimmedLine;

				// Increase indent for opening parentheses
				if (trimmedLine.includes("(") && !trimmedLine.includes(")")) {
					indentLevel++;
				}

				return indentedLine;
			});

			setFormattedSql(formattedLines.join("\n"));
			toast.success("SQL formatted successfully!");
		} catch (error) {
			console.error("Error formatting SQL:", error);
			toast.error("Failed to format SQL. Please check your syntax.");
		}
	};

	const copyToClipboard = async () => {
		if (!formattedSql) {
			toast.error("No formatted SQL to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(formattedSql);
			toast.success("Formatted SQL copied to clipboard!");
		} catch (error) {
			console.error("Failed to copy:", error);
			toast.error("Failed to copy to clipboard");
		}
	};

	const downloadSQL = () => {
		if (!formattedSql) {
			toast.error("No formatted SQL to download");
			return;
		}

		const blob = new Blob([formattedSql], { type: "text/sql" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "formatted_query.sql";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success("SQL file downloaded!");
	};

	const clearAll = () => {
		setSqlInput("");
		setFormattedSql("");
	};

	const loadSample = () => {
		const sampleSQL = `select u.id, u.name, u.email, p.title from users u left join posts p on u.id = p.user_id where u.active = 1 and p.published_at is not null order by p.created_at desc`;
		setSqlInput(sampleSQL);
	};

	return (
		<div className="max-w-5xl mx-auto space-y-5">
			{/* Studio Controls Header Bar */}
			<Card className="border-border/60 shadow-sm">
				<CardContent className="p-3.5 sm:p-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-3">
							{/* Dialect */}
							<div className="flex items-center gap-1.5">
								<Label htmlFor="dialect" className="text-xs text-muted-foreground whitespace-nowrap">
									Dialect:
								</Label>
								<Select value={sqlDialect} onValueChange={setSqlDialect}>
									<SelectTrigger className="h-8 text-xs w-[130px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="standard">Standard SQL</SelectItem>
										<SelectItem value="mysql">MySQL</SelectItem>
										<SelectItem value="postgresql">PostgreSQL</SelectItem>
										<SelectItem value="mssql">SQL Server</SelectItem>
										<SelectItem value="oracle">Oracle</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Indentation */}
							<div className="flex items-center gap-1.5">
								<Label htmlFor="indent" className="text-xs text-muted-foreground whitespace-nowrap">
									Indent:
								</Label>
								<Select value={indentSize} onValueChange={setIndentSize}>
									<SelectTrigger className="h-8 text-xs w-[100px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="2">2 spaces</SelectItem>
										<SelectItem value="4">4 spaces</SelectItem>
										<SelectItem value="8">8 spaces</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Keyword Case */}
							<div className="flex items-center gap-1.5">
								<Label htmlFor="case" className="text-xs text-muted-foreground whitespace-nowrap">
									Keywords:
								</Label>
								<Select value={keywordCase} onValueChange={setKeywordCase}>
									<SelectTrigger className="h-8 text-xs w-[110px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="upper">UPPERCASE</SelectItem>
										<SelectItem value="lower">lowercase</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center gap-2 ml-auto">
							<Button onClick={loadSample} variant="outline" size="sm" className="h-8 text-xs">
								Sample
							</Button>
							{sqlInput && (
								<Button onClick={clearAll} variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">
									Clear
								</Button>
							)}
							<Button
								onClick={formatSQL}
								disabled={!sqlInput.trim()}
								size="sm"
								className="h-8 text-xs font-semibold px-4"
							>
								<Code className="w-3.5 h-3.5 mr-1.5" />
								Format SQL
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Dual-Pane Code Editor Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Input Pane */}
				<Card className="border-border/60 shadow-sm flex flex-col">
					<CardHeader className="py-2.5 px-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
						<div className="flex items-center gap-2">
							<Database className="w-4 h-4 text-primary" />
							<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Input Query
							</span>
						</div>
						<span className="text-[11px] text-muted-foreground font-mono">
							{sqlInput.length} chars
						</span>
					</CardHeader>
					<CardContent className="p-0 flex-1">
						<Textarea
							placeholder="Paste raw, minified, or unformatted SQL query here..."
							value={sqlInput}
							onChange={(e) => setSqlInput(e.target.value)}
							className="min-h-[360px] h-full font-mono text-xs p-4 rounded-none border-0 resize-none focus-visible:ring-0 leading-relaxed bg-transparent"
						/>
					</CardContent>
				</Card>

				{/* Output Pane */}
				<Card className="border-border/60 shadow-sm flex flex-col">
					<CardHeader className="py-2.5 px-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
						<div className="flex items-center gap-2">
							<Code className="w-4 h-4 text-emerald-500" />
							<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Beautified SQL
							</span>
						</div>
						{formattedSql && (
							<div className="flex items-center gap-1.5">
								<Button
									size="sm"
									variant="ghost"
									className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
									onClick={copyToClipboard}
									title="Copy SQL"
								>
									<Copy className="w-3.5 h-3.5 mr-1" />
									Copy
								</Button>
								<Button
									size="sm"
									variant="ghost"
									className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
									onClick={downloadSQL}
									title="Download .sql"
								>
									<Download className="w-3.5 h-3.5" />
								</Button>
							</div>
						)}
					</CardHeader>
					<CardContent className="p-0 flex-1 relative bg-muted/20">
						<Textarea
							value={formattedSql}
							readOnly
							placeholder="Click 'Format SQL' to beautify your query..."
							className="min-h-[360px] h-full font-mono text-xs p-4 rounded-none border-0 resize-none focus-visible:ring-0 leading-relaxed bg-transparent"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
