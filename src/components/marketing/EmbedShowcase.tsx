"use client";

import { useState } from "react";
import { Copy, Check, Code2, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/constants/config";
import { trackEmbedInteraction } from "@/lib/analytics";

const SAMPLE_TOOLS = [
	{ id: "pdf-editor", name: "PDF Editor", desc: "Local PDF annotation & viewer" },
	{ id: "image-compressor", name: "Image Compressor", desc: "Client-side image optimizer" },
	{ id: "json-formatter", name: "JSON Formatter", desc: "Interactive JSON validator & tree" },
	{ id: "qr-code-generator", name: "QR Generator", desc: "Vector QR code builder" },
];

export function EmbedShowcase() {
	const [selectedTool, setSelectedTool] = useState(SAMPLE_TOOLS[0].id);
	const [activeTab, setActiveTab] = useState<"html" | "react" | "url">("html");
	const [copied, setCopied] = useState(false);

	const embedUrl = `${SITE_CONFIG.siteUrl}/embed-tool/?id=${selectedTool}`;

	const getCode = () => {
		switch (activeTab) {
			case "html":
				return `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="550"\n  style="border:0; border-radius:12px; overflow:hidden;"\n  title="Free Local ${SAMPLE_TOOLS.find((t) => t.id === selectedTool)?.name} by SopKit"\n  loading="lazy"\n></iframe>`;
			case "react":
				return `export function EmbeddedTool() {\n  return (\n    <iframe\n      src="${embedUrl}"\n      className="w-full h-[550px] rounded-xl border-0 shadow-lg"\n      title="${SAMPLE_TOOLS.find((t) => t.id === selectedTool)?.name}"\n      loading="lazy"\n    />\n  );\n}`;
			case "url":
				return embedUrl;
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(getCode());
		trackEmbedInteraction(selectedTool, "copy_code", activeTab);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section className="py-14 border-t border-border/40 [content-visibility:auto] [contain-intrinsic-size:1px_450px]">
			<div className="relative rounded-3xl bg-gradient-to-br from-card/80 via-card/50 to-muted/20 border border-border/70 dark:border-border/40 p-6 sm:p-10 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden backdrop-blur-xl">
				{/* Background Glow */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
					{/* Left: Explanatory Content */}
					<div className="lg:col-span-5 space-y-5">
						<Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full w-fit gap-1.5 select-none">
							<Sparkles className="h-3 w-3" />
							Free Webmaster Feature
						</Badge>

						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground uppercase leading-tight">
							Embed Any Tool on Your Website
						</h2>

						<p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
							Add any of SopKit&apos;s {SITE_CONFIG.toolCountString} utilities directly to your blog, documentation, or client portal. Sandboxed tools run in your visitor&apos;s browser, requiring zero server resources from your host.
						</p>

						{/* Feature Bullet Chips */}
						<div className="grid grid-cols-2 gap-2.5 pt-2">
							<div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs">
								<span className="font-bold text-foreground block mb-0.5">0 KB Server Load</span>
								<span className="text-[11px] text-muted-foreground">Runs inside client RAM</span>
							</div>
							<div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs">
								<span className="font-bold text-foreground block mb-0.5">Ad-Free Sandbox</span>
								<span className="text-[11px] text-muted-foreground">Clean, unbranded iframe</span>
							</div>
						</div>

						{/* Tool Picker */}
						<div className="pt-2">
							<label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
								Choose a sample tool:
							</label>
							<div className="flex flex-wrap gap-1.5">
								{SAMPLE_TOOLS.map((t) => (
									<button
										key={t.id}
										type="button"
										onClick={() => setSelectedTool(t.id)}
										className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
											selectedTool === t.id
												? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
												: "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
										}`}
									>
										{t.name}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Right: Code Snippet Card */}
					<div className="lg:col-span-7">
						<div className="rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden font-mono">
							{/* Window Header */}
							<div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-red-500/80" />
									<div className="w-3 h-3 rounded-full bg-amber-500/80" />
									<div className="w-3 h-3 rounded-full bg-emerald-500/80" />
									<span className="text-xs text-zinc-400 font-sans ml-2 flex items-center gap-1.5">
										<Code2 className="h-3.5 w-3.5 text-blue-400" />
										Embed Widget Code
									</span>
								</div>

								{/* Code Tab Switcher */}
								<div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg text-[11px]" role="tablist">
									<button
										type="button"
										role="tab"
										aria-selected={activeTab === "html"}
										aria-label="HTML embed code"
										onClick={() => {
											setActiveTab("html");
											trackEmbedInteraction(selectedTool, "tab_switch", "html");
										}}
										className={`px-2.5 py-0.5 rounded-md transition-all ${
											activeTab === "html" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
										}`}
									>
										HTML
									</button>
									<button
										type="button"
										role="tab"
										aria-selected={activeTab === "react"}
										aria-label="React embed code"
										onClick={() => {
											setActiveTab("react");
											trackEmbedInteraction(selectedTool, "tab_switch", "react");
										}}
										className={`px-2.5 py-0.5 rounded-md transition-all ${
											activeTab === "react" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
										}`}
									>
										React
									</button>
									<button
										type="button"
										role="tab"
										aria-selected={activeTab === "url"}
										aria-label="Direct URL embed code"
										onClick={() => {
											setActiveTab("url");
											trackEmbedInteraction(selectedTool, "tab_switch", "url");
										}}
										className={`px-2.5 py-0.5 rounded-md transition-all ${
											activeTab === "url" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
										}`}
									>
										URL
									</button>
								</div>
							</div>

							{/* Code Area */}
							<div className="p-4 sm:p-5 text-xs sm:text-sm text-zinc-200 overflow-x-auto leading-relaxed max-h-64 scrollbar-thin">
								<pre className="font-mono">
									<code>{getCode()}</code>
								</pre>
							</div>

							{/* Bottom Bar with Copy & Preview Link */}
							<div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-t border-zinc-800 font-sans text-xs">
								<a
									href={embedUrl}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => trackEmbedInteraction(selectedTool, "preview_click")}
									className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px]"
								>
									<span>Open Live Sandbox Preview</span>
									<ExternalLink className="h-3 w-3" />
								</a>

								<button
									type="button"
									onClick={handleCopy}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm shadow-blue-500/25"
								>
									{copied ? (
										<>
											<Check className="h-3.5 w-3.5 text-white" />
											<span>Copied!</span>
										</>
									) : (
										<>
											<Copy className="h-3.5 w-3.5" />
											<span>Copy Code</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
