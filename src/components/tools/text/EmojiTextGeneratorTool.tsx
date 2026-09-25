"use client";

import { useState, useMemo, useCallback } from "react";
import {
	ToolShell,
	ToolGrid,
	ToolGridMain,
	ToolGridSide,
	ToolPanel,
	ToolSectionTitle,
	ToolField,
} from "@/components/tools/shared/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Trash2, Download, Smile, Sparkles, Flame, Check } from "lucide-react";

type StyleMode = "clap" | "replace" | "spreader" | "frame" | "wall";

const EMOJI_DICTIONARY: Record<string, string> = {
	love: "❤️",
	heart: "💖",
	like: "👍",
	happy: "😊",
	smile: "😄",
	sad: "😢",
	cry: "😭",
	fire: "🔥",
	hot: "🔥",
	lit: "🔥",
	cool: "😎",
	cat: "🐱",
	dog: "🐶",
	money: "💰",
	cash: "💵",
	rich: "🤑",
	rocket: "🚀",
	star: "⭐",
	sun: "☀️",
	moon: "🌙",
	computer: "💻",
	laptop: "💻",
	code: "💻",
	coder: "👨‍💻",
	developer: "👨‍💻",
	tech: "🖥️",
	phone: "📱",
	mobile: "📱",
	student: "🎓",
	study: "📚",
	book: "📚",
	learn: "🧠",
	brain: "🧠",
	idea: "💡",
	bulb: "💡",
	project: "🛠️",
	tool: "🔧",
	build: "🔨",
	fast: "⚡",
	speed: "🏎️",
	lightning: "⚡",
	secure: "🔒",
	lock: "🔐",
	music: "🎵",
	song: "🎶",
	dance: "💃",
	party: "🎉",
	celebrate: "🥳",
	game: "🎮",
	win: "🏆",
	trophy: "🏆",
	coffee: "☕",
	tea: "🍵",
	pizza: "🍕",
	burger: "🍔",
	food: "🍲",
	work: "💼",
	job: "💼",
	gym: "💪",
	fitness: "🏋️",
	strong: "💪",
	time: "⏰",
	clock: "⌛",
	warning: "⚠️",
	alert: "🚨",
	stop: "🛑",
	check: "✅",
	cross: "❌",
	secret: "🤫",
	clap: "👏",
	eyes: "👀",
	skull: "💀",
	dead: "💀",
	flag: "🚩",
	peace: "✌️",
	magic: "✨",
	clean: "🧼",
	gift: "🎁",
	earth: "🌍",
	world: "🌐",
};

const COMMON_EMOJIS = ["👏", "🔥", "✨", "💀", "🚀", "❤️", "💯", "🚩", "👀", "💅", "🎉", "⭐", "🤫", "🍕", "⚡"];

