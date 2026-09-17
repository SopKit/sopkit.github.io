"use client";

import { useState } from "react";
import {
	Flame,
	RefreshCw,
	Copy,
	Check,
	Sparkles,
	Sliders,
	Share2,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trackToolExecution } from "@/lib/analytics";

const WORK_ARCHETYPES = [
	{ id: "tabs", name: "🐿️ 60-Tab Multitasker", desc: "Attention span of a caffeinated squirrel" },
	{ id: "procrastinator", name: "⏰ Deadline Adrenaline Addict", desc: "Only works when the panic hits" },
	{ id: "perfectionist", name: "🎨 Font Over-Thinker", desc: "Rewrites the opening sentence for 3 hours" },
	{ id: "notion", name: "📋 Notion Architect", desc: "Organizes systems instead of doing actual work" },
	{ id: "meeting", name: "📅 Calendar Victim", desc: "7 back-to-back meetings to discuss what needs to be discussed" },
	{ id: "rust", name: "☕ Over-Engineer", desc: "Why do a 5-minute task when you can automate it in 3 weeks?" },
];

const INTENSITIES = [
	{ id: "mild", label: "Mild Sarcasm 🌶️", multiplier: "Gentle nudge" },
	{ id: "spicy", label: "Direct Hit 🔥", multiplier: "Unfiltered truth" },
	{ id: "nuclear", label: "Third-Degree Burn 🌋", multiplier: "Thermonuclear reality check" },
];

const ROAST_TEMPLATES: Record<string, Record<string, string[]>> = {
	tabs: {
		mild: [
			"You have 58 browser tabs open, and 40 of them are articles from 2021 you promised yourself you'd 'read this weekend'. Your RAM is crying.",
			"Closing one browser tab won't kill you, but keeping 73 open might crash your computer and your remaining sanity.",
		],
		spicy: [
			"You treat browser tabs like Pokemon: you gotta hoard 'em all. You’re not multitasking; you’re just creating a high-speed carousel of distraction.",
			"Having 60 tabs open doesn't make you a researcher; it makes you a hoarder of unfinished thoughts.",
		],
		nuclear: [
			"Your computer fans are spinning at jet-engine decibels because you refuse to close 82 tabs of half-read documentation you will literally never look at again. Reboot your life.",
		],
	},
	procrastinator: {
		mild: [
			"You tell people you 'work better under pressure'. No, you just work when the terror of public humiliation finally outweighs your desire to nap.",
			"Your greatest productivity hack is waiting until 11:54 PM for a midnight deadline. Heart disease loves this workflow.",
		],
		spicy: [
			"Procrastinating for 6 hours followed by a 25-minute adrenaline panic is not an agile sprint. It’s an involuntary cardiovascular test.",
			"You don't need a Pomodoro timer. You need someone to confiscate your phone and revoke your WiFi privileges.",
		],
		nuclear: [
			"You spent 4 hours researching 'how to enter flow state' instead of doing the 10-minute task. You're not stuck in analysis paralysis; you're just avoiding accountability.",
		],
	},
	perfectionist: {
		mild: [
			"You've been adjusting the margins of this document for 45 minutes. The client is going to read it on a cracked iPhone screen while waiting for an elevator.",
			"Perfectionism is just procrastination dressed up in a tuxedo. Hit publish and deal with the typo.",
		],
		spicy: [
			"You’re on draft 14 of an email that will receive a reply of 'thx'. Move on.",
			"The difference between good and perfect is 10 extra hours nobody asked for. Ship it.",
		],
		nuclear: [
			"You call it 'high standards', but everyone else calls it 'the reason this project is 3 weeks late'. Done is better than perfect.",
		],
	},
	notion: {
		mild: [
			"You spent the entire morning color-coding a Notion database about getting work done. Work completed: 0. Notion aesthetics: 10/10.",
			"Your to-do list has a to-do list, which links to a Kanban board, which links to your existential dread.",
		],
		spicy: [
			"Building aesthetic dashboards is not work. You built an entire operating system to track three tasks you're still not doing.",
			"If you spent half the energy doing the work as you did customizing your task widgets, you'd be CEO by now.",
		],
		nuclear: [
			"Congratulations! You created the most visually stunning Notion workspace on earth to track the fact that you haven't shipped a single thing all week.",
		],
	},
	meeting: {
		mild: [
			"That 45-minute sync could have been an email. That email could have been a Slack message. That Slack message could have been ignored entirely.",
			"You scheduled a meeting to prepare for the pre-meeting to align on the upcoming retrospective.",
		],
		spicy: [
			"You have 8 hours of calls today. When do you actually do the work? Oh right, at midnight when you should be sleeping.",
			"Nodding and saying 'let's take this offline' is not a full-time job, yet somehow here we are.",
		],
		nuclear: [
			"You’re hiding behind calendar invites because actually sitting alone with your thoughts and doing deep work is terrifying. Decline the invite.",
		],
	},
	rust: {
		mild: [
			"You spent 3 days writing a script in Rust to automate a task that takes 12 seconds once every two months.",
			"Why solve a problem with 2 lines of Python when you can spend 4 weeks battling the borrow checker?",
		],
		spicy: [
			"Your microservice architecture has more layers of abstraction than a philosophical treatise. It serves 4 requests an hour.",
			"You didn't fix the bug. You just rewrote the logging framework in WebAssembly. Nobody asked for this.",
		],
		nuclear: [
			"You turned a static landing page into a Kubernetes-orchestrated, event-driven, Kafka-streamed distributed nightmare. Go touch grass.",
		],
	},
};

