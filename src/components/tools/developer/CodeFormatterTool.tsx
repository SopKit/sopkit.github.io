"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
	Code2Icon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	DownloadIcon,
	PlayIcon,
	SettingsIcon,
	FileCode2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const LANGUAGES = [
	{ value: "json", label: "JSON" },
	{ value: "xml", label: "XML" },
	{ value: "sql", label: "SQL" },
	{ value: "html", label: "HTML" },
	{ value: "css", label: "CSS" },
	{ value: "javascript", label: "JavaScript (JS)" },
];

const DIALECTS = [
	{ value: "sql", label: "Standard SQL" },
	{ value: "mysql", label: "MySQL" },
	{ value: "postgresql", label: "PostgreSQL" },
	{ value: "sqlite", label: "SQLite" },
	{ value: "mariadb", label: "MariaDB" },
	{ value: "tsql", label: "Transact-SQL" },
	{ value: "plsql", label: "Oracle PL/SQL" },
];

const SAMPLES: Record<string, string> = {
	json: `{"name":"John Doe","age":30,"city":"New York","hobbies":["reading","coding"],"address":{"street":"123 Main St","zip":10001}}`,
	xml: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><price>44.95</price></book></catalog>`,
	sql: `SELECT users.id, users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 ORDER BY orders.total DESC;`,
	html: `<!DOCTYPE html><html><head><title>Test Page</title></head><body><div id="main"><h1>Hello World</h1><p>This is a <b>formatted</b> markup code.</p></div></body></html>`,
	css: `body{background-color:#f0f2f5;color:#1c1e21;font-family:sans-serif;}#main{max-width:800px;margin:0 auto;padding:20px;border-radius:8px;}`,
	javascript: `function greet(user){const msg="Hello, "+user+"!";console.log(msg);return msg;}greet("SopKit");`,
};

export default function CodeFormatterTool() {
	const [language, setLanguage] = useState("json");
	const [inputCode, setInputCode] = useState(SAMPLES.json);
	const [outputCode, setOutputCode] = useState("");
	const [indentSize, setIndentSize] = useState("2");
	const [sqlDialect, setSqlDialect] = useState("sql");
	const [sqlKeywordCase, setSqlKeywordCase] = useState("upper");
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");
	const [libsLoaded, setLibsLoaded] = useState<Record<string, boolean>>({
		sql: false,
		jsbeautify: false,
	});

	// Inject external CDNs dynamically depending on chosen language
	useEffect(() => {
		if (typeof window === "undefined") return;

		const loadScript = (src: string, key: string, globalCheck: string) => {
			if ((window as any)[globalCheck]) {
				setLibsLoaded(prev => ({ ...prev, [key]: true }));
				return;
			}
			const script = document.createElement("script");
			script.src = src;
			script.async = true;
			script.onload = () => {
				setLibsLoaded(prev => ({ ...prev, [key]: true }));
			};
			script.onerror = () => {
				toast.error(`Failed to load ${key} formatter engine.`);
			};
			document.body.appendChild(script);
		};

		if (language === "sql" && !libsLoaded.sql) {
			loadScript(
				"https://cdn.jsdelivr.net/npm/sql-formatter@15.4.0/dist/sql-formatter.min.js",
				"sql",
				"sqlFormatter"
			);
		} else if (["html", "css", "javascript"].includes(language) && !libsLoaded.jsbeautify) {
			// Load core beautify, then CSS & HTML beautifier scripts
			if (!(window as any).js_beautify) {
				const mainScript = document.createElement("script");
				mainScript.src = "https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/js/lib/beautify.min.js";
				mainScript.async = true;
				mainScript.onload = () => {
					// Load css & html beautifier scripts sequentially
					const cssScript = document.createElement("script");
					cssScript.src = "https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/js/lib/beautify-css.min.js";
					cssScript.async = true;
					document.body.appendChild(cssScript);

					const htmlScript = document.createElement("script");
					htmlScript.src = "https://cdn.jsdelivr.net/npm/js-beautify@1.15.1/js/lib/beautify-html.min.js";
					htmlScript.async = true;
					htmlScript.onload = () => {
						setLibsLoaded(prev => ({ ...prev, jsbeautify: true }));
					};
					document.body.appendChild(htmlScript);
				};
				document.body.appendChild(mainScript);
			} else {
				setLibsLoaded(prev => ({ ...prev, jsbeautify: true }));
			}
		}
	}, [language, libsLoaded]);

	const formatCode = useCallback(() => {
		if (!inputCode.trim()) {
			setOutputCode("");
			setError("");
			return;
		}

		const indent = " ".repeat(parseInt(indentSize, 10));

		try {
			setError("");
			let formatted = "";

			if (language === "json") {
				const parsed = JSON.parse(inputCode);
				formatted = JSON.stringify(parsed, null, parseInt(indentSize, 10));
			} else if (language === "xml") {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(inputCode, "application/xml");
				const parserError = xmlDoc.querySelector("parsererror");
				if (parserError) {
					throw new Error(parserError.textContent || "Invalid XML Structure");
				}
				// Basic XML formatting
				let cleanXml = inputCode.replace(/>\s*</g, "><").trim();
				let pad = 0;
				const reg = /(>)(<)(\/*)/g;
				cleanXml = cleanXml.replace(reg, "$1\r\n$2$3");
				const lines = cleanXml.split("\r\n");
				let result = "";
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i].trim();
					if (!line) continue;

					let indentLevel = 0;
					if (line.match(/.+<\/\w[^>]*>$/)) {
						indentLevel = 0;
					} else if (line.match(/^<\/\w/)) {
						if (pad !== 0) pad -= 1;
					} else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
						indentLevel = 1;
					} else {
						indentLevel = 0;
					}

					let padding = " ".repeat(pad * parseInt(indentSize, 10));
					result += padding + line + "\n";
					pad += indentLevel;
				}
				formatted = result.trim();
			} else if (language === "sql") {
				if (!(window as any).sqlFormatter) {
					setError("SQL Formatting Engine is loading...");
					return;
				}
				formatted = (window as any).sqlFormatter.format(inputCode, {
					language: sqlDialect,
					tabWidth: parseInt(indentSize, 10),
					keywordCase: sqlKeywordCase === "preserve" ? undefined : sqlKeywordCase,
				});
			} else if (language === "html") {
				if (!(window as any).html_beautify) {
					setError("HTML Beautify Engine is loading...");
					return;
				}
				formatted = (window as any).html_beautify(inputCode, {
					indent_size: parseInt(indentSize, 10),
					wrap_line_length: 80,
				});
			} else if (language === "css") {
				if (!(window as any).css_beautify) {
					setError("CSS Beautify Engine is loading...");
					return;
				}
				formatted = (window as any).css_beautify(inputCode, {
					indent_size: parseInt(indentSize, 10),
				});
			} else if (language === "javascript") {
				if (!(window as any).js_beautify) {
					setError("JavaScript Beautify Engine is loading...");
					return;
				}
				formatted = (window as any).js_beautify(inputCode, {
					indent_size: parseInt(indentSize, 10),
				});
			}

			setOutputCode(formatted);
		} catch (err: any) {
			setError(err.message || "Failed to format code. Check syntax.");
			setOutputCode("");
		}
	}, [inputCode, language, indentSize, sqlDialect, sqlKeywordCase]);

	useEffect(() => {
		formatCode();
	}, [inputCode, language, indentSize, sqlDialect, sqlKeywordCase, formatCode, libsLoaded]);

	const handleLanguageChange = (lang: string) => {
		setLanguage(lang);
		setInputCode(SAMPLES[lang] || "");
		setOutputCode("");
		setError("");
	};

	const copyToClipboard = () => {
		if (!outputCode) return;
		navigator.clipboard.writeText(outputCode);
		setCopied(true);
		toast.success("Code copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setInputCode("");
		setOutputCode("");
		setError("");
	};

	const downloadCode = () => {
		if (!outputCode) return;
		const extensions: Record<string, string> = {
			json: "json",
			xml: "xml",
			sql: "sql",
			html: "html",
			css: "css",
			javascript: "js",
		};
		const ext = extensions[language] || "txt";
		const blob = new Blob([outputCode], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `formatted_code.${ext}`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in">
			<div className="flex justify-between items-center px-4">
				<h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
					<Code2Icon className="w-5 h-5 text-primary" />
					Multi-Language Code Formatter
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

						{/* Language selection */}
						<div className="space-y-2">
							<label className="text-xs font-bold text-muted-foreground uppercase">Language</label>
							<Select value={language} onValueChange={handleLanguageChange}>
								<SelectTrigger className="w-full bg-muted/40 border-border/40 rounded-xl">
									<SelectValue placeholder="Select Language" />
								</SelectTrigger>
								<SelectContent>
									{LANGUAGES.map((l) => (
										<SelectItem key={l.value} value={l.value}>
											{l.label}
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

						{/* SQL Specific Dialect */}
						{language === "sql" && (
							<>
								<div className="space-y-2 animate-in fade-in">
									<label className="text-xs font-bold text-muted-foreground uppercase">SQL Dialect</label>
									<Select value={sqlDialect} onValueChange={setSqlDialect}>
										<SelectTrigger className="w-full bg-muted/40 border-border/40 rounded-xl">
											<SelectValue placeholder="SQL Dialect" />
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

								<div className="space-y-2 animate-in fade-in">
									<label className="text-xs font-bold text-muted-foreground uppercase">Keyword Case</label>
									<Select value={sqlKeywordCase} onValueChange={setSqlKeywordCase}>
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
							</>
						)}

						<div className="pt-2">
							<Button onClick={formatCode} disabled={!inputCode.trim()} className="w-full rounded-xl bg-primary hover:scale-102 transition-all font-bold gap-2">
								<PlayIcon className="w-4 h-4" />
								Format Code
							</Button>
						</div>
					</GlassCard>
				</div>

				{/* Inputs & Outputs panel */}
				<div className="lg:col-span-9 space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Code Input */}
						<GlassCard className="p-6 flex flex-col">
							<div className="flex justify-between items-center mb-4">
								<span className="font-bold text-lg">Source Code</span>
								<Badge variant="secondary">
									<FileCode2Icon className="w-3.5 h-3.5 mr-1 inline" />
									{LANGUAGES.find(l => l.value === language)?.label}
								</Badge>
							</div>
							<textarea
								value={inputCode}
								onChange={(e) => setInputCode(e.target.value)}
								placeholder={`Paste your ${language.toUpperCase()} code here...`}
								className="w-full h-[450px] bg-muted/20 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
							/>
							{error && (
								<div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono max-h-24 overflow-y-auto">
									{error}
								</div>
							)}
						</GlassCard>

						{/* Code Output */}
						<GlassCard className="p-6 flex flex-col">
							<div className="flex justify-between items-center mb-4">
								<span className="font-bold text-lg">Formatted Result</span>
								<Badge variant="outline">Beautified</Badge>
							</div>

							<div className="flex-1 min-h-[380px] max-h-[450px] overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-6 custom-scrollbar">
								{outputCode ? (
									<pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all text-primary-foreground/90">
										<code>{outputCode}</code>
									</pre>
								) : (
									<span className="text-muted-foreground text-sm italic">Formatted output will appear here...</span>
								)}
							</div>

							<div className="mt-6 flex gap-4">
								<Button
									onClick={copyToClipboard}
									disabled={!outputCode}
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
											COPY CODE
										</>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={downloadCode}
									disabled={!outputCode}
									className="h-12 w-12 rounded-2xl border border-border/40 flex items-center justify-center hover:bg-muted/40"
									title="Download Formatted File"
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
