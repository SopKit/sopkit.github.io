"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Layers, FileText, Image as ImageIcon, Code2, Lock } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Container } from "@/components/layout/Container";
import { type Tool, getAllTools, STATIC_ROUTES } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";
import { trackSearch, trackToolAction } from "@/lib/analytics";

interface ShowcaseCard {
	title: string;
	tag: string;
	badge: string;
	metric: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	rotation: string;
	color: string;
}

const SHOWCASE_CARDS: ShowcaseCard[] = [
	{
		title: "Image Compressor",
		tag: "Browser Canvas",
		badge: "Adaptive",
		metric: "Custom KB",
		href: "/image-compressor",
		icon: ImageIcon,
		rotation: "-rotate-12 -translate-x-28 sm:-translate-x-32 translate-y-6",
		color: "text-sky-600 dark:text-sky-400",
	},
	{
		title: "PDF Merger",
		tag: "Zero Uploads",
		badge: "AES-256",
		metric: "100% Client-Side",
		href: "/merge-pdf-online",
		icon: FileText,
		rotation: "-rotate-4 -translate-x-10 sm:-translate-x-12 -translate-y-2",
		color: "text-rose-600 dark:text-rose-400",
	},
	{
		title: "JSON Formatter",
		tag: "Developer",
		badge: "Sub-ms",
		metric: "Syntax Tree",
		href: "/json-formatter",
		icon: Code2,
		rotation: "rotate-4 translate-x-10 sm:translate-x-12 translate-y-2",
		color: "text-violet-600 dark:text-violet-400",
	},
	{
		title: "Background Remover",
		tag: "AI Canvas",
		badge: "Local GPU",
		metric: "Instant Crop",
		href: "/background-remover",
		icon: Layers,
		rotation: "rotate-12 translate-x-28 sm:translate-x-32 translate-y-8",
		color: "text-emerald-600 dark:text-emerald-400",
	},
];

const POPULAR_QUICK_LINKS = [
	{ name: "PDF Merge", route: "/merge-pdf-online" },
	{ name: "Image Compress", route: "/image-compressor" },
	{ name: "JSON Format", route: "/json-formatter" },
	{ name: "UUID Generator", route: "/uuid-generator" },
	{ name: "Word Counter", route: "/word-counter" },
];

