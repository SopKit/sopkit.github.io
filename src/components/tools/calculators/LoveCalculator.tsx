"use client";

import { useState } from "react";
import { Heart, RefreshCw, Copy, Check, Sparkles, MessageCircleHeart, Flame, Smile, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SITE_URL } from "@/constants/config";
import { trackToolExecution } from "@/lib/analytics";

interface MetricScore {
	label: string;
	value: number;
	icon: any;
	color: string;
}

export default function LoveCalculator() {
	const [name1, setName1] = useState("");
	const [name2, setName2] = useState("");
	const [score, setScore] = useState<number | null>(null);
	const [metrics, setMetrics] = useState<MetricScore[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [copied, setCopied] = useState(false);

	const calculateLove = () => {
		const n1 = name1.trim();
		const n2 = name2.trim();
		if (!n1 || !n2) return;

		setIsCalculating(true);
		const startTime = performance.now();

		setTimeout(() => {
			const combined = (n1 + n2).toLowerCase();
			let sum = 0;
			for (let i = 0; i < combined.length; i++) {
				sum += combined.charCodeAt(i) * (i + 1);
			}

			// Deterministic scores
			const finalScore = (sum % 46) + 55; // 55% to 100% positive spread
			const romance = ((sum * 3) % 36) + 65;
			const communication = ((sum * 7) % 36) + 65;
			const loyalty = ((sum * 11) % 31) + 70;
			const humor = ((sum * 13) % 41) + 60;

			setScore(finalScore);
			setMetrics([
				{ label: "Romance", value: romance, icon: Flame, color: "text-rose-500 bg-rose-500/10" },
				{ label: "Communication", value: communication, icon: MessageCircleHeart, color: "text-blue-500 bg-blue-500/10" },
				{ label: "Loyalty", value: loyalty, icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
				{ label: "Humor & Fun", value: humor, icon: Smile, color: "text-amber-500 bg-amber-500/10" },
			]);

			setIsCalculating(false);
			trackToolExecution("love-calculator", {
				durationMs: performance.now() - startTime,
				success: true,
				action: "calculate_love",
				category: "calculator",
			});
		}, 900);
	};

	const getVerdict = (val: number) => {
		if (val >= 92) return { emoji: "💖", title: "Twin Flames!", desc: "Extraordinary cosmic chemistry. You two inspire and elevate each other effortlessly." };
		if (val >= 84) return { emoji: "❤️", title: "Power Couple", desc: "Mutual respect, undeniable passion, and a shared vision for an adventurous life." };
		if (val >= 74) return { emoji: "✨", title: "Sweet Harmony", desc: "Warmhearted connection with fantastic conversational ease and laughter." };
		if (val >= 64) return { emoji: "🌟", title: "Exciting Sparks", desc: "Electrifying dynamic with healthy room to learn and grow together." };
		return { emoji: "💫", title: "Intriguing Alchemy", desc: "Opposites attract! Deeply rewarding connection when grounded in active listening." };
	};

	const reset = () => {
		setName1("");
		setName2("");
		setScore(null);
		setMetrics([]);
	};

	const verdict = score !== null ? getVerdict(score) : null;
	const shareText = score !== null ? `💖 Love Compatibility Test 💖\n\n✨ ${name1} + ${name2} = ${score}% Compatible!\nVerdict: ${verdict?.title} ${verdict?.emoji}\n\nCheck yours at: ${SITE_URL}/love-calculator/` : "";

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
		<div className="max-w-xl mx-auto space-y-6">
			{score === null ? (
				<div className="space-y-6">
					{/* Interactive Avatar Connectors */}
					<div className="flex items-center justify-center gap-4 pt-2">
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-xl font-black text-rose-600 dark:text-rose-400 shadow-inner">
							{name1 ? name1.trim()[0].toUpperCase() : "👩"}
						</div>
						<div className="relative">
							<div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-sm border border-rose-500/20 animate-pulse">
								<Heart className="w-5 h-5 fill-rose-500/60" />
							</div>
						</div>
						<div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-xl font-black text-purple-600 dark:text-purple-400 shadow-inner">
							{name2 ? name2.trim()[0].toUpperCase() : "👨"}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label htmlFor="name-1" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
								First Person
							</label>
							<Input
								id="name-1"
								type="text"
								value={name1}
								onChange={(e) => setName1(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && calculateLove()}
								placeholder="e.g. Juliet"
								className="h-12 text-base rounded-xl bg-background/60 border-border/60 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="name-2" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
								Second Person
							</label>
							<Input
								id="name-2"
								type="text"
								value={name2}
								onChange={(e) => setName2(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && calculateLove()}
								placeholder="e.g. Romeo"
								className="h-12 text-base rounded-xl bg-background/60 border-border/60 focus-visible:ring-rose-500/30 focus-visible:border-rose-500"
							/>
						</div>
					</div>

					<Button
						onClick={calculateLove}
						disabled={isCalculating || !name1.trim() || !name2.trim()}
						className="w-full h-12 text-base font-extrabold rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] gap-2 border-0"
					>
						{isCalculating ? (
							<>
								<RefreshCw className="h-5 w-5 animate-spin" />
								<span>Aligning Stars & Numerology...</span>
							</>
						) : (
							<>
								<Sparkles className="h-5 w-5 fill-current" />
								<span>Calculate Compatibility</span>
							</>
						)}
					</Button>
				</div>
			) : (
				<div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
					{/* Result Score Card */}
					<div className="text-center p-6 rounded-2xl bg-gradient-to-b from-rose-500/10 via-background/40 to-transparent border border-rose-500/20 shadow-inner space-y-3">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
							<span>{name1}</span>
							<Heart className="w-3.5 h-3.5 fill-current inline" />
							<span>{name2}</span>
						</div>

						<div className="flex items-baseline justify-center gap-1">
							<span className="text-6xl sm:text-7xl font-black tracking-tight text-foreground bg-gradient-to-br from-rose-500 to-pink-600 bg-clip-text text-transparent">
								{score}
							</span>
							<span className="text-2xl font-bold text-rose-500">%</span>
						</div>

						<div className="space-y-1">
							<h3 className="text-xl font-extrabold text-foreground flex items-center justify-center gap-2">
								<span>{verdict?.emoji}</span>
								<span>{verdict?.title}</span>
							</h3>
							<p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
								{verdict?.desc}
							</p>
						</div>

						<div className="pt-2 max-w-xs mx-auto">
							<Progress value={score} className="h-2.5 bg-rose-500/15 [&>div]:bg-gradient-to-r [&>div]:from-rose-500 [&>div]:to-pink-500" />
						</div>
					</div>

					{/* Deep Chemistry Pillars */}
					<div className="grid grid-cols-2 gap-3">
						{metrics.map((m, idx) => {
							const Icon = m.icon;
							return (
								<div key={idx} className="p-3.5 rounded-xl bg-card/60 border border-border/60 space-y-2">
									<div className="flex items-center justify-between text-xs font-semibold">
										<span className="flex items-center gap-1.5 text-muted-foreground">
											<span className={`p-1 rounded-md ${m.color}`}>
												<Icon className="w-3.5 h-3.5" />
											</span>
											{m.label}
										</span>
										<span className="font-bold text-foreground">{m.value}%</span>
									</div>
									<Progress value={m.value} className="h-1.5 bg-muted [&>div]:bg-foreground/70" />
								</div>
							);
						})}
					</div>

					<div className="grid grid-cols-2 gap-3 pt-2">
						<Button
							onClick={handleCopy}
							variant={copied ? "secondary" : "default"}
							className="h-11 font-bold text-xs gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 text-emerald-300" />
									<span>Result Copied!</span>
								</>
							) : (
								<>
									<Copy className="h-4 w-4" />
									<span>Share Result</span>
								</>
							)}
						</Button>
						<Button
							onClick={reset}
							variant="outline"
							className="h-11 font-bold text-xs gap-1.5 rounded-xl border-border/60 hover:bg-muted"
						>
							<RefreshCw className="h-4 w-4" />
							<span>Test Another Pair</span>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
