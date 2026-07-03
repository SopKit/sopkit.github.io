"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	ZapIcon,
	Loader2Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function JsonToYamlTool() {
	const [input, setInput] = useState(`{
  "title": "SopKit JSON Converter",
  "version": "1.0.0",
  "enabled": true,
  "tags": [
    "developer",
    "tools",
    "seo"
  ],
  "author": {
    "name": "Antigravity",
    "github": "SopKit"
  }
}`);

	const [output, setOutput] = useState("");
	const [copied, setCopied] = useState(false);
	const [libLoaded, setLibLoaded] = useState(false);

	useEffect(() => {
		if (!window.jsyaml) {
			const script = document.createElement("script");
			script.src = "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js";
			script.async = true;
			script.onload = () => {
				setLibLoaded(true);
				convertJson(input);
			};
			script.onerror = () => {
				toast.error("Failed to load YAML parsing engine.");
			};
			document.head.appendChild(script);
		} else {
			setLibLoaded(true);
			convertJson(input);
		}
	}, []);

	const convertJson = (jsonStr: string) => {
		if (!jsonStr.trim()) {
			setOutput("");
			return;
		}

		if (!window.jsyaml) return;

		try {
			const parsed = JSON.parse(jsonStr);
			const yamlDump = window.jsyaml.dump(parsed);
			setOutput(yamlDump);
		} catch (err: any) {
			setOutput(`Error parsing JSON: ${err.message}`);
		}
	};

	useEffect(() => {
		if (libLoaded) {
			convertJson(input);
		}
	}, [input, libLoaded]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("YAML output copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* JSON Input Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<CodeIcon className="h-4 w-4" />
							<span>JSON Input</span>
						</div>
						<Button 
							variant="ghost" 
							size="icon" 
							onClick={() => setInput("")}
							className="h-8 w-8 text-muted-foreground hover:text-destructive"
						>
							<TrashIcon className="h-4 w-4" />
						</Button>
					</div>
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-grow w-full min-h-[300px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
						placeholder="Paste your JSON string here..."
					/>
				</GlassCard>

				{/* YAML Output Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<ZapIcon className="h-4 w-4 text-primary" />
							<span>YAML Output</span>
						</div>
						<Button 
							size="sm" 
							onClick={copyToClipboard}
							disabled={!output || output.startsWith("Error")}
							className="gap-1.5"
						>
							{copied ? (
								<CheckCircleIcon className="h-4 w-4 text-green-400" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
							{copied ? "Copied" : "Copy Result"}
						</Button>
					</div>
					{!libLoaded ? (
						<div className="flex-grow flex items-center justify-center min-h-[300px]">
							<Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
						</div>
					) : (
						<textarea
							readOnly
							value={output}
							className={`flex-grow w-full min-h-[300px] p-4 bg-muted/20 border border-border/20 rounded-2xl font-mono text-sm leading-relaxed focus:outline-none ${
								output.startsWith("Error") ? "text-destructive" : "text-foreground"
							}`}
							placeholder="YAML output will appear here..."
						/>
					)}
				</GlassCard>
			</div>
		</div>
	);
}
