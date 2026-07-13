"use client";

import React, { useState, useEffect } from "react";
import { 
	TypeIcon, 
	TrashIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";

export default function StringLengthCalculatorTool() {
	const [input, setInput] = useState("Hello, welcome to SopKit! Check the live character metrics below.");
	const [metrics, setMetrics] = useState({
		characters: 0,
		words: 0,
		lines: 0,
		bytes: 0,
		whitespaces: 0,
		paragraphs: 0
	});

	const calculateMetrics = (text: string) => {
		if (!text) {
			setMetrics({
				characters: 0,
				words: 0,
				lines: 0,
				bytes: 0,
				whitespaces: 0,
				paragraphs: 0
			});
			return;
		}

		const characters = text.length;
		const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
		const lines = text.split("\n").length;
		const bytes = new Blob([text]).size;
		const whitespaces = (text.match(/\s/g) || []).length;
		const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== "").length;

		setMetrics({
			characters,
			words,
			lines,
			bytes,
			whitespaces,
			paragraphs
		});
	};

	useEffect(() => {
		calculateMetrics(input);
	}, [input]);

	return (
		<div className="space-y-6">
			{/* Metrics Grid */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Characters</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-primary">{metrics.characters}</p>
				</GlassCard>
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Words</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{metrics.words}</p>
				</GlassCard>
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bytes</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{metrics.bytes} B</p>
				</GlassCard>
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Lines</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{metrics.lines}</p>
				</GlassCard>
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Whitespaces</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{metrics.whitespaces}</p>
				</GlassCard>
				<GlassCard className="p-4 text-center">
					<span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Paragraphs</span>
					<p className="text-lg md:text-2xl font-black mt-1 text-foreground">{metrics.paragraphs}</p>
				</GlassCard>
			</div>

			{/* Input Panel */}
			<GlassCard className="p-4 flex flex-col space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<TypeIcon className="h-4 w-4" />
						<span>Input Text</span>
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
					className="w-full min-h-[220px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-sans text-base leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
					placeholder="Type or paste your text here..."
				/>
			</GlassCard>
		</div>
	);
}
