"use client";

import { Search, Sparkles, X, Lock } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getAllTools, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";

const QUICK_TRENDING_TOOLS = [
	{ name: "PDF Merge", route: "/merge-pdf-online" },
	{ name: "Image Compress", route: "/image-compressor" },
	{ name: "JSON Format", route: "/json-formatter" },
	{ name: "QR Generator", route: "/qr-code-generator" },
	{ name: "UUID Generator", route: "/uuid-generator" },
	{ name: "Base64", route: "/base64-encode-decode" },
];

export function PremiumHero({
	title = `Private, Fast & Local — ${SITE_CONFIG.toolCountString} Free Online Tools`,
	subtitle = "Run 600+ utilities directly in your browser. No file uploads, no tracking, and no account required.",
	tools,
}: {
	title?: string;
	subtitle?: string;
	tools?: Tool[];
}) {
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const allTools = useMemo(() => {
		if (tools && Array.isArray(tools) && tools.length > 0) {
			return tools;
		}
		try {
			return getAllTools();
		} catch {
			return [] as Tool[];
		}
	}, [tools]);

	// Filtered live suggestions
	const filteredTools = useMemo(() => {
		if (!query.trim()) return allTools.slice(0, 6);
		const q = query.toLowerCase().trim();
		return allTools
			.filter(
				(t) =>
					(t?.name && t.name.toLowerCase().includes(q)) ||
					(t?.description && t.description.toLowerCase().includes(q)) ||
					(t?.id && t.id.toLowerCase().includes(q)) ||
					(t?.category && t.category.toLowerCase().includes(q))
			)
			.slice(0, 6);
	}, [query, allTools]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
			router.push(filteredTools[selectedIndex].route);
			setShowSuggestions(false);
			return;
		}
		if (query.trim()) {
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

	// Global shortcut Cmd+K or Ctrl+K to focus search bar
	useEffect(() => {
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

	// Click outside handler
	useEffect(() => {
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
		<div className="relative pt-10 pb-12 md:pt-20 md:pb-20 flex flex-col justify-center items-center">
			{/* Multi-Stop Ambient Aurora Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />
			<div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

			<div className="w-full max-w-4xl mx-auto text-center px-4 space-y-6">
				{/* Modern Trust Pill Badges */}
				<div className="inline-flex flex-wrap items-center justify-center gap-2 p-1 rounded-full bg-card/60 border border-border/70 backdrop-blur-md text-xs font-medium shadow-sm select-none">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
						<Lock className="h-3.5 w-3.5" />
						<span>100% Browser Sandbox</span>
					</div>
					<span className="hidden sm:inline text-muted-foreground/40">•</span>
					<div className="hidden sm:inline-flex items-center gap-1 text-muted-foreground px-2">
						<Sparkles className="h-3 w-3 text-amber-500" />
						<span>Zero Cloud Uploads</span>
					</div>
					<span className="hidden sm:inline text-muted-foreground/40">•</span>
					<span className="text-muted-foreground px-2.5 py-0.5">{SITE_CONFIG.toolCountString} Free Tools</span>
				</div>

				{/* Minimal Crisp Headline — renders the page-specific title so every
				    hub page ships a unique, keyword-rich H1 for crawlers. */}
				{/* Minimal Crisp Headline */}
				<div className="space-y-3">
					{(() => {
						const parts = title.split("—").map((s) => s.trim()).filter(Boolean);
						const lead = parts.length > 1 ? parts.slice(0, -1).join(" — ") : null;
						const highlight = parts.length > 1 ? parts[parts.length - 1] : title;
						return (
							<h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-[1.12]">
								{lead ? (
									<>
										{lead} <br className="hidden sm:inline" />
									</>
								) : null}
								<span className="italic font-normal">
									{highlight}
								</span>
							</h1>
						);
					})()}
					<p className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						{subtitle}
					</p>
				</div>

				{/* Clean Unified Search Bar */}
				<form
					onSubmit={handleSearch}
					className="relative w-full max-w-xl mx-auto group z-30 pt-2"
				>
					<div className="relative flex items-center shadow-xl shadow-blue-500/5 dark:shadow-black/30 border border-border/80 dark:border-border/60 hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15 rounded-2xl bg-card/95 backdrop-blur-xl transition-all duration-200">
						<Search className="absolute left-4.5 h-4.5 w-4.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors shrink-0" />
						<input
							ref={inputRef}
							type="text"
							aria-label="Search all tools"
							placeholder="Search 600+ tools (e.g. PDF, Image, JSON, QR)..."
							className="h-13 sm:h-14 pl-12 pr-28 bg-transparent border-none text-sm sm:text-base focus:outline-none placeholder:text-muted-foreground/50 w-full text-foreground font-medium"
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
									className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
							<div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground select-none">
								⌘K
							</div>
							<button
								type="submit"
								aria-label="Search"
								className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs transition-all hover:bg-primary/90 active:scale-95 cursor-pointer shadow-sm shadow-primary/25"
							>
								Search
							</button>
						</div>
					</div>

					{/* Live Autocomplete Suggestions Dropdown */}
					{showSuggestions && (
						<div
							ref={dropdownRef}
							className="absolute left-0 right-0 top-full mt-2 bg-card border border-border/80 shadow-2xl z-50 max-h-[320px] overflow-y-auto rounded-2xl p-1.5 text-left divide-y divide-border/20 backdrop-blur-2xl"
						>
							<div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between">
								<span>{query.trim() ? "Search Results" : "Quick Suggestions"}</span>
								<span className="text-[9px] font-normal lowercase">↑↓ to select</span>
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
										className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
											isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/60"
										}`}
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
											<div className="min-w-0">
												<p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tool.name}</p>
												{tool.description && (
													<p className="text-[11px] text-muted-foreground truncate max-w-sm">{tool.description}</p>
												)}
											</div>
										</div>
										{tool.category && (
											<Badge variant="outline" className="text-[9px] font-medium uppercase tracking-wider shrink-0 ml-2 bg-muted/30">
												{tool.category.replace("-tools", "")}
											</Badge>
										)}
									</div>
								);
							})}
						</div>
					)}
				</form>

				{/* Minimal Clean Trending Chips */}
				<div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
					<span className="text-xs text-muted-foreground/70 flex items-center gap-1 mr-1">
						<Sparkles className="h-3 w-3 text-blue-500" />
						Trending:
					</span>
					{QUICK_TRENDING_TOOLS.map((item) => (
						<a
							key={item.route}
							href={item.route}
							className="inline-flex items-center px-3 py-1 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground border border-border/40 hover:border-transparent text-xs text-muted-foreground transition-all duration-200"
						>
							{item.name}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
