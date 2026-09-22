"use client";

/**
 * @file src/components/marketing/HeroSection.tsx
 * @description Redesigned intent-first Hero section for SopKit.
 * Features action-oriented launcher, cycling task placeholders, quick-task chips,
 * local-first workspace history, and clean trust capabilities.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Search,
	Sparkles,
	X,
	ArrowRight,
	ShieldCheck,
	Clock,
	Star,
	Cpu,
	Zap,
} from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Container } from "@/components/layout/Container";
import { type SearchToolRecord } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";
import { useUserToolbox } from "@/hooks/useUserToolbox";
import { trackSearch, trackToolAction } from "@/lib/analytics";

const CYCLING_INTENTS = [
	"compress an image to 50KB...",
	"combine multiple PDFs...",
	"format and inspect JSON...",
	"remove image background...",
	"calculate semester CGPA...",
	"generate a secure password...",
	"create a custom QR code...",
	"count words and reading time...",
];

type HeroSearchResult = {
	tool: SearchToolRecord;
	score: number;
	explanation?: string;
};

const INTENT_TARGETS: Record<string, string[]> = {
	"compress image": ["image-compressor", "compress-image-to-50kb", "bulk-image-compressor"],
	"merge pdf": ["merge-pdf-online", "split-pdf"],
	"format json": ["json-formatter", "json-validator"],
	"remove bg": ["background-remover", "image-resizer"],
	"calculate gpa": ["cgpa-calculator", "gpa-calculator"],
	"generate qr": ["qr-code-generator", "barcode-generator"],
	"word count": ["word-counter", "character-counter"],
	"generate password": ["password-generator", "uuid-generator"],
};

function searchLocalTools(tools: SearchToolRecord[], query: string, limit = 6): HeroSearchResult[] {
	const cleanQ = query.trim().toLowerCase();
	if (!cleanQ) return [];

	const intentKey = Object.keys(INTENT_TARGETS).find((key) => cleanQ.includes(key));
	const intentTargets = intentKey ? INTENT_TARGETS[intentKey] : [];

	return tools
		.map((tool) => {
			const name = tool.name.toLowerCase();
			const id = tool.id.toLowerCase();
			const description = (tool.description || "").toLowerCase();
			let score = 0;

			if (name === cleanQ || id === cleanQ) score += 100;
			else if (name.startsWith(cleanQ)) score += 70;
			else if (name.includes(cleanQ) || id.includes(cleanQ)) score += 45;

			for (const token of cleanQ.split(/\s+/)) {
				if (name.includes(token)) score += 15;
				if (description.includes(token)) score += 3;
			}

			const intentIndex = intentTargets.indexOf(id);
			if (intentIndex >= 0) score += 80 - intentIndex * 8;
			if (tool.popular) score += 5;

			return {
				tool,
				score,
				explanation: intentIndex >= 0 ? `Best match for ${intentKey}` : undefined,
			};
		})
		.filter((result) => result.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);
}

function getProcessingLabel(tool: SearchToolRecord) {
	return tool.executionType === "external" || tool.executionType === "server"
		? "Cloud API"
		: "Local Browser";
}

const QUICK_TASK_CHIPS = [
	{ label: "Compress Image", href: "/image-compressor", icon: "🖼️" },
	{ label: "Merge PDF", href: "/merge-pdf-online", icon: "📑" },
	{ label: "Format JSON", href: "/json-formatter", icon: "💻" },
	{ label: "Remove Background", href: "/background-remover", icon: "✨" },
	{ label: "Calculate CGPA", href: "/cgpa-calculator", icon: "🎓" },
	{ label: "Generate QR", href: "/qr-code-generator", icon: "📱" },
	{ label: "Word Counter", href: "/word-counter", icon: "📝" },
	{ label: "Password Generator", href: "/password-generator", icon: "🔐" },
];

export function HeroSection({ tools = [] }: { tools?: SearchToolRecord[] }) {
	const [query, setQuery] = React.useState("");
	const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
	const [showSuggestions, setShowSuggestions] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(-1);
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	const { recents, favorites, isHydrated, recordRecent, recordSearch } = useUserToolbox();

	// Cycle placeholder text every 3.2 seconds if not currently typing
	React.useEffect(() => {
		if (query) return;
		const interval = setInterval(() => {
			setPlaceholderIndex((prev) => (prev + 1) % CYCLING_INTENTS.length);
		}, 3200);
		return () => clearInterval(interval);
	}, [query]);

	// Live search results
	const searchResults = React.useMemo(
		() => searchLocalTools(tools, query, 6),
		[tools, query],
	);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
			const targetTool = searchResults[selectedIndex].tool;
			const route = targetTool.slug ? `/${targetTool.slug}` : `/${targetTool.id}`;
			recordRecent({
				id: targetTool.id,
				name: targetTool.name,
				route,
				category: targetTool.category,
			});
			trackSearch(query, searchResults.length);
			trackToolAction(targetTool.id, "start");
			router.push(route);
			setShowSuggestions(false);
			return;
		}

		if (query.trim()) {
			recordSearch(query);
			trackSearch(query, searchResults.length);
			if (searchResults.length === 1) {
				const single = searchResults[0].tool;
				const route = single.slug ? `/${single.slug}` : `/${single.id}`;
				router.push(route);
			} else {
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			}
			setShowSuggestions(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions || searchResults.length === 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
		} else if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	// Click outside to close dropdown
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				inputRef.current &&
				!inputRef.current.contains(event.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<section className="relative pt-6 pb-12 sm:pb-16 overflow-hidden border-b border-border/40 bg-gradient-to-b from-surface-muted/30 via-background to-background">
			<Container size="xl">
				<div className="max-w-4xl mx-auto text-center space-y-8 pt-4 sm:pt-8">
					{/* Trust & Capability Badge */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-muted/80 border border-border/80 text-foreground text-xs font-medium shadow-xs select-none">
						<span className="flex h-2 w-2 relative">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
						</span>
						<span className="font-semibold">{SITE_CONFIG.toolCountString} Utilities</span>
						<span className="text-muted-foreground/50">·</span>
						<span className="text-muted-foreground">100% In-Browser Privacy</span>
						<span className="text-muted-foreground/50">·</span>
						<span className="text-muted-foreground">Free Forever</span>
					</div>

					{/* Calm, Confident Headline */}
					<div className="space-y-3 sm:space-y-4">
						<h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-[1.12]">
							Free tools for whatever you&apos;re <br className="hidden sm:inline" />
							<span className="italic font-normal">trying to do.</span>
						</h1>
						<p className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							Fast, zero-upload utilities running locally in your browser. Compress images, merge documents, convert code, and crunch numbers without sending your files anywhere.
						</p>
					</div>

					{/* Interactive Intent Launcher */}
					<div className="relative max-w-2xl mx-auto">
						<form
							onSubmit={handleSearch}
							className="relative w-full group z-30"
						>
							<div className="relative flex items-center shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/90 hover:border-foreground/30 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl bg-card/95 backdrop-blur-xl transition-all duration-200">
								<Search className="absolute left-4.5 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors shrink-0" />
								<input
									ref={inputRef}
									type="text"
									role="combobox"
									aria-autocomplete="list"
									aria-expanded={showSuggestions && searchResults.length > 0}
									aria-controls="hero-search-listbox"
									aria-label="What do you want to do?"
									placeholder={`What do you want to do? (e.g. ${CYCLING_INTENTS[placeholderIndex]}`}
									className="h-13 sm:h-14 pl-12 pr-28 sm:pr-32 bg-transparent border-none text-sm sm:text-base focus:outline-hidden placeholder:text-muted-foreground/60 w-full text-foreground font-medium"
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										setShowSuggestions(true);
										setSelectedIndex(-1);
									}}
									onFocus={() => setShowSuggestions(true)}
									onKeyDown={handleKeyDown}
									autoComplete="off"
								/>

								<div className="absolute right-2.5 flex items-center gap-1.5">
									{query && (
										<button
											type="button"
											onClick={() => {
												setQuery("");
												setSelectedIndex(-1);
												inputRef.current?.focus();
											}}
											className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
											aria-label="Clear search query"
										>
											<X className="h-4 w-4" />
										</button>
									)}
									<kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground select-none">
										⌘K
									</kbd>
									<PillButton type="submit" size="sm" withArrow>
										Launch
									</PillButton>
								</div>
							</div>

							{/* Dropdown Live Results */}
							{showSuggestions && query.trim().length > 0 && (
								<div
									ref={dropdownRef}
									role="listbox"
									id="hero-search-listbox"
									aria-label="Matching tools"
									className="absolute left-0 right-0 top-full mt-2 bg-card border border-border shadow-2xl z-50 max-h-80 overflow-y-auto rounded-2xl p-2 text-left space-y-1 backdrop-blur-2xl"
								>
									{searchResults.length > 0 ? (
										<>
											<div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between" aria-hidden="true">
												<span>Matching Tools ({searchResults.length})</span>
												<span className="text-[9px] font-normal lowercase">Use ↑↓ and Enter</span>
											</div>
											{searchResults.map((result, idx) => {
												const tool = result.tool;
												const isSelected = idx === selectedIndex;
												const route = tool.slug ? `/${tool.slug}` : `/${tool.id}`;
												const processingLabel = getProcessingLabel(tool);

												return (
													<div
														key={tool.id}
														role="option"
														aria-selected={isSelected}
														onMouseDown={(e) => e.preventDefault()}
														onClick={() => {
															recordRecent({
																id: tool.id,
																name: tool.name,
																route,
																category: tool.category,
															});
															router.push(route);
															setShowSuggestions(false);
														}}
														onMouseEnter={() => setSelectedIndex(idx)}
														className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
															isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
														}`}
													>
														<div className="min-w-0 pr-3">
															<div className="flex items-center gap-2">
																<p className="text-sm font-semibold text-foreground truncate">
																	{tool.name}
																</p>
																{tool.category && (
																	<span className="text-[10px] font-mono text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded shrink-0">
																		{tool.category.replace("-tools", "")}
																	</span>
																)}
															</div>
															{result.explanation ? (
																<p className="text-xs text-primary/80 font-medium truncate mt-0.5">
																	✦ {result.explanation}
																</p>
															) : (
																<p className="text-xs text-muted-foreground truncate mt-0.5">
																	{tool.description}
																</p>
															)}
														</div>

														<div className="flex items-center gap-2 shrink-0">
															<ProcessingBadge
																model={dataProcessing.type}
																compact
																interactive={false}
															/>
															<ArrowRight className="h-4 w-4 text-muted-foreground" />
														</div>
													</div>
												);
											})}
										</>
									) : (
										<div className="p-4 text-center text-xs text-muted-foreground">
											No direct match found. Press Enter to search all 600+ tools for &ldquo;{query}&rdquo;.
										</div>
									)}
								</div>
							)}
						</form>

						{/* Quick Task Chips */}
						<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-3">
							<span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
								<Sparkles className="h-3 w-3 text-primary" />
								Common Tasks:
							</span>
							{QUICK_TASK_CHIPS.map((chip) => (
								<Link
									key={chip.href}
									href={chip.href}
									className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-surface-muted/90 hover:bg-primary hover:text-primary-foreground border border-border/80 hover:border-transparent text-foreground font-medium transition-all duration-150 no-underline shadow-2xs"
								>
									<span>{chip.icon}</span>
									<span>{chip.label}</span>
								</Link>
							))}
						</div>
					</div>

					{/* Personal Workspace Bar (Recents / Favorites / Curated) */}
					{isHydrated && (recents.length > 0 || favorites.length > 0) ? (
						<div className="pt-4 border-t border-border/50 text-left max-w-3xl mx-auto">
							<div className="flex items-center justify-between mb-2.5 px-1">
								<span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-mono">
									<Clock className="h-3.5 w-3.5" />
									Your Recent Workspace
								</span>
								<Link
									href="/tools"
									className="text-xs text-primary hover:underline font-medium"
								>
									View All Tools →
								</Link>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
								{recents.slice(0, 4).map((item) => (
									<Link
										key={item.id}
										href={item.route}
										className="p-3 rounded-xl bg-card border border-border/70 hover:border-primary/50 hover:shadow-xs transition-all no-underline group block"
									>
										<p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
											{item.name}
										</p>
										<p className="text-[10px] text-muted-foreground font-mono mt-0.5">
											{item.category || "utility"}
										</p>
									</Link>
								))}
							</div>
						</div>
					) : (
						<div className="pt-4 border-t border-border/50 text-center max-w-2xl mx-auto">
							<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground font-medium">
								<span className="flex items-center gap-1.5">
									<ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
									Zero Uploads to External Servers
								</span>
								<span className="flex items-center gap-1.5">
									<Zap className="h-3.5 w-3.5 text-amber-500" />
									Sub-Millisecond WebAssembly
								</span>
								<span className="flex items-center gap-1.5">
									<Cpu className="h-3.5 w-3.5 text-sky-500" />
									Local Client Hardware Acceleration
								</span>
							</div>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}