export default function EmojiTextGeneratorTool() {
	const [text, setText] = useState<string>("SopKit tools are fast, private, and 100% free. No data ever leaves your device!");
	const [mode, setMode] = useState<StyleMode>("clap");
	const [selectedEmoji, setSelectedEmoji] = useState<string>("👏");
	const [replaceMode, setReplaceMode] = useState<"append" | "replace">("append");
	const [copied, setCopied] = useState<boolean>(false);

	const transformText = useCallback(
		(input: string, currentMode: StyleMode, emoji: string): string => {
			if (!input.trim()) return "";

			switch (currentMode) {
				case "clap": {
					const words = input.trim().split(/\s+/);
					return words.join(` ${emoji} `) + ` ${emoji}`;
				}
				case "replace": {
					const tokens = input.split(/(\s+|[.,!?;:()]+)/);
					return tokens
						.map((tok) => {
							const clean = tok.toLowerCase().trim();
							const match = EMOJI_DICTIONARY[clean];
							if (match) {
								return replaceMode === "append" ? `${tok} ${match}` : match;
							}
							return tok;
						})
						.join("");
				}
				case "spreader": {
					return input
						.split("")
						.map((char) => (char === " " ? "   " : `${char}${emoji}`))
						.join("");
				}
				case "frame": {
					const lines = input.split("\n");
					return lines
						.map((line) => {
							const trimmed = line.trim();
							if (!trimmed) return "";
							return `${emoji} ${trimmed} ${emoji}`;
						})
						.join("\n");
				}
				case "wall": {
					const border = emoji.repeat(10);
					return `${border}\n${input}\n${border}`;
				}
				default:
					return input;
			}
		},
		[replaceMode]
	);

	const outputText = useMemo(() => {
		return transformText(text, mode, selectedEmoji);
	}, [text, mode, selectedEmoji, transformText]);

	const stats = useMemo(() => {
		const rawChars = text.length;
		const outChars = outputText.length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		// Count emojis in output approximately
		const emojiMatches = outputText.match(/\p{Extended_Pictographic}/gu) || [];
		return {
			rawChars,
			outChars,
			words,
			emojiCount: emojiMatches.length,
		};
	}, [text, outputText]);

	const handleCopy = () => {
		if (!outputText) return;
		navigator.clipboard.writeText(outputText);
		setCopied(true);
		toast.success("Emoji text copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const handleClear = () => {
		setText("");
		toast.info("Input cleared");
	};

	const handleDownload = () => {
		if (!outputText) return;
		const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `emoji-text-${Date.now()}.txt`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Saved text file!");
	};

	return (
		<ToolShell>
			{/* Style Mode Switcher */}
			<div className="flex flex-wrap items-center gap-2 mb-6">
				<Button
					size="sm"
					variant={mode === "clap" ? "default" : "outline"}
					onClick={() => {
						setMode("clap");
						setSelectedEmoji("👏");
					}}
					className="rounded-full gap-1.5"
				>
					<span>👏</span> Clap Text
				</Button>
				<Button
					size="sm"
					variant={mode === "replace" ? "default" : "outline"}
					onClick={() => setMode("replace")}
					className="rounded-full gap-1.5"
				>
					<Sparkles className="h-4 w-4" /> Word to Emoji
				</Button>
				<Button
					size="sm"
					variant={mode === "spreader" ? "default" : "outline"}
					onClick={() => {
						setMode("spreader");
						setSelectedEmoji("✨");
					}}
					className="rounded-full gap-1.5"
				>
					<span>✨</span> Spreader
				</Button>
				<Button
					size="sm"
					variant={mode === "frame" ? "default" : "outline"}
					onClick={() => {
						setMode("frame");
						setSelectedEmoji("🔥");
					}}
					className="rounded-full gap-1.5"
				>
					<Flame className="h-4 w-4" /> Decorative Frame
				</Button>
				<Button
					size="sm"
					variant={mode === "wall" ? "default" : "outline"}
					onClick={() => {
						setMode("wall");
						setSelectedEmoji("⭐");
					}}
					className="rounded-full gap-1.5"
				>
					<span>⭐</span> Border Wall
				</Button>
			</div>

			<ToolGrid>
				{/* Main Inputs & Configuration */}
				<ToolGridMain>
					<ToolPanel>
						<div className="flex items-center justify-between mb-4">
							<ToolSectionTitle
								title="Input Text"
								description="Type or paste your caption, headline, or message."
							/>
							{text && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleClear}
									className="text-muted-foreground hover:text-destructive gap-1 text-xs"
								>
									<Trash2 className="h-3.5 w-3.5" /> Clear
								</Button>
							)}
						</div>

						<Textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Enter text to decorate with emojis..."
							rows={4}
							className="text-base font-sans leading-relaxed resize-y"
						/>

						{/* Quick Emoji Selector */}
						{mode !== "replace" && (
							<div className="mt-5 space-y-3">
								<ToolField label="Select Separator / Decorative Emoji">
									<div className="flex items-center gap-2">
										<Input
											value={selectedEmoji}
											onChange={(e) => setSelectedEmoji(e.target.value)}
											className="w-24 text-center text-xl h-10 font-sans"
											maxLength={4}
										/>
										<div className="flex flex-wrap gap-1.5">
											{COMMON_EMOJIS.map((emoji) => (
												<button
													key={emoji}
													type="button"
													onClick={() => setSelectedEmoji(emoji)}
													className={`h-9 w-9 text-base rounded-xl flex items-center justify-center transition-all ${
														selectedEmoji === emoji
															? "bg-primary/20 border-2 border-primary scale-110 shadow-sm"
															: "bg-muted hover:bg-muted/80 border border-border/50"
													}`}
												>
													{emoji}
												</button>
											))}
										</div>
									</div>
								</ToolField>
							</div>
						)}

						{/* Replace Mode Controls */}
						{mode === "replace" && (
							<div className="mt-5 p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
								<div className="space-y-0.5">
									<Label htmlFor="replace-toggle" className="text-sm font-semibold cursor-pointer">
										{replaceMode === "append" ? "Append Emoji (Word + 🚀)" : "Replace Word Only (🚀)"}
									</Label>
									<p className="text-xs text-muted-foreground">
										Toggle whether matched keywords are kept alongside emojis or replaced entirely.
									</p>
								</div>
								<Switch
									id="replace-toggle"
									checked={replaceMode === "replace"}
									onCheckedChange={(checked) => setReplaceMode(checked ? "replace" : "append")}
								/>
							</div>
						)}
					</ToolPanel>

					{/* Output Preview */}
					<ToolPanel className="mt-6">
						<div className="flex items-center justify-between mb-3">
							<ToolSectionTitle
								title="Emoji Output"
								description="Formatted message ready to copy and paste to Twitter/X, Instagram, or TikTok."
							/>
							<div className="flex items-center gap-2">
								{outputText && (
									<Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
										<Download className="h-3.5 w-3.5" /> Save
									</Button>
								)}
								<Button
									size="sm"
									onClick={handleCopy}
									disabled={!outputText}
									className="gap-1.5 font-semibold text-xs"
								>
									{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
									{copied ? "Copied!" : "Copy"}
								</Button>
							</div>
						</div>

						<Textarea
							readOnly
							value={outputText}
							rows={6}
							className="text-base font-sans bg-muted/20 leading-relaxed resize-y"
							placeholder="Your formatted emoji text will appear here..."
						/>

						<div className="mt-4 flex flex-wrap gap-3">
							<Button
								onClick={handleCopy}
								disabled={!outputText}
								size="lg"
								className="gap-2 font-semibold shadow-sm w-full sm:w-auto"
							>
								{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
								{copied ? "Copied to Clipboard!" : "Copy Formatted Text"}
							</Button>
						</div>
					</ToolPanel>
				</ToolGridMain>

				{/* Sidebar Metrics & Tips */}
				<ToolGridSide>
					<ToolPanel>
						<ToolSectionTitle
							title="Content Metrics"
							description="Real-time character and emoji counts."
						/>
						<div className="space-y-3 mt-4 text-sm">
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Original Length</span>
								<span className="font-mono font-semibold">{stats.rawChars} chars</span>
							</div>
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Formatted Output</span>
								<span className="font-mono font-bold text-primary">{stats.outChars} chars</span>
							</div>
							<div className="flex justify-between py-2 border-b border-border/50">
								<span className="text-muted-foreground">Word Count</span>
								<span className="font-mono font-semibold">{stats.words} words</span>
							</div>
							<div className="flex justify-between py-2">
								<span className="text-muted-foreground">Emojis Added</span>
								<span className="font-mono font-semibold text-emerald-500">{stats.emojiCount}</span>
							</div>
						</div>
					</ToolPanel>

					<ToolPanel className="mt-6">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<Smile className="h-4 w-4 text-primary" />
								Social Media Formatting Tips
							</h3>
							<p>
								<strong>Clap Text:</strong> Popularized on Twitter/X to emphasize strong points or humorous sarcasm. Keep sentences under 15 words to avoid excessive vertical wrapping on mobile screens.
							</p>
							<p>
								<strong>Decorative Frames:</strong> Perfect for TikTok bio headlines, YouTube channel headers, and Instagram announcements to make key bullet points stand out in crowded feeds.
							</p>
							<p>
								<strong>Unicode Safety:</strong> All standard emojis use Unicode surrogate pairs and render natively across iOS, Android, macOS, and Windows without external font dependencies.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
