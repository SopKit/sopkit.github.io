"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	ZapIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function HtmlMinifierTool() {
	const [input, setInput] = useState(`<!DOCTYPE html>
<html>
  <head>
    <!-- This is a comment to be stripped -->
    <title>SopKit HTML Minifier</title>
    <style>
      body {
        background-color: #ffffff;
        color: #333333;
      }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>
      Minifying your HTML code makes it load much faster.
    </p>
  </body>
</html>`);

	const [output, setOutput] = useState("");
	const [copied, setCopied] = useState(false);
	const [stats, setStats] = useState({ original: 0, minified: 0, reduction: 0 });

	const minifyHtml = (htmlStr: string) => {
		if (!htmlStr.trim()) {
			setOutput("");
			setStats({ original: 0, minified: 0, reduction: 0 });
			return;
		}

		let minified = htmlStr;

		// 1. Remove comments
		minified = minified.replace(/<!--[\s\S]*?-->/g, "");

		// 2. Remove script/style whitespaces carefully
		minified = minified.replace(/\s+/g, " ");

		// 3. Remove space between tags
		minified = minified.replace(/>\s+</g, "><");

		// 4. Trim layout
		minified = minified.trim();

		setOutput(minified);

		const origSize = new Blob([htmlStr]).size;
		const miniSize = new Blob([minified]).size;
		const reduction = origSize > 0 ? Math.round(((origSize - miniSize) / origSize) * 100) : 0;

		setStats({
			original: origSize,
			minified: miniSize,
			reduction: Math.max(0, reduction)
		});
	};

	useEffect(() => {
		minifyHtml(input);
	}, [input]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(output);
		setCopied(true);
		toast.success("Minified HTML code copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="space-y-6">
			{/* Stats Dashboard */}
			{stats.original > 0 && (
				<div className="grid grid-cols-3 gap-4">
					<GlassCard className="p-4 text-center">
						<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Original Size</span>
						<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{stats.original} B</p>
					</GlassCard>
					<GlassCard className="p-4 text-center border-primary/20">
						<span className="text-xs text-primary uppercase font-bold tracking-wider">Minified Size</span>
						<p className="text-lg md:text-2xl font-black mt-1 text-primary">{stats.minified} B</p>
					</GlassCard>
					<GlassCard className="p-4 text-center">
						<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Reduction</span>
						<p className="text-lg md:text-2xl font-black mt-1 text-green-500">-{stats.reduction}%</p>
					</GlassCard>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
				{/* Input Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<CodeIcon className="h-4 w-4" />
							<span>Raw HTML Input</span>
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
						placeholder="Paste your raw HTML code here..."
					/>
				</GlassCard>

				{/* Output Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
							<ZapIcon className="h-4 w-4 text-primary" />
							<span>Minified HTML Output</span>
						</div>
						<Button 
							size="sm" 
							onClick={copyToClipboard}
							disabled={!output}
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
					<textarea
						readOnly
						value={output}
						className="flex-grow w-full min-h-[300px] p-4 bg-muted/20 border border-border/20 rounded-2xl font-mono text-sm leading-relaxed text-foreground focus:outline-none"
						placeholder="Minified output will appear here..."
					/>
				</GlassCard>
			</div>
		</div>
	);
}
