"use client";

import { useState, useEffect, useRef } from "react";
import { Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbedWidgetGiverProps {
	toolId: string;
	toolName: string;
}

export function EmbedWidgetGiver({ toolId, toolName }: EmbedWidgetGiverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const codeRef = useRef<HTMLElement>(null);

	const embedCode = `<iframe src="https://sopkit.github.io/embed-tool/?id=${toolId}" width="100%" height="550" style="border:0; border-radius:12px; overflow:hidden;" title="Free Local ${toolName} by SopKit"></iframe>`;

	const handleCopy = () => {
		navigator.clipboard.writeText(embedCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	useEffect(() => {
		if (!isOpen) return;

		// Load Prism CSS
		if (!document.getElementById("prism-css")) {
			const link = document.createElement("link");
			link.id = "prism-css";
			link.rel = "stylesheet";
			link.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
			document.head.appendChild(link);
		}

		// Load Prism Core + Markup component
		if (!document.getElementById("prism-js")) {
			const script = document.createElement("script");
			script.id = "prism-js";
			script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js";
			script.onload = () => {
				const markupScript = document.createElement("script");
				markupScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js";
				markupScript.onload = () => {
					if ((window as any).Prism && codeRef.current) {
						(window as any).Prism.highlightElement(codeRef.current);
					}
				};
				document.head.appendChild(markupScript);
			};
			document.head.appendChild(script);
		} else {
			setTimeout(() => {
				if ((window as any).Prism && codeRef.current) {
					(window as any).Prism.highlightElement(codeRef.current);
				}
			}, 50);
		}
	}, [isOpen]);

	return (
		<section className="max-w-2xl mx-auto p-6 border border-border/40 bg-card/20 rounded-2xl space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="space-y-1">
					<h3 className="text-base font-bold flex items-center gap-2">
						<Code className="h-4.5 w-4.5 text-primary" />
						Embed this tool (100% Ad-Free)
					</h3>
					<p className="text-xs text-muted-foreground">
						Add this utility directly to your blog posts, documentation, or dashboard.
					</p>
				</div>
				<Button
					variant={isOpen ? "outline" : "default"}
					size="sm"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? "Hide Code" : "Get Embed Code"}
				</Button>
			</div>

			{isOpen && (
				<div className="space-y-3 pt-2 border-t border-border/20 animate-in">
					<p className="text-xs text-muted-foreground leading-relaxed">
						Copy the code snippet below and paste it into your site's HTML editor. The tool runs 100% client-side inside your visitor's browser, consuming none of your server bandwidth, and is completely free to use.
					</p>
					<div className="relative group/embed">
						<pre className="w-full p-4 bg-zinc-950 text-zinc-100 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed border border-zinc-800 focus:outline-none max-h-36">
							<code ref={codeRef} className="language-html">
								{embedCode}
							</code>
						</pre>
						<Button
							size="icon"
							variant="ghost"
							className="absolute top-2 right-2 h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
							onClick={handleCopy}
							aria-label="Copy code to clipboard"
						>
							{copied ? (
								<Check className="h-4 w-4 text-emerald-500" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
			)}
		</section>
	);
}
