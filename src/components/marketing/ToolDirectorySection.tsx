"use client";

/**
 * @file src/components/marketing/ToolDirectorySection.tsx
 * @description Highly searchable, scannable Tool Directory component.
 * Features Grid & Compact List views, category pills, processing filters,
 * 1-click favorite saving, sorting, and progressive pagination.
 */

import * as React from "react";
import Link from "next/link";
import {
	Search,
	LayoutGrid,
	List,
	Star,
	ArrowUpRight,
	SlidersHorizontal,
	RotateCcw,
	ArrowUpDown,
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { type SearchToolRecord } from "@/lib/tools";
import { trackCategorySelect, trackToolAction, trackSearch } from "@/lib/analytics";
import { useUserToolbox } from "@/hooks/useUserToolbox";
import { ProcessingBadge } from "@/components/shared/ProcessingBadge";
import { resolveDataProcessing } from "@/features/tools/archetypes";

interface ToolDirectorySectionProps {
	tools: SearchToolRecord[];
}

const CATEGORIES = [
	{ name: "All Tools", slug: "all" },
	{ name: "Image", slug: "image" },
	{ name: "PDF", slug: "pdf" },
	{ name: "Developer", slug: "developer" },
	{ name: "Calculators", slug: "calculators" },
	{ name: "Text", slug: "text" },
	{ name: "SEO", slug: "seo" },
	{ name: "Utilities", slug: "utilities" },
];

const PROCESSING_OPTIONS = [
	{ label: "All Processing", value: "ALL" },
	{ label: "Local Only", value: "LOCAL" },
	{ label: "No Upload / Network", value: "NO_FILE_UPLOAD" },
	{ label: "External Cloud", value: "REMOTE" },
];

type SortOption = "POPULAR" | "ALPHA" | "CATEGORY";
type ViewMode = "grid" | "list";

const INITIAL_PAGE_SIZE = 36;
const PAGE_INCREMENT = 24;

export function ToolDirectorySection({ tools }: ToolDirectorySectionProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("all");
	const [processingFilter, setProcessingFilter] = React.useState("ALL");
	const [sortBy, setSortBy] = React.useState<SortOption>("POPULAR");
	const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
	const [visibleCount, setVisibleCount] = React.useState(INITIAL_PAGE_SIZE);

	const { isFavorite, toggleFavorite, recordRecent } = useUserToolbox();

	// Filter & Sort
	const filteredTools = React.useMemo(() => {
		const q = searchQuery.toLowerCase().trim();
		const results = tools.filter((tool) => {
			const cat = (tool.category || "").toLowerCase();
			const matchesCategory =
				selectedCategory === "all" ||
				cat === selectedCategory ||
				cat === `${selectedCategory}-tools` ||
				(selectedCategory === "utilities" && (cat === "generators" || cat === "utility"));

			const matchesQuery =
				!q ||
				tool.name.toLowerCase().includes(q) ||
				(tool.description && tool.description.toLowerCase().includes(q)) ||
				tool.id.toLowerCase().includes(q);

			let matchesProcessing = true;
			if (processingFilter !== "ALL") {
				const info = resolveDataProcessing(tool);
				matchesProcessing = info.type === processingFilter;
			}

			return matchesCategory && matchesQuery && matchesProcessing;
		});

		if (sortBy === "ALPHA") {
			return results.sort((a, b) => a.name.localeCompare(b.name));
		}
		if (sortBy === "CATEGORY") {
			return results.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
		}

		return results;
	}, [tools, searchQuery, selectedCategory, processingFilter, sortBy]);

	// Reset visible count when filters change
	React.useEffect(() => {
		setVisibleCount(INITIAL_PAGE_SIZE);
	}, [searchQuery, selectedCategory, processingFilter, sortBy]);

	// Search analytics
	React.useEffect(() => {
		if (!searchQuery.trim()) return;
		const timer = setTimeout(() => {
			trackSearch(searchQuery, filteredTools.length, selectedCategory);
		}, 600);
		return () => clearTimeout(timer);
	}, [searchQuery, filteredTools.length, selectedCategory]);

	const resetFilters = () => {
		setSearchQuery("");
		setSelectedCategory("all");
		setProcessingFilter("ALL");
		setSortBy("POPULAR");
	};

	const displayedTools = filteredTools.slice(0, visibleCount);

	return (
		<Section id="directory" spacing="default" divided>
			<Container size="xl">
				{/* Section Header */}
				<div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
					<span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
						Complete Tool Index
					</span>
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground leading-[1.15]">
						Explore All <span className="italic">Utilities</span>
					</h2>
					<p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
						Filter from over {tools.length} browser-based tools. Instant execution, zero server uploads, completely free.
					</p>
				</div>

				{/* Unified Controls Toolbar */}
				<div className="space-y-4 max-w-4xl mx-auto mb-8">
					{/* Search input bar */}
					<div className="relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
						<input
							type="text"
							aria-label="Filter tools by keyword"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Filter by keyword (e.g. compress, convert, merge, qr, json)..."
							className="w-full h-12 sm:h-13 pl-12 pr-6 rounded-2xl bg-card border border-border/80 focus:outline-hidden focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-muted-foreground/60 shadow-xs"
						/>
					</div>

					{/* Category filter pills */}
					<div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.slug}
								type="button"
								onClick={() => {
									setSelectedCategory(cat.slug);
									trackCategorySelect(cat.name);
								}}
								className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer ${
									selectedCategory === cat.slug
										? "bg-primary text-primary-foreground font-semibold shadow-xs scale-[1.02]"
										: "bg-surface-muted hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70"
								}`}
							>
								{cat.name}
							</button>
						))}
					</div>

					{/* Secondary Controls: Processing filter, Sort, and View Mode Toggle */}
					<div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1 text-xs">
						<div className="flex flex-wrap items-center gap-2">
							{/* Processing filter */}
							<div className="flex items-center gap-1.5">
								<SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
								<select
									aria-label="Filter by processing model"
									value={processingFilter}
									onChange={(e) => setProcessingFilter(e.target.value)}
									className="h-8 px-2.5 rounded-lg bg-surface-muted border border-border/80 text-foreground text-xs focus:outline-hidden cursor-pointer"
								>
									{PROCESSING_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{/* Sort option */}
							<div className="flex items-center gap-1.5">
								<ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
								<select
									aria-label="Sort utilities"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as SortOption)}
									className="h-8 px-2.5 rounded-lg bg-surface-muted border border-border/80 text-foreground text-xs focus:outline-hidden cursor-pointer"
								>
									<option value="POPULAR">Most Popular</option>
									<option value="ALPHA">Alphabetical (A–Z)</option>
									<option value="CATEGORY">By Category</option>
								</select>
							</div>

							{(searchQuery || selectedCategory !== "all" || processingFilter !== "ALL") && (
								<button
									type="button"
									onClick={resetFilters}
									className="h-8 px-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors cursor-pointer"
								>
									<RotateCcw className="h-3 w-3" />
									Reset
								</button>
							)}
						</div>

						{/* View Toggle (Grid / List) */}
						<div className="flex items-center gap-1 bg-surface-muted p-0.5 rounded-lg border border-border/70">
							<button
								type="button"
								onClick={() => setViewMode("grid")}
								className={`p-1.5 rounded-md transition-colors cursor-pointer ${
									viewMode === "grid"
										? "bg-background text-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground"
								}`}
								aria-label="Grid view"
							>
								<LayoutGrid className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={() => setViewMode("list")}
								className={`p-1.5 rounded-md transition-colors cursor-pointer ${
									viewMode === "list"
										? "bg-background text-foreground shadow-2xs font-semibold"
										: "text-muted-foreground hover:text-foreground"
								}`}
								aria-label="Compact list view"
							>
								<List className="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Count Status */}
				<div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-4 px-1">
					<span>
						Showing {Math.min(visibleCount, filteredTools.length)} of {filteredTools.length} tools
						{selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
					</span>
				</div>

				{/* GRID VIEW */}
				{viewMode === "grid" && (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
						{displayedTools.map((tool) => {
							const isFav = isFavorite(tool.id);
							const dataProcessing = resolveDataProcessing(tool);

							return (
								<div
									key={tool.id}
									className="group relative flex flex-col justify-between p-4 rounded-xl bg-card border border-border/80 hover:border-primary/40 shadow-2xs hover:shadow-md transition-all duration-200"
								>
									<div className="space-y-2">
										<div className="flex items-start justify-between gap-2">
											<Link
												href={tool.route}
												onClick={() => {
													recordRecent(tool);
													trackToolAction(tool.id, "start");
												}}
												className="font-sans text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 no-underline"
											>
												{tool.name}
											</Link>

											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													toggleFavorite(tool.id);
												}}
												className={`p-1 rounded-md transition-colors shrink-0 cursor-pointer ${
													isFav
														? "text-amber-500 hover:text-amber-600"
														: "text-muted-foreground/40 hover:text-foreground"
												}`}
												aria-label={isFav ? "Remove favorite" : "Add to favorites"}
											>
												<Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-500" : ""}`} />
											</button>
										</div>

										<p className="font-sans text-xs text-muted-foreground line-clamp-2 leading-relaxed">
											{tool.description || "Free online browser utility"}
										</p>
									</div>

									<div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
										<ProcessingBadge
											model={dataProcessing.type}
											compact
											interactive={false}
										/>

										<Link
											href={tool.route}
											onClick={() => {
												recordRecent(tool);
												trackToolAction(tool.id, "start");
											}}
											className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors no-underline"
										>
											<span>Open</span>
											<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* COMPACT LIST VIEW */}
				{viewMode === "list" && (
					<div className="divide-y divide-border/60 border border-border/80 rounded-2xl bg-card overflow-hidden">
						{displayedTools.map((tool) => {
							const isFav = isFavorite(tool.id);
							const dataProcessing = resolveDataProcessing(tool);

							return (
								<div
									key={tool.id}
									className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 hover:bg-muted/40 transition-colors gap-2"
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<button
											type="button"
											onClick={() => toggleFavorite(tool.id)}
											className={`p-1 rounded-md transition-colors shrink-0 cursor-pointer ${
												isFav
													? "text-amber-500 hover:text-amber-600"
													: "text-muted-foreground/30 hover:text-foreground"
											}`}
											aria-label={isFav ? "Remove favorite" : "Add to favorites"}
										>
											<Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
										</button>

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<Link
													href={tool.route}
													onClick={() => {
														recordRecent(tool);
														trackToolAction(tool.id, "start");
													}}
													className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate no-underline"
												>
													{tool.name}
												</Link>
												{tool.category && (
													<span className="text-[10px] font-mono text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded shrink-0">
														{tool.category.replace("-tools", "")}
													</span>
												)}
											</div>
											<p className="text-xs text-muted-foreground truncate">
												{tool.description || "Free browser utility"}
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
										<ProcessingBadge
											model={dataProcessing.type}
											compact
											interactive={false}
										/>

										<Link
											href={tool.route}
											onClick={() => {
												recordRecent(tool);
												trackToolAction(tool.id, "start");
											}}
											className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline no-underline px-2 py-1 rounded hover:bg-primary/10"
										>
											<span>Launch</span>
											<ArrowUpRight className="h-3 w-3" />
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Progressive Pagination ("Load More") */}
				{visibleCount < filteredTools.length && (
					<div className="mt-8 text-center">
						<button
							type="button"
							onClick={() => setVisibleCount((prev) => prev + PAGE_INCREMENT)}
							className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-muted hover:bg-muted text-xs font-bold text-foreground border border-border/80 transition-all cursor-pointer shadow-2xs"
						>
							<span>Load More Utilities ({filteredTools.length - visibleCount} remaining)</span>
						</button>
					</div>
				)}

				{/* Empty State */}
				{filteredTools.length === 0 && (
					<div className="text-center py-16 bg-card border border-border/80 rounded-2xl p-8 space-y-4 max-w-lg mx-auto">
						<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
							<Search className="h-6 w-6" />
						</div>
						<p className="font-serif text-lg font-bold text-foreground">
							No tools match &ldquo;{searchQuery}&rdquo;
						</p>
						<p className="font-sans text-xs text-muted-foreground leading-relaxed">
							Try searching for general task terms (such as &ldquo;compress&rdquo;, &ldquo;merge&rdquo;, &ldquo;format&rdquo;, or &ldquo;convert&rdquo;) or reset your filters.
						</p>
						<button
							type="button"
							onClick={resetFilters}
							className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
						>
							<RotateCcw className="h-3 w-3" />
							Reset All Filters
						</button>
					</div>
				)}
			</Container>
		</Section>
	);
}
