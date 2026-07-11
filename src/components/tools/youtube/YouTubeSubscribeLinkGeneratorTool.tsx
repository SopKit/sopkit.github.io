"use client";

import { useState } from "react";
import { Link, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function YouTubeSubscribeLinkGeneratorTool() {
	const [channelInput, setChannelInput] = useState("SopKitChannel");
	const [copied, setCopied] = useState(false);

	const generateLink = () => {
		if (!channelInput.trim()) return "";
		let cleanInput = channelInput.trim();
		// If user pastes full URL, extract channel name
		if (cleanInput.includes("youtube.com/")) {
			const parts = cleanInput.split("youtube.com/")[1].split("/");
			if (parts[0] === "c" || parts[0] === "channel" || parts[0] === "user") {
				cleanInput = parts[1];
			} else if (parts[0].startsWith("@")) {
				cleanInput = parts[0];
			} else {
				cleanInput = parts[0];
			}
		}
		return `https://www.youtube.com/${cleanInput}?sub_confirmation=1`;
	};

	const handleCopy = () => {
		const link = generateLink();
		if (!link) return;
		navigator.clipboard.writeText(link);
		setCopied(true);
		toast.success("Subscription link copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 animate-in">
			<Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<Link className="w-6 h-6 text-primary" />
						YouTube Subscribe Link Generator
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold">Enter YouTube Channel Username, ID, or URL</label>
						<Input
							value={channelInput}
							onChange={(e) => setChannelInput(e.target.value)}
							placeholder="e.g. @SopKit or https://www.youtube.com/c/SopKit"
							className="h-12 text-base px-4 bg-muted/20 border-2 border-primary/5 focus:border-primary/20 rounded-xl"
						/>
					</div>

					<div className="pt-4 border-t border-border/40 space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-semibold text-muted-foreground">Generated Subscription Link</span>
						</div>
						<div className="p-4 bg-muted/40 border border-border/40 rounded-xl min-h-[50px] flex items-center justify-between gap-4 font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
							<span className="text-foreground font-semibold">
								{generateLink() || <span className="italic text-muted-foreground">Input channel username to generate link...</span>}
							</span>
							<Button
								size="icon"
								variant="ghost"
								disabled={!generateLink()}
								onClick={handleCopy}
								className="shrink-0"
							>
								{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
