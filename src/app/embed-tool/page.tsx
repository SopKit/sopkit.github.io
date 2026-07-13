"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getAllTools } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import AdPlacement from "@/components/ads/AdPlacement";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";

function EmbedToolContent() {
	const searchParams = useSearchParams();
	const toolId = searchParams.get("id") || "";
	const themeParam = searchParams.get("theme") || "dark";
	const accentParam = searchParams.get("accent") || "blue";

	useEffect(() => {
		const htmlEl = document.documentElement;
		if (themeParam === "light") {
			htmlEl.classList.remove("dark");
			htmlEl.classList.add("light");
		} else {
			htmlEl.classList.remove("light");
			htmlEl.classList.add("dark");
		}

		const accentColors: Record<string, string> = {
			blue: "210 100% 58%",
			purple: "270 95% 60%",
			emerald: "150 90% 40%",
			orange: "25 95% 50%",
		};

		if (accentColors[accentParam]) {
			htmlEl.style.setProperty("--primary", accentColors[accentParam]);
		}
	}, [themeParam, accentParam]);

	if (!toolId) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
				<div className="space-y-2">
					<p className="text-lg font-bold">No tool ID provided</p>
					<p className="text-sm text-muted-foreground">Use /embed-tool/?id=tool-id to embed a tool.</p>
				</div>
			</div>
		);
	}

	const allTools = getAllTools();
	const tool = allTools.find((t) => t.id === toolId || t.route === `/${toolId}`);

	if (!tool) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
				<div className="space-y-2">
					<p className="text-lg font-bold text-destructive">Tool not found</p>
					<p className="text-sm text-muted-foreground">The requested tool ID "{toolId}" does not exist.</p>
				</div>
			</div>
		);
	}

	const toolUrl = `https://sopkit.github.io${tool.route.startsWith("/") ? tool.route : "/" + tool.route}`;

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
			{/* Interactive Tool Container */}
			<div className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center">
				<div className="p-4 sm:p-6 bg-card/30 border border-border/40 rounded-2xl shadow-xl relative overflow-hidden w-full">
					<IntentToolDispatcher toolId={tool.id} />
				</div>
			</div>

			{/* Ad Unit inside Embed */}
			<div className="w-full max-w-5xl mx-auto mt-4 shrink-0">
				<AdPlacement placement="footer" category={tool.category} slug={tool.id} />
			</div>

			{/* Footer: branding button linking to main tool on SopKit */}
			<div className="w-full flex items-center justify-between max-w-5xl mx-auto pt-4 border-t border-border/10 mt-4 text-xs">
				<span className="text-muted-foreground font-semibold">
					Embedded via <span className="text-foreground font-extrabold tracking-tight">SopKit</span>
				</span>
				<Button
					size="sm"
					variant="ghost"
					asChild
					className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1.5 font-bold rounded-lg text-xs"
				>
					<a href={toolUrl} target="_blank" rel="noopener noreferrer">
						<span>Use on SopKit</span>
						<ExternalLink className="h-3.5 w-3.5" />
					</a>
				</Button>
			</div>
		</div>
	);
}

export default function EmbedToolPage() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<div className="text-sm text-muted-foreground font-semibold animate-pulse">Loading tool sandbox...</div>
			</div>
		}>
			<EmbedToolContent />
		</Suspense>
	);
}
