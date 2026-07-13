"use client";

import React, { useState } from "react";
import { 
	ShuffleIcon, 
	CopyIcon, 
	CheckCircleIcon,
	DownloadIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "../shared/WorkspaceComponents";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function RandomWordGeneratorTool() {
	const wordCategories = {
		general: [
			"apple", "river", "mountain", "keyboard", "guitar", "window", "ocean", "forest", "galaxy", "rocket",
			"coffee", "bridge", "desert", "castle", "planet", "valley", "canvas", "pencil", "wallet", "compass",
			"candle", "island", "palace", "shadow", "mirror", "tunnel", "cloud", "meadow", "lantern", "feather",
			"voyage", "beacon", "pinnacle", "summit", "canyon", "tundra", "glacier", "savanna", "harbor", "anchor",
			"concept", "system", "design", "module", "kernel", "syntax", "matrix", "vector", "binary", "cursor"
		],
		nouns: [
			"architect", "balloon", "camera", "diamond", "elephant", "fountain", "generator", "helmet", "infinite", "journal",
			"kingdom", "library", "monument", "navigator", "octopus", "pyramid", "quiver", "rainbow", "station", "telescope",
			"umbrella", "volcano", "waterfall", "xenon", "yacht", "zebra", "airport", "bicycle", "crystal", "dolphin",
			"exhibit", "festival", "gateway", "horizon", "iceberg", "journey", "keynote", "lantern", "merchant", "network",
			"opinion", "pattern", "quarter", "receipt", "silicon", "texture", "utopia", "vintage", "whisper", "zenith"
		],
		verbs: [
			"achieve", "balance", "create", "discover", "examine", "flourish", "generate", "harness", "inspire", "journey",
			"kindle", "launch", "navigate", "observe", "produce", "quantify", "resolve", "structure", "transform", "unify",
			"validate", "witness", "explore", "connect", "integrate", "compile", "optimize", "analyze", "configure", "debug",
			"develop", "execute", "render", "serialize", "parse", "format", "compress", "resize", "convert", "generate",
			"publish", "deploy", "leverage", "augment", "enhance", "maximize", "accelerate", "stabilize", "refactor", "secure"
		],
		adjectives: [
			"artistic", "brilliant", "creative", "dynamic", "elegant", "flexible", "graceful", "harmonic", "infinite", "joyful",
			"luminous", "magnetic", "natural", "organic", "peaceful", "resilient", "stellar", "timeless", "vibrant", "worthy",
			"exquisite", "sublime", "majestic", "serene", "radiant", "pristine", "robust", "optimal", "scalable", "modular",
			"responsive", "secure", "private", "seamless", "intuitive", "harmonious", "vivid", "rustic", "modern", "classic",
			"minimal", "luxurious", "vanguard", "cryptic", "fluid", "adaptive", "agile", "strategic", "tactical", "profound"
		]
	};

	const [category, setCategory] = useState("general");
	const [wordCount, setWordCount] = useState([10]);
	const [wordCase, setWordCase] = useState("lowercase");
	const [words, setWords] = useState([]);
	const [copied, setCopied] = useState(false);

	const generateWords = () => {
		const pool = wordCategories[category];
		const result = [];
		const count = wordCount[0];

		for (let i = 0; i < count; i++) {
			const randomIndex = Math.floor(Math.random() * pool.length);
			let word = pool[randomIndex];

			if (wordCase === "uppercase") {
				word = word.toUpperCase();
			} else if (wordCase === "capitalize") {
				word = word.charAt(0).toUpperCase() + word.slice(1);
			}

			result.push(word);
		}

		setWords(result);
		setIsDone(true);
	};

	const [isDone, setIsDone] = useState(false);

	React.useEffect(() => {
		generateWords();
	}, [category, wordCount, wordCase]);

	const copyToClipboard = () => {
		if (words.length === 0) return;
		navigator.clipboard.writeText(words.join(", "));
		setCopied(true);
		toast.success("Words copied to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const downloadTxt = () => {
		if (words.length === 0) return;
		const blob = new Blob([words.join("\n")], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `random_words_sopkit.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="w-full max-w-5xl mx-auto space-y-12 pb-24 animate-in">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Settings */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 space-y-6">
						<h3 className="text-2xl font-bold flex items-center gap-2 mb-4">
							<ShuffleIcon className="text-primary w-6 h-6 animate-spin-slow" />
							Generator Settings
						</h3>

						<div className="space-y-6">
							<div className="space-y-2">
								<label className="block text-sm font-bold">Word Category</label>
								<Select value={category} onValueChange={setCategory}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/40 hover:border-primary/40 transition-all font-bold">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="general" className="rounded-lg">General Vocabulary</SelectItem>
										<SelectItem value="nouns" className="rounded-lg">Nouns Only</SelectItem>
										<SelectItem value="verbs" className="rounded-lg">Verbs Only</SelectItem>
										<SelectItem value="adjectives" className="rounded-lg">Adjectives Only</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-4">
								<div className="flex justify-between items-end">
									<label className="text-sm font-bold">Words to Generate</label>
									<span className="text-2xl font-black text-primary font-mono">{wordCount[0]}</span>
								</div>
								<Slider
									value={wordCount}
									onValueChange={setWordCount}
									min={1}
									max={50}
									step={1}
									className="py-2"
								/>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-bold">Text Case</label>
								<Select value={wordCase} onValueChange={setWordCase}>
									<SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/40 hover:border-primary/40 transition-all font-bold">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl border-border/40">
										<SelectItem value="lowercase" className="rounded-lg">lowercase</SelectItem>
										<SelectItem value="uppercase" className="rounded-lg">UPPERCASE</SelectItem>
										<SelectItem value="capitalize" className="rounded-lg">Capitalize</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								onClick={generateWords}
								className="w-full h-14 rounded-xl font-bold bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								<ShuffleIcon className="w-5 h-5" />
								REROLL WORDS
							</Button>
						</div>
					</GlassCard>
				</div>

				{/* Display Output */}
				<div className="lg:col-span-6 space-y-8">
					<GlassCard className="p-8 flex flex-col h-full">
						<div className="flex justify-between items-center mb-6">
							<span className="font-bold text-2xl">Generated Words</span>
							<Badge variant="secondary" className="px-3 py-1 font-mono">Count: {words.length}</Badge>
						</div>

						<div className="flex-1 min-h-60 bg-muted/10 border border-border/40 rounded-2xl p-6 overflow-y-auto max-h-80 custom-scrollbar">
							<div className="flex flex-wrap gap-2.5">
								{words.map((w, idx) => (
									<Badge 
										key={idx} 
										variant="outline" 
										className="px-4 py-2 text-base font-bold bg-background/40 hover:bg-primary/10 hover:border-primary/40 transition-all rounded-xl select-all cursor-pointer"
									>
										{w}
									</Badge>
								))}
							</div>
						</div>

						<div className="mt-8 grid grid-cols-2 gap-4">
							<Button
								onClick={copyToClipboard}
								disabled={words.length === 0}
								variant="outline"
								className="h-14 rounded-xl font-bold border-border/40 hover:border-primary/40 hover:bg-primary/[0.02] flex items-center justify-center gap-2"
							>
								{copied ? (
									<>
										<CheckCircleIcon className="w-5 h-5 text-emerald-500" />
										COPIED!
									</>
								) : (
									<>
										<CopyIcon className="w-5 h-5 text-muted-foreground" />
										COPY ALL
									</>
								)}
							</Button>

							<Button
								onClick={downloadTxt}
								disabled={words.length === 0}
								className="h-14 rounded-xl font-bold bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
							>
								<DownloadIcon className="w-5 h-5" />
								DOWNLOAD TXT
							</Button>
						</div>
					</GlassCard>
				</div>
			</div>
		</div>
	);
}
