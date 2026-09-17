"use client";

import { useState, useEffect, useRef } from "react";
import { Code, Copy, Check, Palette, Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolModeTabs } from "./design-system";
import { SITE_URL } from "@/constants/config";

interface EmbedWidgetGiverProps {
	toolId: string;
	toolName: string;
}

export function EmbedWidgetGiver({ toolId, toolName }: EmbedWidgetGiverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [theme, setTheme] = useState("dark");
	const [accent, setAccent] = useState("blue");
	const [height, setHeight] = useState("550");
	const codeRef = useRef<HTMLElement>(null);

	const embedUrl = `${SITE_URL}/embed-tool/?id=${toolId}&theme=${theme}&accent=${accent}`;
	const embedCode = `<iframe src="${embedUrl}" width="100%" height="${height}" style="border:0; border-radius:12px; overflow:hidden;" title="Free Local ${toolName} by SopKit"></iframe>`;

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
	}, [isOpen, theme, accent, height]);

	return (
		<section className="max-w-2xl mx-auto p-6 border border-border/40 bg-card/20 rounded-2xl space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="space-y-1">
					<h3 className="text-base font-bold flex items-center gap-2">
						<Code className="h-4.5 w-4.5 text-primary" />
						Embed this tool (Ad-Supported)
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
				<div className="space-y-4 pt-4 border-t border-border/20 animate-in">
					{/* Customizer Panel */}
					<div className="p-4 bg-background/40 border border-border/30 rounded-xl space-y-4">
						<h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
							<Settings className="h-3.5 w-3.5" />
							Interactive Customizer
						</h4>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Theme selection */}
							<div className="space-y-2">
								<span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
									{theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
									Display Theme
								</span>
								<ToolModeTabs
									ariaLabel="Display theme"
									tabs={[
										{ value: "dark", label: "Dark" },
										{ value: "light", label: "Light" },
									]}
									value={theme}
									onChange={setTheme}
								/>
							</div>

							{/* Accent Color Selection */}
							<div className="space-y-2">
								<span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
									<Palette className="h-3 w-3" />
									Accent Color
								</span>
								<ToolModeTabs
									ariaLabel="Accent color"
									tabs={["blue", "purple", "emerald", "orange"].map((c) => ({
										value: c,
										label: c.charAt(0).toUpperCase() + c.slice(1),
									}))}
									value={accent}
									onChange={setAccent}
								/>
							</div>

							{/* Height adjustment */}
							<div className="space-y-2">
								<span className="text-[11px] font-bold text-muted-foreground uppercase">
									Iframe Height (px)
								</span>
								<ToolModeTabs
									ariaLabel="Iframe height in pixels"
									tabs={["500", "550", "600"].map((h) => ({
										value: h,
										label: `${h}px`,
									}))}
									value={height}
									onChange={setHeight}
								/>
							</div>
						</div>
					</div>

					{/* Live Iframe Preview Section */}
					<div className="space-y-2">
						<span className="text-[11px] font-bold text-muted-foreground uppercase block">Live Sandbox Preview:</span>
						<div className="border border-border/40 rounded-xl overflow-hidden bg-background/50 h-[300px] relative">
							<iframe
								src={embedUrl}
								className="w-full h-full border-0"
								title={`Preview: ${toolName}`}
								loading="lazy"
							/>
						</div>
					</div>

					<p className="text-xs text-muted-foreground leading-relaxed">
						Copy the code snippet below and paste it into your site's HTML editor. The tool runs 100% client-side inside your visitor's browser, consuming none of your server bandwidth, and is completely free to use.
					</p>

					{/* Code output and copy box */}
					<div className="relative group/embed">
						<pre className="w-full p-4 bg-zinc-950 text-zinc-100 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-zinc-800 focus:outline-none max-h-36">
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
