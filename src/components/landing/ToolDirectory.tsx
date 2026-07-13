"use client";

import { useState, useTransition } from "react";
import { Search, ChevronRight, Zap, RefreshCw, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/button";

interface Tool {
	id: string;
	name: string;
	description: string;
	route: string;
	category: string;
	categoryName?: string;
}

interface ToolDirectoryProps {
	tools: Tool[];
}

const CATEGORIES = [
	{ name: "All Tools", slug: "all" },
	{ name: "Image Tools", slug: "image" },
	{ name: "PDF Tools", slug: "pdf" },
	{ name: "Developer Tools", slug: "developer" },
	{ name: "Calculators", slug: "calculators" },
	{ name: "Text Tools", slug: "text" },
	{ name: "SEO Tools", slug: "seo" },
	{ name: "Other Tools", slug: "utilities" },
];

export function ToolDirectory({ tools }: ToolDirectoryProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isPending, startTransition] = useTransition();

	// Group tools into categories for secondary layout index
	const toolsCount = tools.length;

	const handleCategoryChange = (slug: string) => {
		startTransition(() => {
			setSelectedCategory(slug);
		});
	};

	const handleSearchChange = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<section className="py-16 border-t border-border/40 space-y-10">
			<div className="text-center space-y-4 max-w-2xl mx-auto">
				<h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase">
					Complete Tool Directory
				</h2>
				<p className="text-sm md:text-base text-muted-foreground leading-relaxed">
					Instant access to all {toolsCount} free online tools. Search, filter, and run any utility locally inside your browser sandbox.
				</p>
			</div>

			{/* Search and filter toolbar */}
			<div className="space-y-6 max-w-4xl mx-auto">
				<div className="relative group">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => handleSearchChange(e.target.value)}
						placeholder="Filter tools by name, description, or keyword..."
						className="w-full h-12 pl-12 pr-6 rounded-xl bg-card border border-border/40 focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-muted-foreground/50"
					/>
				</div>

				{/* Filter Category pills */}
				<div className="flex flex-wrap items-center justify-center gap-1.5 pb-2 border-b border-border/10">
					{CATEGORIES.map((cat) => (
						<button
							key={cat.slug}
							onClick={() => handleCategoryChange(cat.slug)}
							className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
								selectedCategory === cat.slug
									? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
									: "bg-muted/30 hover:bg-muted/65 text-muted-foreground hover:text-foreground"
							}`}
						>
							{cat.name}
						</button>
					))}
				</div>
			</div>

			{/* Scale Grid: For 100% SEO, all items are rendered. We use inline CSS `display` for client-side filtering. */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
				{tools.map((tool) => {
					// Check matching state (client-side only evaluation)
					const matchesCategory =
						selectedCategory === "all" ||
						tool.category === selectedCategory ||
						tool.category === `${selectedCategory}-tools` ||
						(selectedCategory === "utilities" && tool.category === "generators");

					const matchesSearch =
						!searchQuery ||
						tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
						tool.id.toLowerCase().includes(searchQuery.toLowerCase());

					const isVisible = matchesCategory && matchesSearch;

					return (
						<Link
							key={tool.id}
							href={tool.route}
							style={{ display: isVisible ? "flex" : "none" }}
							className="group flex-col justify-between p-5 bg-card/20 hover:bg-card/50 border border-border/40 hover:border-primary/30 rounded-2xl hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_16px_36px_rgba(255,255,255,0.02)] transition-all duration-300 no-underline relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							
							<div className="relative z-10 space-y-2">
								<div className="flex items-start justify-between gap-2">
									<h3 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
										{tool.name}
									</h3>
									{tool.category && (
										<span className="text-[9px] font-bold uppercase tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md">
											{tool.category.replace("-tools", "")}
										</span>
									)}
								</div>
								<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
									{tool.description || "Free online tool"}
								</p>
							</div>

							<div className="mt-4 text-primary text-[11px] font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all relative z-10">
								<span>Open sandbox</span>
								<ChevronRight className="h-3 w-3" />
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
