"use client";

import React, { useState, useEffect } from "react";
import { 
	CodeIcon, 
	EyeIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon,
	FileTextIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { toast } from "sonner";

export default function MarkdownToHtmlTool() {
	const [markdown, setMarkdown] = useState(`# Live Markdown Editor

Write your markdown in the left panel to compile it to **HTML** in real-time.

## Key Features
- **Fast:** Fully local parsing.
- **Responsive:** Looks great on desktop and mobile.
- **Copy:** Copy raw HTML code with a single click.

### Simple Cheat Sheet
- Use \`#\` for headings
- Use \`**text**\` for bold
- Use \`*text*\` for italic
- Use \`- item\` for lists
- Use \`> quote\` for blockquotes
- Use \\\`code\\\` for inline code
`);

	const [html, setHtml] = useState("");
	const [activeTab, setActiveTab] = useState("preview"); // preview or code
	const [copied, setCopied] = useState(false);

	const compileMarkdown = (md) => {
		let rawHtml = md;

		// Escape basic HTML tags to prevent XSS
		rawHtml = rawHtml
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");

		// Code blocks
		rawHtml = rawHtml.replace(/```([\s\S]*?)```/g, (match, code) => {
			return `<pre className="bg-muted p-4 rounded-xl font-mono text-sm overflow-x-auto my-4 block"><code>${code.trim()}</code></pre>`;
		});

		// Headings
		rawHtml = rawHtml.replace(/^### (.*?)$/gm, '<h3 className="text-xl font-bold mt-6 mb-3 text-foreground">$1</h3>');
		rawHtml = rawHtml.replace(/^## (.*?)$/gm, '<h2 className="text-2xl font-black mt-8 mb-4 text-foreground border-b border-border/40 pb-2">$1</h2>');
		rawHtml = rawHtml.replace(/^# (.*?)$/gm, '<h1 className="text-3xl font-black mt-10 mb-6 text-foreground">$1</h1>');

		// Bold & Italic
		rawHtml = rawHtml.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
		rawHtml = rawHtml.replace(/\*(.*?)\*/g, "<em>$1</em>");

		// Inline code
		rawHtml = rawHtml.replace(/`([^`]+)`/g, '<code className="bg-muted px-2 py-0.5 rounded font-mono text-sm text-primary">$1</code>');

		// Blockquotes
		rawHtml = rawHtml.replace(/^> (.*?)$/gm, '<blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">$1</blockquote>');

		// Lists
		rawHtml = rawHtml.replace(/^\- (.*?)$/gm, '<li className="ml-6 list-disc text-muted-foreground my-1">$1</li>');
		rawHtml = rawHtml.replace(/^\* (.*?)$/gm, '<li className="ml-6 list-disc text-muted-foreground my-1">$1</li>');

		// Handle paragraphs (anything not wrapped in structural tags, split by double line breaks)
		const lines = rawHtml.split(/\n{2,}/);
		rawHtml = lines.map(line => {
			const trimmed = line.trim();
			if (
				trimmed.startsWith("<h") || 
				trimmed.startsWith("<li") || 
				trimmed.startsWith("<pre") || 
				trimmed.startsWith("<block") ||
				trimmed === ""
			) {
				return line;
			}
			return `<p className="my-4 text-muted-foreground leading-relaxed">${line.replace(/\n/g, "<br>")}</p>`;
		}).join("\n");

		setHtml(rawHtml);
	};

	useEffect(() => {
		compileMarkdown(markdown);
	}, [markdown]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(html);
		setCopied(true);
		toast.success("HTML code copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearEditor = () => {
		setMarkdown("");
	};

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8 pb-24 animate-in">
			<div className="flex justify-between items-center px-4">
				<h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
					<FileTextIcon className="w-5 h-5 text-primary" />
					Markdown to HTML Converter
				</h3>
				<Button variant="ghost" size="sm" onClick={clearEditor} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
					<TrashIcon className="h-4 w-4 mr-2" />
					Clear
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Markdown Input */}
				<GlassCard className="p-6">
					<div className="flex justify-between items-center mb-4">
						<span className="font-bold text-lg">Markdown Input</span>
						<Badge variant="secondary">Editor</Badge>
					</div>
					<textarea
						value={markdown}
						onChange={(e) => setMarkdown(e.target.value)}
						placeholder="Write or paste your markdown here..."
						className="w-full h-[500px] bg-muted/20 border border-border/40 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 custom-scrollbar resize-none"
					/>
				</GlassCard>

				{/* Compiled Preview / Code Output */}
				<GlassCard className="p-6 flex flex-col">
					<div className="flex justify-between items-center mb-6">
						<span className="font-bold text-lg">HTML Output</span>
						<div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/40">
							<Button 
								variant={activeTab === "preview" ? "default" : "ghost"} 
								size="sm" 
								onClick={() => setActiveTab("preview")}
								className="rounded-lg font-bold"
							>
								<EyeIcon className="w-4 h-4 mr-2" />
								Preview
							</Button>
							<Button 
								variant={activeTab === "code" ? "default" : "ghost"} 
								size="sm" 
								onClick={() => setActiveTab("code")}
								className="rounded-lg font-bold"
							>
								<CodeIcon className="w-4 h-4 mr-2" />
								Code
							</Button>
						</div>
					</div>

					<div className="flex-1 min-h-[440px] max-h-[440px] overflow-y-auto bg-muted/10 border border-border/40 rounded-2xl p-6 custom-scrollbar">
						{activeTab === "preview" ? (
							<div 
								dangerouslySetInnerHTML={{ __html: html }}
								className="prose prose-invert max-w-none text-muted-foreground"
							/>
						) : (
							<pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
								<code>{html}</code>
							</pre>
						)}
					</div>

					<div className="mt-6 flex justify-end">
						<Button
							onClick={copyToClipboard}
							className="h-14 px-8 rounded-2xl font-bold bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
						>
							{copied ? (
								<>
									<CheckCircleIcon className="w-5 h-5" />
									COPIED!
								</>
							) : (
								<>
									<CopyIcon className="w-5 h-5" />
									COPY HTML CODE
								</>
							)}
						</Button>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