function getRandomRoast(archetype: string, intensity: string): string {
	const set = ROAST_TEMPLATES[archetype]?.[intensity] || ROAST_TEMPLATES.tabs.spicy;
	return set[Math.floor(Math.random() * set.length)];
}

export default function ProductivityRoastGeneratorTool() {
	const [archetype, setArchetype] = useState(WORK_ARCHETYPES[0].id);
	const [intensity, setIntensity] = useState("spicy");
	const [customHabit, setCustomHabit] = useState("");
	const [roast, setRoast] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);

	const generate = () => {
		setIsGenerating(true);
		const start = performance.now();

		setTimeout(() => {
			let res = getRandomRoast(archetype, intensity);
			if (customHabit.trim()) {
				res = `"${customHabit.trim()}" — Wow. ${res}`;
			}
			setRoast(res);
			setIsGenerating(false);

			trackToolExecution("productivity-roast-generator", {
				durationMs: performance.now() - start,
				success: true,
				action: "generate_roast",
				category: "generator",
			});
		}, 300);
	};

	const handleCopy = async () => {
		if (!roast) return;
		try {
			await navigator.clipboard.writeText(`🔥 Productivity Roast:\n\n"${roast}"\n\nGet roasted at https://sopkit.space/productivity-roast-generator/`);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (e) {
			console.error("Copy failed", e);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Work Archetype Selector */}
			<div className="space-y-2">
				<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center">
					Select Your Work Vice
				</label>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{WORK_ARCHETYPES.map((w) => (
						<button
							key={w.id}
							onClick={() => setArchetype(w.id)}
							className={`p-2.5 rounded-xl text-left border transition-all ${
								archetype === w.id
									? "bg-amber-500/10 border-amber-500/50 text-foreground shadow-xs font-bold"
									: "bg-secondary/40 hover:bg-secondary/70 border-border/60 text-muted-foreground"
							}`}
						>
							<div className="text-xs font-bold truncate">{w.name}</div>
							<div className="text-[10px] text-muted-foreground truncate">{w.desc}</div>
						</button>
					))}
				</div>
			</div>

			{/* Intensity Level Tabs */}
			<div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-secondary/50 border border-border/60 w-fit mx-auto">
				{INTENSITIES.map((lvl) => (
					<button
						key={lvl.id}
						onClick={() => setIntensity(lvl.id)}
						className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
							intensity === lvl.id
								? "bg-amber-500 text-zinc-950 font-extrabold shadow-xs"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{lvl.label}
					</button>
				))}
			</div>

			{/* Optional Specific Habit */}
			<div className="space-y-1.5">
				<label className="text-xs font-semibold text-muted-foreground block">
					Specific guilty habit (optional):
				</label>
				<input
					type="text"
					value={customHabit}
					onChange={(e) => setCustomHabit(e.target.value)}
					placeholder="e.g. I reorganize my desk whenever I need to write an important report..."
					className="w-full h-11 px-3.5 text-xs rounded-xl bg-background/60 border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
				/>
			</div>

			{/* Trigger Button */}
			<Button
				onClick={generate}
				disabled={isGenerating}
				className="w-full h-12 text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-zinc-950 shadow-lg shadow-orange-500/20 border-0 transition-all active:scale-[0.99] gap-2"
			>
				{isGenerating ? (
					<>
						<RefreshCw className="w-4 h-4 animate-spin" />
						<span>Preheating the Grill...</span>
					</>
				) : (
					<>
						<Flame className="w-4 h-4 fill-current" />
						<span>Roast My Productivity</span>
					</>
				)}
			</Button>

			{/* Output Card */}
			{roast && (
				<div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-amber-500/10 via-background/40 to-transparent border border-amber-500/30 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
					<div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
						<span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
							<Flame className="w-4 h-4 fill-current" />
							<span>Tough Love Diagnostic</span>
						</span>
						<span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
							Burn Level: 9.8 / 10
						</span>
					</div>

					<blockquote className="text-base md:text-lg font-bold text-foreground leading-relaxed">
						&ldquo;{roast}&rdquo;
					</blockquote>

					<div className="pt-2 flex items-center justify-end gap-2 border-t border-border/40">
						<Button
							onClick={handleCopy}
							size="sm"
							variant={copied ? "secondary" : "default"}
							className="h-9 text-xs font-bold rounded-xl gap-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950"
						>
							{copied ? (
								<>
									<Check className="w-3.5 h-3.5" />
									<span>Copied!</span>
								</>
							) : (
								<>
									<Copy className="w-3.5 h-3.5" />
									<span>Copy Roast</span>
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
