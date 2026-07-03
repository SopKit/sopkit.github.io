"use client";

import React, { useState, useEffect } from "react";
import { 
	TypeIcon, 
	TrashIcon,
	LayoutGridIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";

interface WordStat {
	word: string;
	count: number;
	density: number;
}

export default function WordFrequencyCounterTool() {
	const [input, setInput] = useState("SopKit is a free toolkit. SopKit makes developer lives easier. SopKit is private and secure.");
	const [stats, setStats] = useState<WordStat[]>([]);
	const [totalCount, setTotalCount] = useState(0);

	const calculateStats = (text: string) => {
		if (!text.trim()) {
			setStats([]);
			setTotalCount(0);
			return;
		}

		// Normalize text: lowercase and strip punctuation/symbols
		const normalized = text
			.toLowerCase()
			.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		if (!normalized) {
			setStats([]);
			setTotalCount(0);
			return;
		}

		const words = normalized.split(/\s+/);
		const total = words.length;
		setTotalCount(total);

		const frequencies: Record<string, number> = {};
		for (const w of words) {
			frequencies[w] = (frequencies[w] || 0) + 1;
		}

		const list: WordStat[] = Object.keys(frequencies).map((word) => {
			const count = frequencies[word];
			const density = parseFloat(((count / total) * 100).toFixed(2));
			return { word, count, density };
		});

		// Sort by count descending
		list.sort((a, b) => b.count - a.count);

		setStats(list.slice(0, 50)); // Show top 50 words
	};

	useEffect(() => {
		calculateStats(input);
	}, [input]);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
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
						className="flex-grow w-full min-h-[220px] p-4 bg-muted/40 border border-border/40 rounded-2xl font-sans text-base leading-relaxed text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
						placeholder="Paste your text here to analyze word frequency..."
					/>
				</GlassCard>

				{/* Density Analysis Table Panel */}
				<GlassCard className="p-4 flex flex-col space-y-3 overflow-hidden">
					<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
						<LayoutGridIcon className="h-4 w-4" />
						<span>Word Density Analysis (Total: {totalCount} words)</span>
					</div>

					<div className="flex-grow overflow-auto max-h-[300px] border border-border/30 rounded-2xl">
						<table className="w-full text-left border-collapse text-xs md:text-sm">
							<thead>
								<tr className="border-b border-border/10 bg-muted/20 text-muted-foreground font-bold uppercase">
									<th className="p-3">Word</th>
									<th className="p-3 text-center">Count</th>
									<th className="p-3 text-right">Density (%)</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border/10 text-foreground">
								{stats.length === 0 ? (
									<tr>
										<td colSpan={3} className="p-4 text-center text-muted-foreground">
											No data available. Type in the editor.
										</td>
									</tr>
								) : (
									stats.map((stat, idx) => (
										<tr key={idx} className="hover:bg-muted/5 transition-colors">
											<td className="p-3 font-mono font-bold text-primary">{stat.word}</td>
											<td className="p-3 text-center">{stat.count}</td>
											<td className="p-3 text-right">{stat.density}%</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</GlassCard>
			</div>
		</div>
	);
}
