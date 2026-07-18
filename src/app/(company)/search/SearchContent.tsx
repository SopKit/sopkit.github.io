"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Tool {
	id: string;
	name: string;
	description: string;
	route: string;
	category: string;
	popular?: boolean;
	categoryName?: string;
	categorySlug?: string;
}

interface CategoryInfo {
	key: string;
	name: string;
	slug: string;
	description: string;
}

interface SearchContentProps {
	initialTools: Tool[];
	initialCategories: CategoryInfo[];
}

function SearchResults({ initialTools, initialCategories }: SearchContentProps) {
	const searchParams = useSearchParams();
	const initialQuery = searchParams.get("q") || "";

	const [query, setQuery] = useState(initialQuery);
	const [results, setResults] = useState<Tool[]>(
		initialQuery
			? []
			: initialTools,
	);
	const [loading, setLoading] = useState(!initialQuery ? false : true);
	const [activeCategory, setActiveCategory] = useState("all");
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const initialSearchDone = useRef(false);

	// Derive category badges from initialCategories
	const categoryBadges = initialCategories.map(cat => ({
		key: cat.key,
		name: cat.name,
	}));

	const hasQuery = query.trim().length > 0;
	const noResults = hasQuery && !loading && results.length === 0;

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
		if (!query.trim()) return [] as Tool[];
		const q = query.toLowerCase();
		return initialTools
			.filter(
				(t) =>
					t.name.toLowerCase().includes(q) ||
					t.description.toLowerCase().includes(q) ||
					t.category.toLowerCase().includes(q) ||
					t.id.toLowerCase().includes(q)
			)
			.slice(0, 8);
	})();

	const showSuggestions = query.trim().length > 0 && suggestions.length > 0 && !loading;

	const performSearch = useCallback((q: string, cat: string) => {
		const cleanQuery = q.toLowerCase().trim();
		if (!cleanQuery) {
			setResults(
				cat === "all"
					? initialTools
					: initialTools.filter((t) => t.category === cat),
			);
			setLoading(false);
			return;
		}

		setLoading(true);
		const filtered = initialTools.filter((tool) => {
			const matchesCategory = cat === "all" || tool.category === cat;
			if (!matchesCategory) return false;

			return (
				tool.name.toLowerCase().includes(cleanQuery) ||
				tool.description.toLowerCase().includes(cleanQuery) ||
				tool.id.toLowerCase().includes(cleanQuery)
			);
		});
		setResults(filtered);
		setLoading(false);
	}, [initialTools]);

	// If there's an initial query from URL, run the search once on mount
	useEffect(() => {
		if (initialQuery && !initialSearchDone.current) {
			initialSearchDone.current = true;
			performSearch(initialQuery, "all");
		}
	}, [initialQuery, performSearch]);

	const handleInputChange = (value: string) => {
		setQuery(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			performSearch(value, activeCategory);
		}, 300);
	};

	const handleCategoryClick = (cat: string) => {
		setActiveCategory(cat);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (query.trim()) {
			performSearch(query, cat);
		} else {
			performSearch("", cat);
		}
	};

	const handleReset = () => {
		setQuery("");
		setActiveCategory("all");
		setResults(initialTools);
		setLoading(false);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		searchInputRef.current?.focus();
	};

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	return (
		<div className="space-y-8">
			{/* Search Input */}
			<div className="relative max-w-2xl mx-auto">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
				<Input
					ref={searchInputRef}
					value={query}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder="Search tools (e.g. 'pdf converter', 'image compressor')..."
					className="pl-12 py-7 text-lg rounded-none border-2 border-primary/20 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-xl"
					autoComplete="off"
				/>
				{query && (
					<button 
						onClick={handleReset}
						className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm z-10"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</button>
				)}

				{/* Autocomplete Suggestions */}
				{showSuggestions && (
					<div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border/60 shadow-2xl z-50 max-h-[320px] overflow-y-auto rounded-sm">
						{suggestions.map((tool, idx) => (
							<Link
								key={tool.id}
								href={tool.route}
								className="flex items-center justify-between px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/10 last:border-b-0"
								onClick={() => {
									setQuery(tool.name);
									setResults([tool]);
									setLoading(false);
								}}
							>
								<div className="flex items-center gap-3 min-w-0">
									<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
									<div className="min-w-0">
										<p className="text-sm font-bold truncate">{tool.name}</p>
										<p className="text-[11px] text-muted-foreground truncate">{tool.description}</p>
									</div>
								</div>
								<Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide shrink-0">
									{tool.category}
								</Badge>
							</Link>
						))}
					</div>
				)}
			</div>

			{/* Category Filters */}
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Badge 
					variant={activeCategory === "all" ? "default" : "outline"}
					className="cursor-pointer px-4 py-1.5 rounded-none uppercase font-bold text-[10px] tracking-widest"
					onClick={() => handleCategoryClick("all")}
				>
					All Tools
				</Badge>
				{categoryBadges.map((cat) => (
					<Badge 
						key={cat.key}
						variant={activeCategory === cat.key ? "default" : "outline"}
						className="cursor-pointer px-4 py-1.5 rounded-none uppercase font-bold text-[10px] tracking-widest"
						onClick={() => handleCategoryClick(cat.key)}
					>
						{cat.name}
					</Badge>
				))}
			</div>

			{/* Results Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="bg-card border border-border/40 p-6 space-y-4 rounded-sm">
							<div className="h-6 w-3/4 bg-muted animate-pulse rounded-sm" />
							<div className="h-4 w-full bg-muted animate-pulse rounded-sm" />
							<div className="h-4 w-1/2 bg-muted animate-pulse rounded-sm" />
						</div>
					))
				) : results.length > 0 ? (
					results.map((tool) => (
						<Link 
							key={tool.id} 
							href={tool.route}
							className="group relative bg-card border border-border/50 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 p-6 flex flex-col h-full"
						>
							<div className="space-y-3 flex-1">
								<div className="flex items-start justify-between gap-2">
									<h3 className="text-lg font-bold group-hover:text-primary transition-colors">
										{tool.name}
									</h3>
									{tool.popular && <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
								</div>
								<p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
									{tool.description}
								</p>
							</div>
							
							<div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
								<span className="text-muted-foreground/60">
									{tool.categoryName || tool.category}
								</span>
								<div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
									Open Tool <ArrowRight className="h-3 w-3" />
								</div>
							</div>
						</Link>
					))
				) : noResults ? (
					<div className="col-span-full py-20 text-center space-y-4">
						<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<Search className="h-10 w-10 text-muted-foreground" />
						</div>
						<h3 className="text-2xl font-bold">No tools found</h3>
						<p className="text-muted-foreground max-w-sm mx-auto">
							We couldn&apos;t find any tools matching &quot;{query}&quot;. Try different keywords or browse our categories.
						</p>
						<button 
							onClick={handleReset}
							className="text-primary font-bold hover:underline cursor-pointer"
						>
							Clear all filters
						</button>
					</div>
				) : (
					<div className="col-span-full py-20 text-center space-y-4">
						<div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
							<Search className="h-10 w-10 text-muted-foreground" />
						</div>
						<h3 className="text-2xl font-bold">No results</h3>
						<p className="text-muted-foreground max-w-sm mx-auto">
							No tools match the current filter. Try a different category.
						</p>
						<button 
							onClick={handleReset}
							className="text-primary font-bold hover:underline cursor-pointer"
						>
							Show all tools
						</button>
					</div>
				)}
			</div>

			{/* Live-region for screen readers */}
			<div className="sr-only" role="status" aria-live="polite">
				{loading
					? "Searching..."
					: hasQuery
						? `Found ${results.length} tool${results.length !== 1 ? "s" : ""} for "${query}"`
						: `Showing ${results.length} tool${results.length !== 1 ? "s" : ""}`}
			</div>
		</div>
	);
}

export default function SearchContent(props: SearchContentProps) {
	return (
		<Suspense fallback={
			<div className="space-y-8">
				<div className="relative max-w-2xl mx-auto">
					<div className="h-14 bg-muted animate-pulse rounded-none" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="bg-card border border-border/40 p-6 space-y-4">
							<div className="h-6 w-3/4 bg-muted animate-pulse" />
							<div className="h-4 w-full bg-muted animate-pulse" />
							<div className="h-4 w-1/2 bg-muted animate-pulse" />
						</div>
					))}
				</div>
			</div>
		}>
			<SearchResults {...props} />
		</Suspense>
	);
}
