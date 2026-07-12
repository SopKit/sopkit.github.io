"use client";

import { useState } from "react";
import { Heart, RefreshCw, Copy, Check, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LoveCalculator() {
	const [name1, setName1] = useState("");
	const [name2, setName2] = useState("");
	const [score, setScore] = useState<number | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [copied, setCopied] = useState(false);

	const calculateLove = () => {
		if (!name1.trim() || !name2.trim()) return;
		setIsCalculating(true);

		// Short timeout to simulate numerology parsing
		setTimeout(() => {
			const str = (name1.trim() + name2.trim()).toLowerCase();
			let sum = 0;
			for (let i = 0; i < str.length; i++) {
				sum += str.charCodeAt(i);
			}
			// Stable deterministic percentage mapping
			const finalScore = (sum % 51) + 50; // Map compatibility between 50% and 100% for positivity!
			setScore(finalScore);
			setIsCalculating(false);
		}, 1200);
	};

	const getVerdict = (val: number) => {
		if (val >= 90) return { emoji: "💖", title: "Perfect Match!", desc: "You two are absolute soulmates, written in the stars." };
		if (val >= 80) return { emoji: "❤️", title: "Strong Chemistry!", desc: "Excellent compatibility, deep mutual understanding." };
		if (val >= 70) return { emoji: "💛", title: "Cute Connection!", desc: "Great friends who could easily build a loving couple." };
		if (val >= 60) return { emoji: "💙", title: "Developing Sparks!", desc: "Sparks fly but requires clear communication." };
		return { emoji: "🤍", title: "Rocky Path", desc: "Opposites attract but be ready for some efforts." };
	};

	const reset = () => {
		setName1("");
		setName2("");
		setScore(null);
	};

	const verdict = score !== null ? getVerdict(score) : null;
	const shareText = score !== null ? `💖 Love Compatibility Test Result 💖\n\n👩 ${name1} + 👨 ${name2} = ${score}% Compatible!\nVerdict: ${verdict?.title} ${verdict?.emoji}\n\nTest your love at: https://sopkit.github.io/love-calculator/` : "";

	const handleCopy = async () => {
		if (!shareText) return;
		try {
			await navigator.clipboard.writeText(shareText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy", err);
		}
	};

	return (
		<div className="max-w-md mx-auto space-y-6">
			{score === null ? (
				<Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden relative">
					<CardContent className="p-6 md:p-8 space-y-6">
						<div className="text-center space-y-2">
							<div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500 animate-pulse">
								<Heart className="h-6 w-6 fill-current" />
							</div>
							<h3 className="text-xl font-bold">Calculate Compatibility</h3>
							<p className="text-xs text-muted-foreground">Enter names to check name numerology and astronomical alignment.</p>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="name-1" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">First Person Name</label>
								<Input
									id="name-1"
									type="text"
									value={name1}
									onChange={(e) => setName1(e.target.value)}
									placeholder="e.g. Juliet"
									className="h-11 bg-background/50 border-border/40 focus-visible:ring-red-500/20"
								/>
							</div>

							<div className="flex justify-center -my-1">
								<Heart className="h-5 w-5 text-red-500/40 fill-current" />
							</div>

							<div className="space-y-2">
								<label htmlFor="name-2" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Second Person Name</label>
								<Input
									id="name-2"
									type="text"
									value={name2}
									onChange={(e) => setName2(e.target.value)}
									placeholder="e.g. Romeo"
									className="h-11 bg-background/50 border-border/40 focus-visible:ring-red-500/20"
								/>
							</div>
						</div>

						<Button
							onClick={calculateLove}
							disabled={isCalculating || !name1.trim() || !name2.trim()}
							className="w-full h-12 text-base font-bold bg-red-500 hover:bg-red-600 text-white gap-2 border-0 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
						>
							{isCalculating ? (
								<>
									<RefreshCw className="h-5 w-5 animate-spin" />
									Analyzing Chemistry...
								</>
							) : (
								<>
									<Sparkles className="h-5 w-5 fill-current" />
									Calculate Alignment
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			) : (
				<Card className="border-red-500/20 bg-red-500/[0.02] backdrop-blur-md shadow-xl overflow-hidden relative">
					<CardContent className="p-6 md:p-8 space-y-6 text-center">
						<div className="space-y-2">
							<div className="text-5xl md:text-6xl font-black text-red-500 tracking-tight flex justify-center items-baseline gap-1 select-none">
								<span>{score}</span>
								<span className="text-2xl md:text-3xl">%</span>
							</div>
							<p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
								Love Match Alignment
							</p>
						</div>

						<div className="px-6">
							<Progress value={score} className="h-3 bg-red-500/10 [&>div]:bg-red-500" />
						</div>

						<div className="space-y-2 py-2">
							<div className="text-3xl">{verdict?.emoji}</div>
							<h4 className="text-lg font-bold text-foreground">{verdict?.title}</h4>
							<p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
								{verdict?.desc}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Button
								onClick={handleCopy}
								variant={copied ? "secondary" : "default"}
								className="h-11 font-bold text-xs gap-1.5"
							>
								{copied ? (
									<>
										<Check className="h-4 w-4 text-emerald-500" />
										Copied
									</>
								) : (
									<>
										<Copy className="h-4 w-4" />
										Copy Result
									</>
								)}
							</Button>
							<Button
								onClick={reset}
								variant="outline"
								className="h-11 font-bold text-xs gap-1.5 border-border/40"
							>
								<RefreshCw className="h-4 w-4" />
								Test Another
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
