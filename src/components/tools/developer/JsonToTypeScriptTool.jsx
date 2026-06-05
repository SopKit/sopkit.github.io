"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	BracesIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function JsonToTypeScriptTool() {
	const [jsonInput, setJsonInput] = useState(JSON.stringify({
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		isActive: true,
		role: "developer",
		profile: {
			avatar: "https://example.com/avatar.jpg",
			bio: "Code enthusiast",
			skills: ["React", "TypeScript", "Node.js"]
		},
		projects: [
			{ id: 101, name: "SopKit Portfolio", status: "completed" },
			{ id: 102, name: "Cloud Dashboard", status: "in-progress" }
		]
	}, null, 2));

	const [tsOutput, setTsOutput] = useState("");
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");

	const convertJsonToTs = (jsonStr) => {
		if (!jsonStr.trim()) {
			setTsOutput("");
			setError("");
			return;
		}

		try {
			const parsed = JSON.parse(jsonStr);
			setError("");

			const interfaces = [];
			const seenNames = new Set();

			function capitalize(s) {
				return s.charAt(0).toUpperCase() + s.slice(1).replace(/[^a-zA-Z0-9]/g, "");
			}

			function getTypeName(val, keyName) {
				if (val === null) return "any";
				if (Array.isArray(val)) {
					if (val.length === 0) return "any[]";
					const typeOfFirst = typeof val[0];
					if (typeOfFirst === "object" && val[0] !== null) {
						const subName = capitalize(keyName) + "Item";
						generateInterface(val[0], subName);
						return `${subName}[]`;
					}
					return `${typeOfFirst}[]`;
				}
				if (typeof val === "object") {
					const subName = capitalize(keyName);
					generateInterface(val, subName);
					return subName;
				}
				return typeof val;
			}

			function generateInterface(obj, interfaceName) {
				if (seenNames.has(interfaceName)) return;
				seenNames.add(interfaceName);

				let code = `export interface ${interfaceName} {\n`;
				for (const key of Object.keys(obj)) {
					const cleanKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
					const typeStr = getTypeName(obj[key], key);
					code += `  ${cleanKey}: ${typeStr};\n`;
				}
				code += "}\n";
				interfaces.push(code);
			}

			generateInterface(parsed, "RootObject");
			setTsOutput(interfaces.reverse().join("\n"));
		} catch (err) {
			setError(err.message);
			setTsOutput("");
		}
	};

	useEffect(() => {
		convertJsonToTs(jsonInput);
	}, [jsonInput]);

	const copyToClipboard = () => {
		if (!tsOutput) return;
		navigator.clipboard.writeText(tsOutput);
		setCopied(true);
		toast.success("TypeScript interfaces copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setJsonInput("");
		setTsOutput("");
		setError("");
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in">
			<div className="flex justify-between items-center px-4">
				<h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
					<BracesIcon className="w-5 h-5 text-primary" />
					JSON to TypeScript Interface Converter
				</h3>
				<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
					<TrashIcon className="h-4 w-4 mr-2" />
					Clear
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* JSON Input */}
				<GlassCard className="p-6 flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg">JSON Input</span>
						<CodeIcon className="text-muted-foreground w-5 h-5" />
					</div>
					<textarea
						value={jsonInput}
						onChange={(e) => setJsonInput(e.target.value)}
						placeholder="Paste your JSON string here..."
						className="w-full h-[500px] bg-muted/20 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
					/>
					{error && (
						<div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
							Invalid JSON: {error}
						</div>
					)}
				</GlassCard>

				{/* TypeScript Output */}
				<GlassCard className="p-6 flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg">TypeScript Interfaces</span>
						<Badge variant="secondary">TS Definitions</Badge>
					</div>

					<div className="flex-1 min-h-[440px] max-h-[500px] overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-6 custom-scrollbar">
						{tsOutput ? (
							<pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all text-primary-foreground/90">
								<code>{tsOutput}</code>
							</pre>
						) : (
							<span className="text-muted-foreground text-sm italic">Valid TS output will appear here after typing JSON...</span>
						)}
					</div>

					<div className="mt-6 flex justify-end">
						<Button
							onClick={copyToClipboard}
							disabled={!tsOutput}
							className="h-14 px-8 rounded-2xl font-bold bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 w-full sm:w-auto"
						>
							{copied ? (
								<>
									<CheckCircleIcon className="w-5 h-5" />
									COPIED!
								</>
							) : (
								<>
									<CopyIcon className="w-5 h-5" />
									COPY INTERFACES
								</>
							)}
						</Button>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
