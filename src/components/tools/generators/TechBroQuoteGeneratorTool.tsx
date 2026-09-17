"use client";

import { useState, useEffect } from "react";
import {
	Copy,
	RefreshCw,
	Rocket,
	Flame,
	Check,
	Sparkles,
	Sliders,
	Share2,
	Terminal,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackToolExecution } from "@/lib/analytics";

const PERSONAS = [
	{
		id: "founder",
		name: "🦄 Delusional Founder",
		role: "CEO & Visionary",
		jargonRating: "99% Pure Vision",
		prefix: "We are not building an app. We are building the operating system for human consciousness.",
	},
	{
		id: "linkedin",
		name: "💼 LinkedIn Guru",
		role: "Chief Synergy Officer",
		jargonRating: "97% Engagement Bait",
		prefix: "I fired my top engineer today. Here is what it taught me about B2B sales leadership: 🧵",
	},
	{
		id: "pitch",
		name: "⚡ Series A Pitch",
		role: "Stealth Mode Co-founder",
		jargonRating: "95% VC Bait",
		prefix: "It's like Uber meets Stripe for quantum AI agents. $40M pre-revenue SAFE note.",
	},
	{
		id: "eacc",
		name: "🤖 e/acc Tech Bro",
		role: "AGI Accelerationist",
		jargonRating: "100% Thermodynamic",
		prefix: "Compute is the only sovereign currency. Decels will not survive the cluster expansion.",
	},
	{
		id: "cto",
		name: "☕ 10x Burnout CTO",
		role: "Lead Platform Over-Architect",
		jargonRating: "92% Overengineered",
		prefix: "Our landing page is powered by 47 Kubernetes clusters and a custom distributed key-value store in Rust.",
	},
];

const TEMPLATES = [
	"We're not just {action}, we're {impact} the entire {industry} paradigm through {technology} at planetary scale.",
	"Think {comparison}, but horizontally integrated for {target_audience} using autonomous {technology}.",
	"Our mission is to eliminate {problem} by leveraging {technology} to supercharge {target_audience} across Web3 and AI.",
	"We raised a $12M seed round on a napkin to {action} {industry} workflows with real-time neural {technology}.",
	"Legacy {industry} is fundamentally broken. Our zero-knowledge {technology} engine turns {problem} into exponential ARR.",
	"We spent 8 months rewriting our {product} in Rust so {target_audience} can {action} with sub-millisecond quantum latency.",
];

const BUZZWORDS: Record<string, string[]> = {
	action: ["democratizing", "disrupting", "revolutionizing", "tokenizing", "hyper-scaling", "neuralizing", "automating", "vectorizing"],
	impact: ["reimagining", "supercharging", "rearchitecting", "paradigm-shifting", "quantum-accelerating"],
	industry: ["fintech", "proptech", "B2B SaaS", "healthtech", "crypto-infrastructure", "generative AI", "edtech", "agentic workflows"],
	technology: ["autonomous LLM agent swarms", "zero-knowledge rollups", "distributed state machines", "neural vector embeddings", "decentralized compute clusters"],
	target_audience: ["growth hackers", "crypto degens", "enterprise sales teams", "angel syndicates", "indie hackers", "tier-1 VCs"],
	comparison: ["Uber", "Linear", "Stripe", "Figma", "OpenAI", "Supabase", "Palantir"],
	product: ["multi-agent workspace", "synergy protocol", "developer cockpit", "revenue flywheel", "data pipeline"],
	problem: ["friction-filled churn", "legacy API latency", "cognitive overhead", "unscalable headcount", "fragmented tech debt"],
};

function getRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export default function TechBroQuoteGeneratorTool() {
	const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
	const [quote, setQuote] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const [slideNumber, setSlideNumber] = useState(3);
	const [formatMode, setFormatMode] = useState<"deck" | "linkedin" | "tweet">("deck");

	const generate = () => {
		setIsGenerating(true);
		const startTime = performance.now();

		setTimeout(() => {
			const template = getRandom(TEMPLATES);
			let res = template;
			Object.entries(BUZZWORDS).forEach(([key, list]) => {
				const regex = new RegExp(`{${key}}`, "g");
				res = res.replace(regex, getRandom(list));
			});

			setQuote(res);
			setSlideNumber(Math.floor(Math.random() * 12) + 2);
			setIsGenerating(false);

			trackToolExecution("tech-bro-quote-generator", {
				durationMs: performance.now() - startTime,
				success: true,
				action: "generate_quote",
				category: "generator",
			});
		}, 350);
	};

	useEffect(() => {
		generate();
	}, [selectedPersona]);

	const getFormattedOutput = () => {
		if (formatMode === "linkedin") {
			return `${selectedPersona.prefix}\n\n"${quote}"\n\nAgree? What is your team doing to stay ahead? Let's discuss in the comments 👇\n\n#Startup #AI #Disruption #VentureCapital #B2BSaaS #HyperGrowth`;
		}
		if (formatMode === "tweet") {
			return `1/7 ${selectedPersona.prefix}\n\n"${quote}"\n\nA thread on why 99% of legacy companies will be obsolete by Q4 🧵👇`;
		}
		return `"${quote}"\n\n— Slide ${slideNumber} of our Series A Deck (${selectedPersona.name})`;
	};

	const handleCopy = async () => {
		const text = getFormattedOutput();
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			console.error("Copy failed", e);
		}
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			{/* Persona Selector Chips */}
			<div className="space-y-2">
				<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
					Select Founder Persona
				</label>
				<div className="flex items-center justify-center flex-wrap gap-2">
					{PERSONAS.map((p) => (
						<button
							key={p.id}
							onClick={() => setSelectedPersona(p)}
							className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
								selectedPersona.id === p.id
									? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
									: "bg-secondary/60 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground"
							}`}
						>
							{p.name}
						</button>
					))}
				</div>
			</div>

			{/* Pitch Deck Slide Preview Card */}
			<div className="relative rounded-2xl border border-border/80 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden group">
				{/* Mac window / Deck header bar */}
				<div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/80 text-xs">
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
						<span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
						<span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
						<span className="ml-2 font-mono text-[11px] text-zinc-400">
							SLIDE_{String(slideNumber).padStart(2, "0")}_SYNERGY.DECK
						</span>
					</div>

					<div className="flex items-center gap-2">
						<span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
							{selectedPersona.jargonRating}
						</span>
					</div>
				</div>

				{/* Deck Content Body */}
				<div className="p-6 md:p-8 space-y-6">
					<div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
								YC
							</div>
							<div>
								<div className="font-bold text-xs text-zinc-200">{selectedPersona.role}</div>
								<div className="text-[10px] text-zinc-500 font-mono">Confidential // Series A Deck</div>
							</div>
						</div>

						<div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
							<button
								onClick={() => setFormatMode("deck")}
								className={`px-2 py-1 rounded-md transition-colors ${formatMode === "deck" ? "bg-zinc-800 text-zinc-100 font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
							>
								Deck
							</button>
							<button
								onClick={() => setFormatMode("linkedin")}
								className={`px-2 py-1 rounded-md transition-colors ${formatMode === "linkedin" ? "bg-zinc-800 text-zinc-100 font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
							>
								LinkedIn
							</button>
							<button
								onClick={() => setFormatMode("tweet")}
								className={`px-2 py-1 rounded-md transition-colors ${formatMode === "tweet" ? "bg-zinc-800 text-zinc-100 font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
							>
								X Thread
							</button>
						</div>
					</div>

					{/* The Quote */}
					<div className="min-h-[100px] flex items-center justify-center text-center px-2">
						{isGenerating ? (
							<div className="flex items-center gap-2 text-zinc-400 text-sm font-mono animate-pulse">
								<Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
								<span>Synthesizing multi-modal venture buzzwords...</span>
							</div>
						) : (
							<blockquote className="text-lg md:text-2xl font-extrabold tracking-tight text-zinc-100 leading-snug">
								&ldquo;{quote}&rdquo;
							</blockquote>
						)}
					</div>

					<div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-zinc-800/60">
						<span className="text-zinc-400 text-[11px] font-mono">
							Valuation: <span className="text-zinc-200 font-bold">$120M Pre-Money</span>
						</span>
						<span className="text-zinc-500 text-[11px]">
							Target: <span className="text-zinc-300 font-semibold">100x ARR Multiple</span>
						</span>
					</div>
				</div>
			</div>

			{/* Primary Action Buttons */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<Button
					onClick={generate}
					disabled={isGenerating}
					className="h-12 text-sm font-extrabold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 border-0 transition-all active:scale-[0.98] gap-2"
				>
					<RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
					<span>Scramble Another Buzzword</span>
				</Button>

				<Button
					onClick={handleCopy}
					variant={copied ? "secondary" : "outline"}
					className="h-12 text-sm font-bold rounded-xl border-border/60 hover:bg-secondary gap-2"
				>
					{copied ? (
						<>
							<Check className="w-4 h-4 text-emerald-500" />
							<span>Copied to Clipboard!</span>
						</>
					) : (
						<>
							<Copy className="w-4 h-4" />
							<span>Copy for {formatMode === "deck" ? "Pitch" : formatMode === "linkedin" ? "LinkedIn" : "X"}</span>
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