export function HeroSection({ tools }: { tools?: Tool[] }) {
	const [query, setQuery] = React.useState("");
	const [showSuggestions, setShowSuggestions] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(-1);
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	const allTools = React.useMemo(() => {
		if (tools && tools.length > 0) return tools;
		try {
			return getAllTools();
		} catch {
			return [] as Tool[];
		}
	}, [tools]);

	const filteredTools = React.useMemo(() => {
		if (!query.trim()) return allTools.slice(0, 6);
		const q = query.toLowerCase().trim();
		return allTools
			.filter(
				(t) =>
					t?.name?.toLowerCase().includes(q) ||
					t?.description?.toLowerCase().includes(q) ||
					t?.id?.toLowerCase().includes(q) ||
					t?.category?.toLowerCase().includes(q)
			)
			.slice(0, 6);
	}, [query, allTools]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
			const targetTool = filteredTools[selectedIndex];
			trackSearch(query, filteredTools.length);
			trackToolAction(targetTool.id, "start");
			router.push(targetTool.route);
			setShowSuggestions(false);
			return;
		}
		if (query.trim()) {
			trackSearch(query, filteredTools.length);
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
			setShowSuggestions(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions || filteredTools.length === 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
		} else if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	// Global shortcut Cmd+K or Ctrl+K
	React.useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				inputRef.current?.focus();
				setShowSuggestions(true);
			}
		};
		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
	}, []);

	// Click outside
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
		<div className="relative pt-6 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-sky-500/10 via-background to-background dark:from-sky-950/20 dark:via-background dark:to-background">
			<Container size="xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8 sm:pt-14">
					{/* Left: Editorial Headline & Search */}
					<div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
						{/* Trust Pill */}
						<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-muted border border-border text-foreground text-xs font-medium shadow-xs select-none">
							<Lock className="h-3.5 w-3.5 text-accent" />
							<span>100% In-Browser Sandbox</span>
							<span className="text-muted-foreground/40">•</span>
							<span className="text-muted-foreground">{SITE_CONFIG.toolCountString} Free Tools</span>
						</div>

						{/* Editorial Serif Display Headline */}
						<div className="space-y-4">
							<h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.08]">
								Free online tools, <br />
								<span className="italic">crafted for speed.</span>
							</h1>
							<p className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
								A comprehensive collection of zero-upload browser utilities. Convert, edit, compress, and calculate with 100% local privacy on your own hardware.
							</p>
						</div>

						{/* Search Input Box */}
						<form
							onSubmit={handleSearch}
							className="relative w-full max-w-xl mx-auto lg:mx-0 group z-30"
						>
							<div className="relative flex items-center shadow-lg shadow-black/5 dark:shadow-black/20 border border-border hover:border-foreground/40 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-full bg-card backdrop-blur-xl transition-all duration-200">
								<Search className="absolute left-4.5 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-foreground transition-colors shrink-0" />
								<input
									ref={inputRef}
									type="text"
									aria-label="Search all tools"
									placeholder="Search by name, format, or task (e.g. PDF, WebP, JSON)..."
									className="h-12 sm:h-13 pl-12 pr-28 bg-transparent border-none text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground/50 w-full text-foreground font-medium"
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

								<div className="absolute right-2 flex items-center gap-1.5">
									{query && (
										<button
											type="button"
											onClick={() => {
												setQuery("");
												setSelectedIndex(-1);
												inputRef.current?.focus();
											}}
											className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
											aria-label="Clear search"
										>
											<X className="h-4 w-4" />
										</button>
									)}
									<kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground select-none">
										⌘K
									</kbd>
									<PillButton type="submit" size="sm" withArrow>
										Search
									</PillButton>
								</div>
							</div>

							{/* Autocomplete Dropdown */}
							{showSuggestions && (
								<div
									ref={dropdownRef}
									className="absolute left-0 right-0 top-full mt-2 bg-card border border-border shadow-2xl z-50 max-h-72 overflow-y-auto rounded-2xl p-1.5 text-left divide-y divide-border/20 backdrop-blur-2xl"
								>
									<div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between">
										<span>{query.trim() ? "Matching Utilities" : "Quick Suggestions"}</span>
										<span className="text-[9px] font-normal lowercase">↑↓ to navigate</span>
									</div>
									{filteredTools.map((tool, idx) => {
										const isSelected = idx === selectedIndex;
										return (
											<div
												key={tool.id}
												onMouseDown={(e) => e.preventDefault()}
												onClick={() => {
													setQuery(tool.name);
													setShowSuggestions(false);
													router.push(tool.route);
												}}
												className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
													isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
												}`}
											>
												<div className="flex items-center gap-3 min-w-0">
													<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
													<div className="min-w-0">
														<p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tool.name}</p>
														{tool.description && (
															<p className="text-[11px] text-muted-foreground truncate max-w-sm">{tool.description}</p>
														)}
													</div>
												</div>
												<span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full shrink-0 ml-2">
													{tool.category.replace("-tools", "")}
												</span>
											</div>
										);
									})}
								</div>
							)}
						</form>

						{/* Quick Trend Chips */}
						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1">
							<span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
								<Sparkles className="h-3 w-3 text-accent" />
								Popular:
							</span>
							{POPULAR_QUICK_LINKS.map((item) => (
								<Link
									key={item.route}
									href={item.route}
									className="text-xs px-3 py-1 rounded-full bg-surface-muted hover:bg-primary hover:text-primary-foreground border border-border/80 hover:border-transparent text-muted-foreground transition-all duration-150 no-underline"
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					{/* Right: Fanned / Tilted Showcase Cards (Inspired by Reference Image) */}
					<div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] select-none py-6">
						<div className="relative w-full max-w-lg h-80 flex items-center justify-center">
							{SHOWCASE_CARDS.map((card, idx) => {
								const Icon = card.icon;
								return (
									<Link
										key={card.title}
										href={card.href}
										className={`group absolute w-56 sm:w-60 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xl dark:shadow-2xl transition-all duration-300 hover:z-50 hover:scale-110 hover:rotate-0 hover:shadow-2xl cursor-pointer no-underline ${card.rotation}`}
										style={{ zIndex: idx + 10 }}
									>
										{/* Card Header with Icon & Arrow Badge */}
										<div className="flex items-center justify-between mb-4">
											<div className={`w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center ${card.color}`}>
												<Icon className="h-5 w-5" />
											</div>
											<div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 group-hover:bg-stone-900 group-hover:text-white dark:group-hover:bg-stone-100 dark:group-hover:text-stone-900 transition-colors shadow-xs">
												<ArrowUpRight className="h-3.5 w-3.5" />
											</div>
										</div>

										{/* Card Body */}
										<div className="space-y-1 mb-4">
											<h3 className="font-sans text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-primary transition-colors">
												{card.title}
											</h3>
											<p className="text-xs text-stone-500 dark:text-stone-400">
												{card.tag}
											</p>
										</div>

										{/* Card Footer Metric Pill */}
										<div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
											<span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
												{card.badge}
											</span>
											<span className="font-bold text-stone-900 dark:text-stone-100">
												{card.metric}
											</span>
										</div>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</Container>

			{/* Organic Torn Paper Edge Transition (from Reference Image) */}
			<div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
				<svg
					className="relative block w-full h-8 sm:h-12 text-background fill-current"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
				>
					<path d="M0,0 C150,90 350,-40 500,45 C650,110 900,10 1200,60 L1200,120 L0,120 Z" />
				</svg>
			</div>
		</div>
	);
}
