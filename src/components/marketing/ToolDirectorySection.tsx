"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Tool } from "@/lib/tools";
import { trackCategorySelect, trackToolAction, trackSearch } from "@/lib/analytics";

interface ToolDirectorySectionProps {
	tools: Tool[];
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

export function ToolDirectorySection({ tools }: ToolDirectorySectionProps) {
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("all");

	const filteredTools = React.useMemo(() => {
		const q = searchQuery.toLowerCase().trim();
		return tools.filter((tool) => {
			const cat = tool.category || "";
			const matchesCategory =
				selectedCategory === "all" ||
				cat === selectedCategory ||
				cat === `${selectedCategory}-tools` ||
				(selectedCategory === "utilities" && cat === "generators");

			const matchesQuery =
				!q ||
				tool.name.toLowerCase().includes(q) ||
				(tool.description && tool.description.toLowerCase().includes(q)) ||
				tool.id.toLowerCase().includes(q);

			return matchesCategory && matchesQuery;
		});
	}, [tools, searchQuery, selectedCategory]);

	// Debounced search tracking for discovery analytics
	React.useEffect(() => {
		if (!searchQuery.trim()) return;
		const timer = setTimeout(() => {
			trackSearch(searchQuery, filteredTools.length, selectedCategory);
		}, 600);
		return () => clearTimeout(timer);
	}, [searchQuery, filteredTools.length, selectedCategory]);

	return (
		<Section id="directory" spacing="default" divided>
			<Container size="xl">
				{/* Section Header */}
				<div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
					<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Live Sandbox Index
					</span>
					<h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-[1.12]">
						Explore All <span className="italic">Utilities</span>
					</h2>
					<p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
						Filter from over {tools.length} browser-based tools. Instant execution, zero server uploads, completely free.
					</p>
				</div>

				{/* Search & Category Filter Toolbar */}
				<div className="space-y-6 max-w-3xl mx-auto mb-12">
					<div className="relative">
						<Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Filter tools by keyword (e.g. compress, convert, merge, qr)..."
							className="w-full h-12 pl-12 pr-6 rounded-full bg-card border border-border focus:outline-none focus:border-foreground/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-muted-foreground/50 shadow-xs"
						/>
					</div>

					{/* Category Filter Pills */}
					<div className="flex flex-wrap items-center justify-center gap-1.5">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.slug}
								type="button"
								onClick={() => {
									setSelectedCategory(cat.slug);
									trackCategorySelect(cat.name);
								}}
								className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer ${
									selectedCategory === cat.slug
										? "bg-primary text-primary-foreground font-semibold shadow-xs scale-[1.02]"
										: "bg-surface-muted hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
								}`}
							>
								{cat.name}
							</button>
						))}
					</div>
				</div>

				{/* Tools Count Metric */}
				<div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-6 px-1">
					<span>Showing {filteredTools.length} of {tools.length} utilities</span>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="text-foreground hover:underline cursor-pointer"
						>
							Clear filter
						</button>
					)}
				</div>

				{/* Grid of Clean Tool Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{filteredTools.slice(0, 48).map((tool) => (
						<Link
							key={tool.id}
							href={tool.route}
							onClick={() => trackToolAction(tool.id, "start")}
							className="group flex flex-col justify-between p-5 rounded-xl bg-card border border-border hover:border-foreground/40 shadow-xs hover:shadow-md transition-all duration-200 no-underline"
						>
							<div className="space-y-2">
								<div className="flex items-start justify-between gap-2">
									<h3 className="font-sans text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
										{tool.name}
									</h3>
									<span className="text-[10px] font-mono text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full shrink-0">
										{(tool.category || "tool").replace("-tools", "")}
									</span>
								</div>
								<p className="font-sans text-xs text-muted-foreground line-clamp-2 leading-relaxed">
									{tool.description || "Free online tool"}
								</p>
							</div>

							<div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
								<span>Launch</span>
								<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</div>
						</Link>
					))}
				</div>

				{filteredTools.length > 48 && (
					<div className="mt-12 text-center">
						<Link
							href="/tools"
							className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-muted hover:bg-muted text-xs font-bold text-foreground border border-border transition-all no-underline shadow-xs"
						>
							<span>View all {filteredTools.length} tools in directory</span>
							<ArrowUpRight className="h-3.5 w-3.5" />
						</Link>
					</div>
				)}

				{filteredTools.length === 0 && (
					<div className="text-center py-16 bg-card border border-border rounded-2xl p-8 space-y-3">
						<p className="font-sans text-sm font-bold text-foreground">No matching tools found</p>
						<p className="font-sans text-xs text-muted-foreground">
							Try searching for another keyword or browse by category above.
						</p>
					</div>
				)}
			</Container>
		</Section>
	);
}
