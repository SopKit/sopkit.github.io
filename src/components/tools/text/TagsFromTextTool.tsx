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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Hash, Trash2, Plus, Download, Sparkles, Check, CheckSquare } from "lucide-react";

interface TagsFromTextProps {
	prefix?: string;
}

type CasingType = "lowercase" | "pascal" | "camel" | "upper";
type PlatformPreset = "all" | "instagram" | "tiktok" | "twitter" | "linkedin" | "youtube";

const STOP_WORDS = new Set([
	"a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
	"as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
	"can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
	"down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
	"haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
	"himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
	"it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
	"not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
	"over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
	"such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
	"these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
	"under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
	"what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
	"why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
	"yours", "yourself", "yourselves", "also", "just", "like", "will", "get", "one", "make"
]);

const SAMPLE_TEXT = `Digital creators and social media marketers are constantly searching for ways to boost engagement on Instagram Reels, TikTok videos, and LinkedIn newsletters. Using high-relevance hashtags and strategic keywords helps your content rank higher in discoverability algorithms. Learn how to craft authentic captions, optimize visual aesthetics, and build community trust organically without spending thousands on paid advertisements!`;

export default function TagsFromTextTool({ prefix = "#" }: TagsFromTextProps) {
	const [text, setText] = useState<string>(SAMPLE_TEXT);
	const [customPrefix, setCustomPrefix] = useState<string>(prefix);
	const [casing, setCasing] = useState<CasingType>("pascal");
	const [maxCount, setMaxCount] = useState<string>("15");
	const [minWordLength, setMinWordLength] = useState<string>("3");
	const [filterStopWords, setFilterStopWords] = useState<boolean>(true);
	const [customTagInput, setCustomTagInput] = useState<string>("");
	const [extraTags, setExtraTags] = useState<string[]>([]);
	const [deselectedTags, setDeselectedTags] = useState<Set<string>>(new Set());
	const [copied, setCopied] = useState<boolean>(false);

	// Extract and rank keywords by frequency
	const extractedTags = useMemo(() => {
		if (!text.trim()) return [];

		const minLen = Math.max(2, Math.min(10, parseInt(minWordLength, 10) || 3));
		// Clean and tokenize words
		const words = text
			.toLowerCase()
			.replace(/https?:\/\/\S+/g, "")
			.replace(/[^\p{L}\p{N}\s]/gu, " ")
			.split(/\s+/)
			.filter((w) => w.length >= minLen);

		const freqMap = new Map<string, number>();

		for (const w of words) {
			if (filterStopWords && STOP_WORDS.has(w)) continue;
			freqMap.set(w, (freqMap.get(w) || 0) + 1);
		}

		// Sort by frequency descending, then alphabetically
		const sorted = Array.from(freqMap.entries())
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([word]) => word);

		const limit = Math.max(1, Math.min(50, parseInt(maxCount, 10) || 15));
		const combined = Array.from(new Set([...extraTags, ...sorted])).slice(0, limit);

		return combined;
	}, [text, minWordLength, filterStopWords, maxCount, extraTags]);

	// Apply casing formatting
	const formatTag = useCallback(
		(raw: string, currentCasing: CasingType, pfx: string): string => {
			const clean = raw.replace(/[^\p{L}\p{N}]/gu, "");
			if (!clean) return "";

			let formatted = clean;
			if (currentCasing === "lowercase") {
				formatted = clean.toLowerCase();
			} else if (currentCasing === "upper") {
				formatted = clean.toUpperCase();
			} else if (currentCasing === "pascal") {
				formatted = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
			} else if (currentCasing === "camel") {
				formatted = clean.charAt(0).toLowerCase() + clean.slice(1).toLowerCase();
			}

			return `${pfx}${formatted}`;
		},
		[]
	);

	// Active selected tags
	const activeTags = useMemo(() => {
		return extractedTags
			.filter((tag) => !deselectedTags.has(tag))
			.map((tag) => formatTag(tag, casing, customPrefix));
	}, [extractedTags, deselectedTags, casing, customPrefix, formatTag]);

	// Delimited outputs
	const spaceDelimited = activeTags.join(" ");
	const commaDelimited = activeTags.join(", ");
	const newlineDelimited = activeTags.join("\n");

	const toggleTag = (rawTag: string) => {
		setDeselectedTags((prev) => {
			const next = new Set(prev);
			if (next.has(rawTag)) {
				next.delete(rawTag);
			} else {
				next.add(rawTag);
			}
			return next;
		});
	};

	const handleAddCustomTag = () => {
		const clean = customTagInput.trim().replace(/^#+/, "");
		if (clean && !extraTags.includes(clean)) {
			setExtraTags((prev) => [clean, ...prev]);
			setCustomTagInput("");
			toast.success(`Added #${clean}`);
		}
	};

	const handlePreset = (presetType: PlatformPreset) => {
		switch (presetType) {
			case "instagram":
				setMaxCount("10");
				setCasing("pascal");
				setFilterStopWords(true);
				break;
			case "tiktok":
				setMaxCount("6");
				setCasing("lowercase");
				setFilterStopWords(true);
				break;
			case "twitter":
				setMaxCount("3");
				setCasing("pascal");
				setFilterStopWords(true);
				break;
			case "linkedin":
				setMaxCount("5");
				setCasing("pascal");
				setFilterStopWords(true);
				break;
			case "youtube":
				setMaxCount("15");
				setCasing("lowercase");
				setFilterStopWords(true);
				break;
			case "all":
				setMaxCount("25");
				break;
		}
	};

	const handleCopy = (content: string, label: string) => {
		if (!content) return;
		navigator.clipboard.writeText(content);
		setCopied(true);
		toast.success(`Copied ${label}!`);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		if (!spaceDelimited) return;
		const blob = new Blob([newlineDelimited], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `extracted-hashtags-${Date.now()}.txt`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("Downloaded hashtag list!");
	};

	return (
		<ToolShell>
			{/* Platform presets */}
			<div className="flex flex-wrap items-center gap-2 mb-6">
				<Button size="sm" variant="outline" onClick={() => handlePreset("instagram")} className="rounded-full gap-1.5">
					<span>📸</span> Instagram (8-10 tags)
				</Button>
				<Button size="sm" variant="outline" onClick={() => handlePreset("tiktok")} className="rounded-full gap-1.5">
					<span>🎵</span> TikTok (5-6 tags)
				</Button>
				<Button size="sm" variant="outline" onClick={() => handlePreset("twitter")} className="rounded-full gap-1.5">
					<span>🐦</span> Twitter/X (3 tags)
				</Button>
				<Button size="sm" variant="outline" onClick={() => handlePreset("linkedin")} className="rounded-full gap-1.5">
					<span>💼</span> LinkedIn (3-5 tags)
				</Button>
				<Button size="sm" variant="outline" onClick={() => handlePreset("youtube")} className="rounded-full gap-1.5">
					<span>▶️</span> YouTube Tags
				</Button>
			</div>

			<ToolGrid>
				{/* Main Inputs & Extraction Area */}
				<ToolGridMain>
					<ToolPanel>
						<div className="flex items-center justify-between mb-4">
							<ToolSectionTitle
								title="Source Text or Caption"
								description="Paste blog copy, descriptions, or article paragraphs for keyword extraction."
							/>
							{text && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setText("")}
									className="text-muted-foreground hover:text-destructive gap-1 text-xs"
								>
									<Trash2 className="h-3.5 w-3.5" /> Clear
								</Button>
							)}
						</div>

						<Textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							rows={6}
							className="font-sans text-base leading-relaxed resize-y"
							placeholder="Paste text here to automatically extract relevant hashtags..."
						/>

						{/* Settings Controls */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
							<ToolField label="Prefix Symbol">
								<Input
									value={customPrefix}
									onChange={(e) => setCustomPrefix(e.target.value)}
									className="font-mono text-center"
									maxLength={2}
								/>
							</ToolField>

							<ToolField label="Casing Style">
								<Select value={casing} onValueChange={(val: CasingType) => setCasing(val)}>
									<SelectTrigger>
										<SelectValue placeholder="Casing" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="pascal">#PascalCase (Recommended)</SelectItem>
										<SelectItem value="lowercase">#lowercase</SelectItem>
										<SelectItem value="camel">#camelCase</SelectItem>
										<SelectItem value="upper">#UPPERCASE</SelectItem>
									</SelectContent>
								</Select>
							</ToolField>

							<ToolField label="Max Tags Count (1 - 50)">
								<Input
									type="number"
									min="1"
									max="50"
									value={maxCount}
									onChange={(e) => setMaxCount(e.target.value)}
									className="font-mono"
								/>
							</ToolField>
						</div>

						{/* Stop Words & Custom Tag injection */}
						<div className="mt-5 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
								<div className="space-y-0.5 pr-2">
									<Label htmlFor="stop-words-toggle" className="text-sm font-semibold cursor-pointer">
										Filter Stop Words
									</Label>
									<p className="text-xs text-muted-foreground">
										Exclude filler words ("the", "and", "with", "are").
									</p>
								</div>
								<Switch
									id="stop-words-toggle"
									checked={filterStopWords}
									onCheckedChange={setFilterStopWords}
								/>
							</div>

							<div className="flex items-center gap-2">
								<Input
									value={customTagInput}
									onChange={(e) => setCustomTagInput(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
									placeholder="Add custom tag (e.g. viral)"
									className="text-sm"
								/>
								<Button size="sm" onClick={handleAddCustomTag} className="gap-1 font-semibold">
									<Plus className="h-4 w-4" /> Add
								</Button>
							</div>
						</div>
					</ToolPanel>

					{/* Interactive Interactive Tag Selector */}
					<ToolPanel className="mt-6">
						<div className="flex items-center justify-between mb-3">
							<ToolSectionTitle
								title="Extracted Hashtags"
								description="Click any badge to include or exclude it from the final copy list."
							/>
							<span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
								{activeTags.length} active
							</span>
						</div>

						{extractedTags.length > 0 ? (
							<div className="flex flex-wrap gap-2 pt-2">
								{extractedTags.map((raw) => {
									const isDeselected = deselectedTags.has(raw);
									const formatted = formatTag(raw, casing, customPrefix);
									return (
										<button
											key={raw}
											type="button"
											onClick={() => toggleTag(raw)}
											className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
												isDeselected
													? "bg-muted text-muted-foreground/60 line-through border border-border/40 hover:opacity-80"
													: "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-xs font-semibold"
											}`}
										>
											{!isDeselected && <Check className="h-3.5 w-3.5" />}
											{formatted}
										</button>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-muted-foreground py-4 text-center">
								Paste some text above to extract keywords and hashtags.
							</p>
						)}
					</ToolPanel>

					{/* Output Textareas */}
					{activeTags.length > 0 && (
						<ToolPanel className="mt-6">
							<div className="flex items-center justify-between mb-3">
								<ToolSectionTitle
									title="Ready to Publish"
									description="Formatted copy ready for captions or comment sections."
								/>
								<div className="flex items-center gap-2">
									<Button variant="outline" size="sm" onClick={handleDownload} className="gap-1 text-xs">
										<Download className="h-3.5 w-3.5" /> Save
									</Button>
									<Button
										size="sm"
										onClick={() => handleCopy(spaceDelimited, "hashtags")}
										className="gap-1.5 font-semibold text-xs"
									>
										{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
										{copied ? "Copied!" : "Copy All"}
									</Button>
								</div>
							</div>

							<Textarea
								readOnly
								rows={4}
								value={spaceDelimited}
								className="font-mono text-sm bg-muted/20 resize-y leading-relaxed"
							/>

							<div className="mt-4 flex flex-wrap gap-3">
								<Button
									size="lg"
									onClick={() => handleCopy(spaceDelimited, "hashtags")}
									className="gap-2 font-semibold shadow-sm w-full sm:w-auto"
								>
									{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
									Copy Space-Separated
								</Button>
								<Button
									variant="outline"
									size="lg"
									onClick={() => handleCopy(commaDelimited, "comma-separated tags")}
									className="gap-2"
								>
									<Copy className="h-4 w-4" /> Copy Comma-Separated
								</Button>
							</div>
						</ToolPanel>
					)}
				</ToolGridMain>

				{/* Sidebar Guides & Specs */}
				<ToolGridSide>
					<ToolPanel>
						<ToolSectionTitle
							title="Platform Limits"
							description="Recommended hashtag guidelines for top algorithms."
						/>
						<div className="space-y-3 mt-4 text-xs">
							<div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground flex items-center justify-between">
									<span>Instagram</span>
									<span className="font-mono text-primary font-bold">3–5 tags</span>
								</p>
								<p className="text-muted-foreground mt-0.5">
									Max 30 allowed. Instagram's creator guidelines now explicitly recommend 3 to 5 hyper-relevant tags rather than 30 generic tags.
								</p>
							</div>

							<div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground flex items-center justify-between">
									<span>TikTok</span>
									<span className="font-mono text-primary font-bold">4–6 tags</span>
								</p>
								<p className="text-muted-foreground mt-0.5">
									Mix 2 niche topic tags with 2 broad community tags (e.g. #EduTok, #CodingTips). Avoid #FYP and #Viral.
								</p>
							</div>

							<div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
								<p className="font-semibold text-foreground flex items-center justify-between">
									<span>LinkedIn</span>
									<span className="font-mono text-primary font-bold">3 tags</span>
								</p>
								<p className="text-muted-foreground mt-0.5">
									Keep tags strictly professional in PascalCase (#TechLeadership) to help screen readers.
								</p>
							</div>
						</div>
					</ToolPanel>

					<ToolPanel className="mt-6">
						<div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
								<Hash className="h-4 w-4 text-primary" />
								Why PascalCase Matters
							</h3>
							<p>
								Capitalizing the first letter of each word in a hashtag (like <code className="bg-muted px-1 py-0.5 rounded font-mono">#DigitalMarketing</code>) is known as CamelCase or PascalCase.
							</p>
							<p>
								Screen readers for visually impaired users can distinguish and pronounce individual words when capitalized, whereas all-lowercase tags are often read as unintelligible single words.
							</p>
						</div>
					</ToolPanel>
				</ToolGridSide>
			</ToolGrid>
		</ToolShell>
	);
}
