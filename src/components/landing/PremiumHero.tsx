"use client";

import { Search, ShieldCheck, Zap, Lock, Sparkles, ExternalLink, X, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getAllTools, type Tool } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";

const QUICK_TRENDING_TOOLS = [
	{ name: "PDF Merger", route: "/merge-pdf-online", badge: "Hot" },
	{ name: "Image Compressor", route: "/image-compressor", badge: "Popular" },
	{ name: "JSON Formatter", route: "/json-formatter" },
	{ name: "QR Code Generator", route: "/qr-code-generator" },
	{ name: "Resume ATS Score", route: "/resume-ats-score-checker", badge: "AI" },
	{ name: "Glassmorphism UI", route: "/css-glassmorphism-generator", badge: "New" },
	{ name: "Subnet Calculator", route: "/ip-subnet-calculator", badge: "New" },
	{ name: "Rate Calculator", route: "/freelance-hourly-rate-calculator", badge: "New" },
	{ name: "UUID Generator", route: "/uuid-generator" },
];

export function PremiumHero({
	title = `Private, Fast & Local — ${SITE_CONFIG.toolCountString} Free Tools That Never Upload Your Files`,
	subtitle = "",
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
		if (!query.trim()) return allTools.slice(0, 7);
		const q = query.toLowerCase().trim();
		return allTools
			.filter(
				(t) =>
					(t?.name && t.name.toLowerCase().includes(q)) ||
					(t?.description && t.description.toLowerCase().includes(q)) ||
					(t?.id && t.id.toLowerCase().includes(q)) ||
					(t?.category && t.category.toLowerCase().includes(q))
			)
			.slice(0, 7);
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

	const rawTitle = typeof title === "string" && title ? title : `Private, Fast & Local — ${SITE_CONFIG.toolCountString} Free Tools That Never Upload Your Files`;
	const hasDash = rawTitle.includes("—");
	const titlePrefix = hasDash ? rawTitle.split("—")[0] : rawTitle;
	const titleSuffix = hasDash ? rawTitle.split("—")[1] : "";

	return (
		<div className="relative pt-8 pb-8 md:pt-16 md:pb-12 overflow-hidden flex flex-col justify-center items-center">
			{/* Multi-layered Luminous Ambient Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 pointer-events-none">
				<div className="absolute top-[-5%] left-[10%] w-[45%] h-[55%] bg-blue-600/15 dark:bg-blue-500/20 blur-[130px] rounded-full animate-pulse duration-1000" />
				<div className="absolute top-[10%] right-[10%] w-[45%] h-[55%] bg-sky-500/15 dark:bg-cyan-500/20 blur-[130px] rounded-full" />
				<div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-purple-500/15 blur-[140px] rounded-full" />
			</div>

			<div className="w-full max-w-5xl mx-auto text-center px-4">
				{/* Top Floating Trust Badge */}
				<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/25 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md hover:border-blue-500/40 transition-colors">
					<span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
					<ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<span>{SITE_CONFIG.toolCountString} Free Tools</span>
					<span className="opacity-40">•</span>
					<span>100% Client-Side Sandbox</span>
					<span className="opacity-40">•</span>
					<span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero Uploads</span>
				</div>

				{/* Hero Main Heading */}
				<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
					{hasDash ? (
						<>
							<span>{titlePrefix}</span>
							<span className="block mt-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
								{titleSuffix}
							</span>
						</>
					) : (
						<span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
							{rawTitle}
						</span>
					)}
				</h1>

				{/* Subtitle / Value Prop */}
				{subtitle && (
					<p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
						{subtitle}
					</p>
				)}

				{/* Feature Trust Pills */}
				<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-medium text-muted-foreground">
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/60 border border-border/40 shadow-xs">
						<Lock className="h-3.5 w-3.5 text-blue-500" />
						<span>100% Local Browser Sandbox</span>
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/60 border border-border/40 shadow-xs">
						<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
						<span>No Data Uploads or Storage</span>
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/60 border border-border/40 shadow-xs">
						<Zap className="h-3.5 w-3.5 text-amber-500" />
						<span>Instant WASM Execution</span>
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card/60 border border-border/40 shadow-xs">
						<Sparkles className="h-3.5 w-3.5 text-purple-500" />
						<span>No Account Required</span>
					</span>
				</div>

				{/* Interactive Search Discovery Bar */}
				<form
					onSubmit={handleSearch}
					className="relative w-full max-w-2xl mx-auto group z-30 mb-6"
				>
					<div className="relative flex items-center shadow-xl shadow-blue-500/5 border-2 border-blue-500/25 dark:border-blue-500/35 rounded-2xl bg-card/95 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20">
						<Search className="absolute left-5 h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform group-focus-within:scale-110" />
						<input
							ref={inputRef}
							type="text"
							aria-label="Search all tools"
							placeholder="Search 605+ tools (e.g., 'pdf', 'image', 'json', 'qr', 'ats')..."
							className="h-14 sm:h-16 pl-14 pr-28 sm:pr-36 bg-transparent border-none text-base sm:text-lg focus:outline-none placeholder:text-muted-foreground/60 w-full text-foreground font-medium"
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
									className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
									aria-label="Clear search query"
								>
									<X className="h-4 w-4" />
								</button>
							)}
							<div className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-muted/60 border border-border/40 text-[10px] font-mono text-muted-foreground/80 select-none">
								<span>⌘</span>
								<span>K</span>
							</div>
							<button
								type="submit"
								aria-label="Find tool"
								className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
							>
								Search
							</button>
						</div>
					</div>

					{/* Live Autocomplete Suggestions Dropdown */}
					{showSuggestions && (
						<div
							ref={dropdownRef}
							className="absolute left-0 right-0 top-full mt-2 bg-card/95 backdrop-blur-2xl border border-border/70 shadow-2xl z-50 max-h-[380px] overflow-y-auto rounded-2xl p-2 text-left"
						>
							<div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 border-b border-border/30 flex items-center justify-between">
								<span>{query.trim() ? "Matching Utilities" : "Popular Suggestions"}</span>
								<span className="text-[9px] font-normal lowercase">Press ↑↓ to navigate</span>
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
										className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer my-0.5 ${
											isSelected ? "bg-blue-500/15 dark:bg-blue-500/25 border-l-2 border-blue-500" : "hover:bg-muted/70"
										}`}
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
												<Search className="h-3.5 w-3.5" />
											</div>
											<div className="min-w-0">
												<p className="text-sm font-bold text-foreground truncate">{tool.name}</p>
												{tool.description && (
													<p className="text-[11px] text-muted-foreground truncate max-w-md">{tool.description}</p>
												)}
											</div>
										</div>
										{tool.category && (
											<Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider shrink-0 bg-muted/40 border-border/50">
												{tool.category.replace("-tools", "")}
											</Badge>
										)}
									</div>
								);
							})}
						</div>
					)}
				</form>

				{/* Trending Tools Quick-Action Chips */}
				<div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-3xl mx-auto">
					<span className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1 mr-1">
						<Sparkles className="h-3.5 w-3.5 text-blue-500" />
						Trending:
					</span>
					{QUICK_TRENDING_TOOLS.map((item) => (
						<a
							key={item.route}
							href={item.route}
							className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card hover:bg-muted border border-border/50 hover:border-blue-500/40 text-xs font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-all duration-200"
						>
							<span>{item.name}</span>
							{item.badge && (
								<span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
									item.badge === "Hot"
										? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
										: item.badge === "AI"
										? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
										: item.badge === "New"
										? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
										: "bg-blue-500/15 text-blue-600 dark:text-blue-400"
								}`}>
									{item.badge}
								</span>
							)}
						</a>
					))}
				</div>

				{/* Official Partners & Sponsors Showcase */}
				<div className="pt-4 pb-2 border-t border-border/30 max-w-3xl mx-auto">
					<div className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground/70 mb-3">
						Supported by Ecosystem Partners
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* CampusLoop Sponsor Card */}
						<a
							href="https://campusloop.space/"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center justify-between p-3.5 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-blue-500/40 shadow-xs hover:shadow-md transition-all duration-200 text-left"
						>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
									CL
								</div>
								<div>
									<div className="flex items-center gap-1.5">
										<span className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
											CampusLoop
										</span>
										<Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 font-bold">
											Student Partner
										</Badge>
									</div>
									<p className="text-[11px] text-muted-foreground">
										The all-in-one student campus community app
									</p>
								</div>
							</div>
							<ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
						</a>

						{/* Debo.life Sponsor Card */}
						<a
							href="http://debo.life/"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center justify-between p-3.5 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-purple-500/40 shadow-xs hover:shadow-md transition-all duration-200 text-left"
						>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
									DL
								</div>
								<div>
									<div className="flex items-center gap-1.5">
										<span className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
											Debo.life
										</span>
										<Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-0 font-bold">
											AI Productivity
										</Badge>
									</div>
									<p className="text-[11px] text-muted-foreground">
										AI-powered workflows & personal productivity
									</p>
								</div>
							</div>
							<ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
