"use client";

import { useState } from "react";
import { CaseSensitive, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function YouTubeTitleLengthCheckerTool() {
	const [title, setTitle] = useState("How to Design a High-Converting landing Page (Best Practices)");
	const [copied, setCopied] = useState(false);

	const charCount = title.length;
	const isGoodLength = charCount >= 20 && charCount <= 60;
	const isTooLong = charCount > 60;

	const handleCopy = () => {
		if (!title) return;
		navigator.clipboard.writeText(title);
		setCopied(true);
		toast.success("Title copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
			<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<CaseSensitive className="w-6 h-6 text-primary" />
						YouTube Title Length Checker
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold">Enter YouTube Video Title</label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Type your title here..."
							maxLength={100}
							className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
						/>
					</div>

					<div className="space-y-3 pt-2">
						<div className="flex justify-between items-center text-xs font-semibold">
							<span>Character Count: {charCount} / 100</span>
							<span className={isTooLong ? "text-destructive" : isGoodLength ? "text-emerald-500" : "text-amber-500"}>
								{isTooLong ? "Too Long (Will truncate on mobile)" : isGoodLength ? "Perfect SEO Length" : "Too Short"}
							</span>
						</div>
						<Progress value={Math.min(charCount, 100)} className="h-2 rounded-full" />
					</div>

					<div className="p-4 rounded-xl border bg-muted/20 space-y-2">
						<h4 className="text-xs font-bold uppercase tracking-wider">SEO Recommendations</h4>
						<ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
							<li>Keep your titles between **20 and 60 characters** to ensure they render fully in Google and YouTube mobile searches.</li>
							<li>Place high-intent search keywords near the beginning of your title.</li>
							<li>Avoid excessive capitalizations or clickbait symbols which may hurt click-through rates.</li>
						</ul>
					</div>

					<div className="pt-4 border-t border-border/40 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold text-muted-foreground">Title Preview</span>
							<Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8 text-muted-foreground hover:text-foreground">
								{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
							</Button>
						</div>
						<div className="p-4 bg-background border border-border/40 rounded-xl space-y-1 max-w-sm">
							<div className="aspect-video w-full bg-muted rounded-md mb-2 flex items-center justify-center text-xs text-muted-foreground">Video Thumbnail Preview</div>
							<h4 className={`text-sm font-semibold leading-snug ${isTooLong ? "line-clamp-2" : ""}`}>
								{title || "Your video title will render here"}
							</h4>
							<span className="text-[10px] text-muted-foreground">SopKit Creator • 10K views • 2 hours ago</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
