"use client";

import React, { useState } from "react";
import { 
	SmileIcon, 
	CopyIcon, 
	CheckCircleIcon,
	TrashIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function EmojiTextGeneratorTool() {
	const [inputText, setInputText] = useState("SopKit tools are fast and secure. We love writing clean code to help developers and students create amazing projects!");
	const [activeStyle, setActiveStyle] = useState("clap"); // clap, replace, decorate
	const [outputText, setOutputText] = useState("");
	const [copied, setCopied] = useState(false);

	const emojiDictionary = {
		love: "❤️",
		like: "👍",
		happy: "😊",
		cat: "🐱",
		dog: "🐶",
		money: "💰",
		rocket: "🚀",
		fire: "🔥",
		star: "⭐",
		computer: "💻",
		code: "💻",
		developer: "👨‍💻",
		student: "🎓",
		book: "📚",
		project: "🛠️",
		tool: "🔧",
		fast: "⚡",
		secure: "🔒",
		music: "🎵",
		game: "🎮"
	};

	const generateEmojiText = (text, style) => {
		if (!text) {
			setOutputText("");
			return;
		}

		let result = "";

		if (style === "clap") {
			// Clap text: inserts 👏 between every word
			result = text.trim().split(/\s+/).join(" 👏 ") + " 👏";
		} else if (style === "replace") {
			// Emoji replacer: replaces known keywords
			let words = text.split(/(\s+)/);
			words = words.map(word => {
				const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
				if (emojiDictionary[cleanWord]) {
					return word + " " + emojiDictionary[cleanWord];
				}
				return word;
			});
			result = words.join("");
		} else if (style === "decorate") {
			// Decora: surrounds lines with sparkle or fire emojis
			const lines = text.split("\n");
			result = lines.map(line => {
				if (line.trim() === "") return "";
				return `✨ ${line.trim()} ✨`;
			}).join("\n");
		}

		setOutputText(result);
	};

	React.useEffect(() => {
		generateEmojiText(inputText, activeStyle);
	}, [inputText, activeStyle]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputText);
		setCopied(true);
		toast.success("Text copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const clearAll = () => {
		setInputText("");
		setOutputText("");
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Configuration */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8">
						<div className="flex justify-between items-center mb-6">
							<span className="font-bold text-2xl flex items-center gap-2">
								<SmileIcon className="text-primary w-6 h-6" />
								Configuration
							</span>
							{inputText && (
								<Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
									<TrashIcon className="h-4 w-4 mr-2" />
									Clear
								</Button>
							)}
						</div>

						<div className="space-y-6">
							<div>
								<label className="block text-sm font-bold mb-2">Select Formatting Style</label>
								<Tabs defaultValue="clap" className="w-full" onValueChange={setActiveStyle}>
									<TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-xl border border-border/40 h-12">
										<TabsTrigger value="clap" className="rounded-lg font-bold">Clap Text 👏</TabsTrigger>
										<TabsTrigger value="replace" className="rounded-lg font-bold">Word-Emoji 🚀</TabsTrigger>
										<TabsTrigger value="decorate" className="rounded-lg font-bold">Decorate ✨</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-bold">Your Text</label>
								<textarea
									value={inputText}
									onChange={(e) => setInputText(e.target.value)}
									placeholder="Type or paste text here to add emoji magic..."
									className="w-full h-44 bg-muted/20 border border-border/40 rounded-2xl p-4 font-sans text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none custom-scrollbar"
								/>
							</div>
						</div>
					</GlassCard>
				</div>

				{/* Results */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full">
						<span className="font-bold text-2xl mb-6">Output</span>

						<div className="flex-1 min-h-48 bg-muted/10 border border-border/40 rounded-2xl p-6 font-sans text-lg leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-72 custom-scrollbar">
							{outputText || <span className="text-muted-foreground text-sm italic">Emoji text will appear here...</span>}
						</div>

						<div className="mt-6 flex justify-end">
							<Button
								onClick={copyToClipboard}
								disabled={!outputText}
								className="h-14 px-8 rounded-2xl font-bold bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 w-full sm:w-auto"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5" />
										COPIED!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5" />
										COPY TO CLIPBOARD
									</>
								)}
							</Button>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
