"use client";

import { Github, LayoutGrid, Search, Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";
import { useEffect, useState, useRef, Suspense } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthButton } from "./AuthButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STATIC_ROUTES } from "@/lib/tools";
import { GITHUB_REPO_URL } from "@/constants/config";

interface SearchToolItem {
	id: string;
	name: string;
	description: string;
	route: string;
	category: string;
}

export function AppleNavbar() {
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [allTools, setAllTools] = useState<SearchToolItem[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const searchModalRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	if (pathname?.startsWith("/embed")) {
		return null;
	}

	const loadToolsIndex = async () => {
		if (allTools.length === 0) {
			try {
				const data = await import("@/constants/tools.json");
				const list: SearchToolItem[] = [];
				if (data.categories) {
					Object.keys(data.categories).forEach((catKey) => {
						const cat = data.categories[catKey];
						if (cat.tools) {
							cat.tools.forEach((t: any) => {
								list.push({
									id: t.id,
									name: t.name,
									description: t.description || "",
									route: t.route,
									category: cat.name
								});
							});
						}
					});
				}
				setAllTools(list);
			} catch (err) {
				console.error("Failed to load tools search index:", err);
			}
		}
	};

	const openSearch = async () => {
		setIsSearchOpen(true);
		setSearchQuery("");
		setSelectedIndex(0);
		await loadToolsIndex();
		// Auto-focus input
		setTimeout(() => {
			searchInputRef.current?.focus();
		}, 100);
	};

	const closeSearch = () => {
		setIsSearchOpen(false);
	};

	// Keydown listener for Cmd + K / Ctrl + K and Command dialog navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				if (isSearchOpen) {
					closeSearch();
				} else {
					openSearch();
				}
			}

			if (e.key === "Escape") {
				closeSearch();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isSearchOpen, allTools]);

	const POPULAR_SEARCHES = [
		"PDF Merger",
		"Image Compressor",
		"JSON Formatter",
		"QR Code Generator",
		"Password Generator",
		"Base64 Encode",
		"UUID Generator",
		"Word Counter",
		"Markdown to HTML",
		"URL Shortener",
		"BMI Calculator",
		"Color Converter",
		"CSV to JSON",
		"HTML Minifier",
		"Text to Speech",
	];

	const suggestions = (() => {
		if (!searchQuery.trim()) return [] as SearchToolItem[];
		const q = searchQuery.toLowerCase();
		return allTools
			.filter(
				(t) =>
					t.name.toLowerCase().includes(q) ||
					t.description.toLowerCase().includes(q) ||
					t.category.toLowerCase().includes(q) ||
					t.id.toLowerCase().includes(q)
			)
			.slice(0, 8);
	})();

	const showSuggestions = searchQuery.trim().length > 0 && suggestions.length > 0;

	const filteredTools = searchQuery.trim()
		? allTools.filter(
				(t) =>
					t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					t.category.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: allTools.slice(0, 8); // default show first 8 tools if query is empty

	const handleDialogKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selected = filteredTools[selectedIndex];
			if (selected) {
				router.push(selected.route);
				closeSearch();
			}
		}
	};

	const categories = [
		{ name: "Features", href: STATIC_ROUTES.TOOLS },
		{ name: "Packages", href: "/packages" },
		{ name: "Resources", href: STATIC_ROUTES.TOOL_GUIDES },
		{ name: "Blog", href: STATIC_ROUTES.BLOG },
	];

	return (
		<header className="sticky top-0 z-50 w-full h-14 bg-background/70 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
			<div className="container mx-auto h-full flex items-center justify-between px-4 max-w-7xl">
				{/* Left side */}
				<div className="flex items-center gap-6">
					<Link href={STATIC_ROUTES.HOME} className="flex items-center gap-2 group">
						<div className="w-7 h-7 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
							S
						</div>
						<span className="text-lg font-bold tracking-tight text-foreground group-hover:opacity-90 transition-opacity">
							Sop<span className="text-blue-600 dark:text-blue-400">Kit</span>
						</span>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						{categories.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								className="text-[11px] font-medium tracking-wide text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
							>
								{link.name}
							</Link>
						))}
					</nav>
				</div>

				{/* Center: Search Button (Cmd+K Indicator) */}
				<button 
					onClick={openSearch} 
					className="relative w-full max-w-xs hidden md:flex items-center text-left text-xs text-muted-foreground/70 h-8 px-3 rounded-lg bg-muted/40 border border-border/30 hover:border-border/60 hover:bg-muted/60 transition-all select-none"
				>
					<Search className="h-3.5 w-3.5 mr-2 text-muted-foreground/50" />
					<span className="flex-1">Search 500+ tools...</span>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-muted px-1.5 font-mono text-[9px] font-bold text-muted-foreground/90 shadow-sm">
						<span className="text-xs">⌘</span>K
					</kbd>
				</button>

				{/* Right side */}
				<div className="flex items-center gap-3">
					<div className="hidden sm:flex items-center gap-2">
						<ThemeToggle />

						<a
							href={GITHUB_REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							aria-label="GitHub Repository"
						>
							<Github className="h-4 w-4" />
						</a>

						<Link
							href={STATIC_ROUTES.SEARCH}
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							aria-label="Browse all tools"
						>
							<LayoutGrid className="h-4 w-4" />
						</Link>

						<Suspense fallback={<div className="h-7 w-16 bg-muted/40 rounded-md animate-pulse" />}>
							<AuthButton />
						</Suspense>
					</div>

					{/* Mobile Search & Menu Button */}
					<div className="flex items-center gap-2 md:hidden">
						<button
							onClick={openSearch}
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							aria-label="Search tools"
						>
							<Search className="h-4 w-4" />
						</button>
						<button
							className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>
			</div>

			{/* Floating Command Search Dialog (Cmd + K Modal) */}
			{isSearchOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
					{/* Backdrop overlay */}
					<div onClick={closeSearch} className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" />
					
					{/* Dialog panel */}
					<div 
						ref={searchModalRef}
						onKeyDown={handleDialogKeyDown}
						className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl animate-in zoom-in-95 duration-200"
					>
						<div className="flex items-center border-b border-border/20 px-4 h-12">
							<Search className="h-4 w-4 mr-2 text-muted-foreground/60 shrink-0" />
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Search tools, formats, categories..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setSelectedIndex(0);
								}}
								className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 border-0 focus:outline-none focus:ring-0 h-full"
							/>
							<kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-muted px-1.5 font-mono text-[9px] font-bold text-muted-foreground/80">
								ESC
							</kbd>
						</div>

						{/* Results */}
						<div className="p-2 max-h-[350px] overflow-y-auto">
							{!searchQuery.trim() && !allTools.length ? (
								<div className="p-8 text-center text-xs text-muted-foreground">
									Loading tools index...
								</div>
							) : !searchQuery.trim() ? (
								<div className="space-y-1">
									<p className="px-3 py-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1">
										<Sparkles className="w-3 h-3 text-primary animate-pulse" /> Popular Sandbox Utilities
									</p>
									{allTools.slice(0, 8).map((tool, index) => {
										const isSelected = selectedIndex === index;
										return (
											<div
												key={tool.id}
												onClick={() => {
													router.push(tool.route);
													closeSearch();
												}}
												onMouseEnter={() => setSelectedIndex(index)}
												className={`flex items-center justify-between p-3 rounded-xl cursor-pointer select-none transition-all ${
													isSelected ? "bg-primary/10 border-l-2 border-primary" : "bg-transparent"
												}`}
											>
												<div className="flex-1 min-w-0 pr-3">
													<p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{tool.name}</p>
													<p className="text-[10px] text-muted-foreground truncate leading-normal mt-0.5">{tool.description}</p>
												</div>
												<Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide shrink-0">
													{tool.category}
												</Badge>
											</div>
										);
									})}
								</div>
							) : showSuggestions ? (
								<div className="space-y-1">
									<p className="px-3 py-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wider">
										Suggestions
									</p>
									{suggestions.map((tool, index) => {
										const isSelected = selectedIndex === index;
										return (
											<div
												key={tool.id}
												onClick={() => {
													router.push(tool.route);
													closeSearch();
												}}
												onMouseEnter={() => setSelectedIndex(index)}
												className={`flex items-center justify-between p-3 rounded-xl cursor-pointer select-none transition-all ${
													isSelected ? "bg-primary/10 border-l-2 border-primary" : "bg-transparent"
												}`}
											>
												<div className="flex-1 min-w-0 pr-3">
													<p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{tool.name}</p>
													<p className="text-[10px] text-muted-foreground truncate leading-normal mt-0.5">{tool.description}</p>
												</div>
												<Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide shrink-0">
													{tool.category}
												</Badge>
											</div>
										);
									})}
								</div>
							) : (
								<div className="p-8 text-center text-xs text-muted-foreground">
									No matching tools found. Try searching for "pdf", "image", or "json".
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="absolute top-14 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 md:hidden animate-in fade-in-50 duration-200">
					<div className="flex flex-col p-4 gap-4">
						<div className="flex flex-col gap-3">
							{categories.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className="text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground py-1.5 border-b border-border/10"
									onClick={() => setMobileMenuOpen(false)}
								>
									{link.name.toUpperCase()}
								</Link>
							))}
						</div>

						<div className="flex items-center justify-between border-t border-border/20 pt-4 mt-2">
							<div className="flex items-center gap-4">
								<ThemeToggle />
								<a
									href={GITHUB_REPO_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-muted-foreground hover:text-foreground"
								>
									GitHub
								</a>
							</div>
							<Suspense fallback={null}>
								<AuthButton />
							</Suspense>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
