"use client";

import { useState, useRef } from "react";
import {
	Heart,
	RefreshCw,
	Copy,
	Check,
	Sparkles,
	MessageCircleHeart,
	Flame,
	Smile,
	ShieldCheck,
	Download,
	Share2,
	Shuffle,
	Smartphone,
	Image as ImageIcon,
	MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { SITE_URL } from "@/constants/config";
import { trackToolExecution } from "@/lib/analytics";

interface MetricScore {
	label: string;
	value: number;
	icon: any;
	color: string;
}

const FAMOUS_COUPLES = [
	{ name1: "Romeo", name2: "Juliet" },
	{ name1: "Barbie", name2: "Ken" },
	{ name1: "Jack", name2: "Rose" },
	{ name1: "Jim", name2: "Pam" },
	{ name1: "Chandler", name2: "Monica" },
	{ name1: "Shrek", name2: "Fiona" },
	{ name1: "Bonnie", name2: "Clyde" },
	{ name1: "Peter", name2: "Mary Jane" },
	{ name1: "Tony", name2: "Pepper" },
	{ name1: "Wall-E", name2: "EVE" },
	{ name1: "Gomez", name2: "Morticia" },
	{ name1: "Ross", name2: "Rachel" },
	{ name1: "Simba", name2: "Nala" },
	{ name1: "Aladdin", name2: "Jasmine" },
	{ name1: "Tarzan", name2: "Jane" },
];

export default function LoveCalculator() {
	const [name1, setName1] = useState("");
	const [name2, setName2] = useState("");
	const [score, setScore] = useState<number | null>(null);
	const [metrics, setMetrics] = useState<MetricScore[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [generatingImage, setGeneratingImage] = useState(false);
	const [shareAspect, setShareAspect] = useState<"story" | "square">("story");
	const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
	const input1Ref = useRef<HTMLInputElement>(null);

	const calculateLoveFor = (n1Input: string, n2Input: string) => {
		const n1 = n1Input.trim();
		const n2 = n2Input.trim();
		if (!n1 || !n2) return;

		setIsCalculating(true);
		const startTime = performance.now();

		setTimeout(() => {
			const combined = (n1 + n2).toLowerCase();
			let sum = 0;
			for (let i = 0; i < combined.length; i++) {
				sum += combined.charCodeAt(i) * (i + 1);
			}

			// Deterministic positive scores
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
		}, 600);
	};

	const calculateLove = () => {
		calculateLoveFor(name1, name2);
	};

	const getVerdict = (val: number) => {
		if (val >= 92) return { emoji: "💖", title: "Twin Flames!", desc: "Extraordinary cosmic chemistry. You two inspire and elevate each other effortlessly." };
		if (val >= 84) return { emoji: "❤️", title: "Power Couple", desc: "Mutual respect, undeniable passion, and a shared vision for an adventurous life." };
		if (val >= 74) return { emoji: "✨", title: "Sweet Harmony", desc: "Warmhearted connection with fantastic conversational ease and laughter." };
		if (val >= 64) return { emoji: "🌟", title: "Exciting Sparks", desc: "Electrifying dynamic with healthy room to learn and grow together." };
		return { emoji: "💫", title: "Intriguing Alchemy", desc: "Opposites attract! Deeply rewarding connection when grounded in active listening." };
	};

	// Prefills next pair and switches view back to input card
	const handleTestAnotherPair = () => {
		const currentKey = `${name1.toLowerCase()}-${name2.toLowerCase()}`;
		const pool = FAMOUS_COUPLES.filter(
			(c) => `${c.name1.toLowerCase()}-${c.name2.toLowerCase()}` !== currentKey
		);
		const randomPair = pool[Math.floor(Math.random() * pool.length)] || FAMOUS_COUPLES[0];
		setName1(randomPair.name1);
		setName2(randomPair.name2);
		setScore(null);
		setMetrics([]);
		setTimeout(() => {
			input1Ref.current?.focus();
		}, 100);
	};

	const handlePrefillChip = (p1: string, p2: string) => {
		setName1(p1);
		setName2(p2);
		calculateLoveFor(p1, p2);
	};

	const verdict = score !== null ? getVerdict(score) : null;
	const shareUrl = `${SITE_URL}/love-calculator/`;
	const shareText = score !== null
		? `💖 Love Compatibility Test 💖\n\n✨ ${name1} + ${name2} = ${score}% Compatible!\nVerdict: ${verdict?.title} ${verdict?.emoji}\n\nCheck your compatibility at: ${shareUrl}`
		: "";

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

	const handleWhatsAppShare = () => {
		const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
		window.open(waUrl, "_blank", "noopener,noreferrer");
	};

	const handleTwitterShare = () => {
		const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
		window.open(twUrl, "_blank", "noopener,noreferrer");
	};

	// Generate story / square card image via HTML5 Canvas
	const generateCardBlob = async (aspect: "story" | "square"): Promise<Blob> => {
		const isStory = aspect === "story";
		const width = 1080;
		const height = isStory ? 1920 : 1080;

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas context not available");

		// 1. Background linear gradient
		const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
		bgGrad.addColorStop(0, "#19081f"); // Deep royal velvet plum
		bgGrad.addColorStop(0.35, "#3d0e2e"); // Romantic rose wine
		bgGrad.addColorStop(0.7, "#280720"); // Dark velvet
		bgGrad.addColorStop(1, "#120417"); // Deep night
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		// 2. Ambient glowing orbs
		const orb1 = ctx.createRadialGradient(width / 2, isStory ? 750 : 450, 40, width / 2, isStory ? 750 : 450, 450);
		orb1.addColorStop(0, "rgba(244, 63, 94, 0.4)");
		orb1.addColorStop(1, "rgba(244, 63, 94, 0)");
		ctx.fillStyle = orb1;
		ctx.fillRect(0, 0, width, height);

		// 3. Subtle background stars / sparkles
		ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
		const stars = [
			[150, 200, 3], [900, 240, 4], [250, 450, 2.5], [850, 600, 3],
			[120, 1100, 3.5], [920, 1200, 2.5], [200, 1500, 3], [820, 1650, 4],
			[540, 150, 3], [400, 300, 2], [680, 280, 2.5],
		];
		for (const [sx, sy, sr] of stars) {
			if (sy < height) {
				ctx.beginPath();
				ctx.arc(sx, sy, sr, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// 4. Main Glassmorphic Card Container
		const cardMargin = isStory ? 80 : 60;
		const cardX = cardMargin;
		const cardY = isStory ? 180 : 70;
		const cardW = width - cardMargin * 2;
		const cardH = isStory ? 1560 : 940;
		const cardRadius = 50;

		ctx.save();
		ctx.beginPath();
		ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
		ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(244, 63, 94, 0.35)";
		ctx.stroke();
		ctx.restore();

		// 5. Header Badge: "✨ LOVE COMPATIBILITY REPORT"
		ctx.save();
		const badgeY = cardY + 70;
		ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
		ctx.beginPath();
		ctx.roundRect(width / 2 - 230, badgeY - 30, 460, 60, 30);
		ctx.fill();
		ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.fillStyle = "#fda4af";
		ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("✨ LOVE COMPATIBILITY REPORT", width / 2, badgeY);
		ctx.restore();

		// 6. Couple Names: Name1 💕 Name2
		ctx.save();
		const namesY = badgeY + (isStory ? 120 : 90);
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 56px serif, 'Times New Roman', Georgia";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		const maxNameLen = 14;
		const dispName1 = name1.length > maxNameLen ? name1.slice(0, maxNameLen) + "…" : name1;
		const dispName2 = name2.length > maxNameLen ? name2.slice(0, maxNameLen) + "…" : name2;
		ctx.fillText(`${dispName1}  💕  ${dispName2}`, width / 2, namesY);
		ctx.restore();

		// 7. Large Glowing Score Circle
		ctx.save();
		const scoreCenterY = namesY + (isStory ? 240 : 180);
		const ringRadius = isStory ? 140 : 110;

		// Track ring
		ctx.beginPath();
		ctx.arc(width / 2, scoreCenterY, ringRadius, 0, Math.PI * 2);
		ctx.lineWidth = 16;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
		ctx.stroke();

		// Progress arc
		const startAngle = -Math.PI / 2;
		const progressAngle = startAngle + (Math.PI * 2 * ((score || 85) / 100));
		ctx.beginPath();
		ctx.arc(width / 2, scoreCenterY, ringRadius, startAngle, progressAngle);
		ctx.lineWidth = 16;
		ctx.lineCap = "round";
		const arcGrad = ctx.createLinearGradient(width / 2 - ringRadius, scoreCenterY, width / 2 + ringRadius, scoreCenterY);
		arcGrad.addColorStop(0, "#f43f5e");
		arcGrad.addColorStop(1, "#ec4899");
		ctx.strokeStyle = arcGrad;
		ctx.stroke();

		// Score text
		ctx.fillStyle = "#ffffff";
		ctx.font = `900 ${isStory ? 120 : 96}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(`${score}%`, width / 2, scoreCenterY);
		ctx.restore();

		// 8. Verdict Box: Emoji + Title + Desc
		ctx.save();
		const verdictY = scoreCenterY + (isStory ? 220 : 160);
		ctx.fillStyle = "#ffffff";
		ctx.font = `bold ${isStory ? 44 : 36}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(`${verdict?.emoji || "💖"} ${verdict?.title || "Love Test"}`, width / 2, verdictY);

		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.font = `normal ${isStory ? 28 : 22}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		const desc = verdict?.desc || "Extraordinary cosmic chemistry.";
		const words = desc.split(" ");
		let line = "";
		let lineY = verdictY + (isStory ? 55 : 45);
		for (let n = 0; n < words.length; n++) {
			const testLine = line + words[n] + " ";
			const metricsTest = ctx.measureText(testLine);
			if (metricsTest.width > cardW - 120 && n > 0) {
				ctx.fillText(line.trim(), width / 2, lineY);
				line = words[n] + " ";
				lineY += isStory ? 38 : 30;
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line.trim(), width / 2, lineY);
		ctx.restore();

		// 9. Chemistry Pillars
		ctx.save();
		const pillarsStartY = lineY + (isStory ? 80 : 55);
		const barWidth = cardW - 140;
		const barHeight = isStory ? 20 : 16;
		const barX = width / 2 - barWidth / 2;

		metrics.forEach((m, idx) => {
			const itemY = pillarsStartY + idx * (isStory ? 85 : 65);
			if (itemY + barHeight + 40 < cardY + cardH) {
				ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
				ctx.font = `bold ${isStory ? 26 : 20}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
				ctx.textAlign = "left";
				ctx.textBaseline = "bottom";
				ctx.fillText(m.label, barX, itemY);

				ctx.textAlign = "right";
				ctx.fillStyle = "#fda4af";
				ctx.fillText(`${m.value}%`, barX + barWidth, itemY);

				ctx.beginPath();
				ctx.roundRect(barX, itemY + 10, barWidth, barHeight, barHeight / 2);
				ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
				ctx.fill();

				const fillW = (barWidth * m.value) / 100;
				ctx.beginPath();
				ctx.roundRect(barX, itemY + 10, fillW, barHeight, barHeight / 2);
				const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
				barGrad.addColorStop(0, "#f43f5e");
				barGrad.addColorStop(1, "#fb7185");
				ctx.fillStyle = barGrad;
				ctx.fill();
			}
		});
		ctx.restore();

		// 10. Watermark & SopKit Branding Footer
		ctx.save();
		const footerY = cardY + cardH - (isStory ? 70 : 45);
		ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
		ctx.font = `bold ${isStory ? 28 : 22}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("SopKit • sopkit.space/love-calculator", width / 2, footerY);

		ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
		ctx.font = `normal ${isStory ? 20 : 16}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		ctx.fillText("100% In-Browser Private Calculation • Free Forever", width / 2, footerY + (isStory ? 35 : 25));
		ctx.restore();

		return new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) resolve(blob);
				else reject(new Error("Canvas blob export failed"));
			}, "image/png");
		});
	};

	const openShareModal = async (initialAspect: "story" | "square" = "story") => {
		setShareAspect(initialAspect);
		setShareModalOpen(true);
		setGeneratingImage(true);
		try {
			const blob = await generateCardBlob(initialAspect);
			const url = URL.createObjectURL(blob);
			setPreviewImageUrl(url);
		} catch (e) {
			console.error("Failed to generate preview", e);
		} finally {
			setGeneratingImage(false);
		}
	};

	const switchAspect = async (aspect: "story" | "square") => {
		setShareAspect(aspect);
		setGeneratingImage(true);
		try {
			const blob = await generateCardBlob(aspect);
			const url = URL.createObjectURL(blob);
			setPreviewImageUrl(url);
		} catch (e) {
			console.error("Failed to generate preview", e);
		} finally {
			setGeneratingImage(false);
		}
	};

	const handleDownloadImage = async () => {
		setGeneratingImage(true);
		try {
			const blob = await generateCardBlob(shareAspect);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `love-compatibility-${name1.toLowerCase()}-${name2.toLowerCase()}-${shareAspect}.png`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			setTimeout(() => URL.revokeObjectURL(url), 10000);
		} catch (e) {
			console.error("Download failed", e);
		} finally {
			setGeneratingImage(false);
		}
	};

	const handleNativeShare = async () => {
		setGeneratingImage(true);
		try {
			const blob = await generateCardBlob(shareAspect);
			const file = new File(
				[blob],
				`love-compatibility-${name1.toLowerCase()}-${name2.toLowerCase()}.png`,
				{ type: "image/png" }
			);

			if (navigator.canShare && navigator.canShare({ files: [file] })) {
				await navigator.share({
					title: "Love Compatibility Test",
					text: shareText,
					files: [file],
				});
			} else if (navigator.share) {
				await navigator.share({
					title: "Love Compatibility Test",
					text: shareText,
					url: shareUrl,
				});
			} else {
				// Fallback to download
				await handleDownloadImage();
			}
		} catch (e: any) {
			if (e.name !== "AbortError") {
				console.error("Share failed", e);
			}
		} finally {
			setGeneratingImage(false);
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
								ref={input1Ref}
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

					{/* Fun Couple Quick Prefill Chips */}
					<div className="flex flex-wrap items-center gap-1.5 pt-1">
						<span className="text-[11px] font-semibold text-muted-foreground mr-1 flex items-center gap-1">
							<Sparkles className="w-3.5 h-3.5 text-rose-500" />
							Try a pair:
						</span>
						{FAMOUS_COUPLES.slice(0, 4).map((pair) => (
							<button
								key={`${pair.name1}-${pair.name2}`}
								type="button"
								onClick={() => handlePrefillChip(pair.name1, pair.name2)}
								className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
							>
								{pair.name1} & {pair.name2}
							</button>
						))}
						<button
							type="button"
							onClick={handleTestAnotherPair}
							className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors cursor-pointer flex items-center gap-1"
							title="Pick a random famous couple"
						>
							<Shuffle className="w-3 h-3" />
							<span>Random</span>
						</button>
					</div>

					<Button
						onClick={calculateLove}
						disabled={isCalculating || !name1.trim() || !name2.trim()}
						className="w-full h-12 text-base font-extrabold rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] gap-2 border-0 cursor-pointer"
					>
						{isCalculating ? (
							<>
								<RefreshCw className="h-5 w-5 animate-spin" />
								<span>Aligning Stars & Chemistry...</span>
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

					{/* Social Sharing & Image Export Actions */}
					<div className="space-y-3 pt-1">
						{/* Primary Sharing Bar: Story / WhatsApp Image */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
							<Button
								onClick={() => openShareModal("story")}
								className="h-11 font-bold text-xs gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 text-white shadow-md shadow-rose-500/20 cursor-pointer"
							>
								<Smartphone className="h-4 w-4" />
								<span>Insta Story / Status Image</span>
							</Button>
							<Button
								onClick={() => openShareModal("square")}
								variant="secondary"
								className="h-11 font-bold text-xs gap-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 cursor-pointer text-foreground"
							>
								<ImageIcon className="h-4 w-4 text-rose-500" />
								<span>Square Post / Download</span>
							</Button>
						</div>

						{/* Quick Social Buttons */}
						<div className="grid grid-cols-3 gap-2">
							<Button
								onClick={handleWhatsAppShare}
								variant="outline"
								className="h-9 text-[11px] font-semibold gap-1.5 rounded-xl border-border/60 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30 cursor-pointer"
							>
								<MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
								<span>WhatsApp</span>
							</Button>

							<Button
								onClick={handleTwitterShare}
								variant="outline"
								className="h-9 text-[11px] font-semibold gap-1.5 rounded-xl border-border/60 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30 cursor-pointer"
							>
								<Share2 className="h-3.5 w-3.5 text-sky-500" />
								<span>X / Tweet</span>
							</Button>

							<Button
								onClick={handleCopy}
								variant="outline"
								className="h-9 text-[11px] font-semibold gap-1.5 rounded-xl border-border/60 hover:bg-muted cursor-pointer"
							>
								{copied ? (
									<>
										<Check className="h-3.5 w-3.5 text-emerald-500" />
										<span>Copied!</span>
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5 text-muted-foreground" />
										<span>Copy Text</span>
									</>
								)}
							</Button>
						</div>

						{/* Secondary Navigation */}
						<div className="pt-2">
							<Button
								onClick={handleTestAnotherPair}
								variant="ghost"
								className="w-full h-11 font-bold text-xs gap-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer border border-dashed border-rose-500/30"
							>
								<RefreshCw className="h-4 w-4" />
								<span>Test Another Pair (Prefill New Couple)</span>
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* High-Resolution Story / Status Share Modal */}
			<Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
				<DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl">
					<DialogHeader className="space-y-1 text-center">
						<DialogTitle className="text-lg font-extrabold flex items-center justify-center gap-1.5">
							<Sparkles className="w-4 h-4 text-rose-500" />
							<span>Share Love Compatibility Card</span>
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground">
							Export a high-resolution image tailored for Instagram Story, WhatsApp Status, or Feed.
						</DialogDescription>
					</DialogHeader>

					{/* Aspect Switcher Tabs */}
					<div className="flex items-center justify-center gap-1 p-1 rounded-xl bg-muted/60 text-xs font-medium">
						<button
							type="button"
							onClick={() => switchAspect("story")}
							className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
								shareAspect === "story"
									? "bg-background text-foreground font-bold shadow-xs"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<Smartphone className="w-3.5 h-3.5" />
							<span>9:16 Story / Status</span>
						</button>
						<button
							type="button"
							onClick={() => switchAspect("square")}
							className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
								shareAspect === "square"
									? "bg-background text-foreground font-bold shadow-xs"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							<ImageIcon className="w-3.5 h-3.5" />
							<span>1:1 Square Post</span>
						</button>
					</div>

					{/* Live Card Preview */}
					<div className="relative flex items-center justify-center p-2 rounded-xl bg-muted/30 border border-border/60 overflow-hidden">
						{generatingImage || !previewImageUrl ? (
							<div className="h-64 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
								<RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
								<span>Rendering high-res card...</span>
							</div>
						) : (
							<img
								src={previewImageUrl}
								alt="Love Compatibility Story Preview"
								className={`rounded-lg shadow-lg object-contain ${
									shareAspect === "story" ? "max-h-72 aspect-[9/16]" : "max-h-64 aspect-square"
								}`}
							/>
						)}
					</div>

					{/* Download & Share Trigger Buttons */}
					<div className="space-y-2 pt-1">
						<div className="grid grid-cols-2 gap-2">
							<Button
								onClick={handleNativeShare}
								disabled={generatingImage}
								className="h-10 text-xs font-bold gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
							>
								<Share2 className="w-3.5 h-3.5" />
								<span>Share to Apps</span>
							</Button>
							<Button
								onClick={handleDownloadImage}
								disabled={generatingImage}
								variant="secondary"
								className="h-10 text-xs font-bold gap-1.5 rounded-xl border border-border cursor-pointer"
							>
								<Download className="w-3.5 h-3.5" />
								<span>Download PNG</span>
							</Button>
						</div>

						<p className="text-[10px] text-center text-muted-foreground/70 leading-normal">
							Tip: On phones, tap <strong>Share to Apps</strong> to post directly to your Instagram Story or WhatsApp Status!
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
