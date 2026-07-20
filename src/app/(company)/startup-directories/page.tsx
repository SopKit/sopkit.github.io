"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, Filter, Sparkles, AlertCircle } from "lucide-react";
import { GridPattern } from "@/components/shared/GridPattern";
import directoriesData from "@/constants/directories.json";
import { getAllCategories } from "@/lib/tools";

export default function StartupDirectoriesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPriority, setSelectedPriority] = useState<string>("All");
	const [selectedTag, setSelectedTag] = useState<string>("All");
	const [selectedCost, setSelectedCost] = useState<string>("All");

	// Get unique tags for filter dropdown
	const uniqueTags = useMemo(() => {
		const tags = new Set<string>();
		directoriesData.forEach((item) => {
			if (item.tag) tags.add(item.tag);
		});
		return ["All", ...Array.from(tags).sort()];
	}, []);

	// Filter directories based on selection
	const filteredDirectories = useMemo(() => {
		return directoriesData.filter((item) => {
			const matchesSearch =
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.tip.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesPriority = selectedPriority === "All" || item.priority === selectedPriority;
			const matchesTag = selectedTag === "All" || item.tag === selectedTag;
			const matchesCost = selectedCost === "All" || item.cost.toLowerCase() === selectedCost.toLowerCase();

			return matchesSearch && matchesPriority && matchesTag && matchesCost;
		});
	}, [searchQuery, selectedPriority, selectedTag, selectedCost]);

	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
			<main className="flex-1 relative z-10">
				<GridPattern className="opacity-[0.03]" />

				{/* Minimalist Hero */}
				<section className="container mx-auto max-w-5xl px-6 pt-16 pb-12 text-center space-y-4">
					<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary border border-border/85 px-3 py-1 rounded-full shadow-sm">
						Launch & Growth resources
					</span>
					<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
						Startup & SaaS Submission Directories
					</h1>
					<p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
						A curated, prioritized list of 100+ platforms, review sites, and communities to submit your software, AI tools, or developer products to boost traffic and search visibility.
					</p>

					{/* Credit Banner */}
					<div className="max-w-2xl mx-auto p-4 rounded-xl border border-primary/15 bg-primary/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mt-6">
						<div className="flex items-center gap-2 text-muted-foreground text-left">
							<Sparkles className="h-4 w-4 text-primary shrink-0" />
							<span>
								Dataset curated by our partner networks: <strong>IndexFast Directories</strong> and <strong>IndexFast Tools</strong>.
							</span>
						</div>
						<div className="flex items-center gap-3 shrink-0">
							<a
								href="https://indexfast.co/resources/directories"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline font-semibold flex items-center gap-0.5"
							>
								IndexFast Directories <ExternalLink className="h-3 w-3" />
							</a>
							<span className="text-border/40">|</span>
							<a
								href="https://indexfast.co/tools"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline font-semibold flex items-center gap-0.5"
							>
								IndexFast Tools <ExternalLink className="h-3 w-3" />
							</a>
						</div>
					</div>
				</section>

				{/* Interactive Search and Filters */}
				<section className="container mx-auto max-w-5xl px-6 pb-6">
					<div className="p-4 rounded-2xl border border-border/40 bg-card/25 backdrop-blur-sm space-y-4">
						<div className="flex flex-col md:flex-row gap-3">
							{/* Search input */}
							<div className="relative flex-1">
								<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search directories, tags, launch tips..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-border bg-background/50 focus:outline-none focus:border-primary/40 text-foreground"
								/>
							</div>

							{/* Priority Filter */}
							<div className="flex items-center gap-2 min-w-[150px]">
								<Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
								<select
									value={selectedPriority}
									onChange={(e) => setSelectedPriority(e.target.value)}
									className="w-full p-2 text-xs rounded-lg border border-border bg-background/50 focus:outline-none text-foreground"
								>
									<option value="All">All Priorities</option>
									<option value="P0">P0 (High Priority)</option>
									<option value="P1">P1 (Medium Priority)</option>
									<option value="P2">P2 (Normal Priority)</option>
									<option value="P3">P3 (Low Priority)</option>
								</select>
							</div>

							{/* Cost Filter */}
							<select
								value={selectedCost}
								onChange={(e) => setSelectedCost(e.target.value)}
								className="p-2 text-xs rounded-lg border border-border bg-background/50 focus:outline-none text-foreground min-w-[120px]"
							>
								<option value="All">All Costs</option>
								<option value="Free">Free Only</option>
								<option value="Freemium">Freemium Only</option>
								<option value="Paid">Paid Only</option>
							</select>

							{/* Tag Filter */}
							<select
								value={selectedTag}
								onChange={(e) => setSelectedTag(e.target.value)}
								className="p-2 text-xs rounded-lg border border-border bg-background/50 focus:outline-none text-foreground min-w-[140px]"
							>
								<option value="All">All Tags</option>
								{uniqueTags.filter(t => t !== "All").map((tag) => (
									<option key={tag} value={tag}>
										{tag.charAt(0).toUpperCase() + tag.slice(1)}
									</option>
								))}
							</select>
						</div>

						{/* Results Info */}
						<div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
							<span>
								Showing <strong>{filteredDirectories.length}</strong> of {directoriesData.length} directories
							</span>
							{(searchQuery || selectedPriority !== "All" || selectedTag !== "All" || selectedCost !== "All") && (
								<button
									onClick={() => {
										setSearchQuery("");
										setSelectedPriority("All");
										setSelectedTag("All");
										setSelectedCost("All");
									}}
									className="text-primary hover:underline font-semibold"
								>
									Reset Filters
								</button>
							)}
						</div>
					</div>
				</section>

				{/* Directory Cards Grid */}
				<section className="container mx-auto max-w-5xl px-6 py-6">
					{filteredDirectories.length === 0 ? (
						<div className="p-12 text-center border border-dashed rounded-2xl border-border/40 bg-card/10 space-y-3">
							<AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
							<h3 className="text-sm font-bold">No directories match your filters</h3>
							<p className="text-xs text-muted-foreground">Try adjusting your search terms or filters.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredDirectories.map((item, idx) => (
								<div
									key={idx}
									className="p-6 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm hover:border-primary/25 transition-all duration-300 flex flex-col justify-between space-y-4"
								>
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
													item.priority === 'P0' ? 'bg-red-500/10 text-red-500 border border-red-500/25' :
													item.priority === 'P1' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/25' :
													'bg-zinc-500/10 text-muted-foreground border border-zinc-500/25'
												}`}>
													{item.priority}
												</span>
												<span className="text-[9px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
													{item.tag}
												</span>
											</div>
											<span className="text-[10px] text-muted-foreground font-mono capitalize">
												{item.cost}
											</span>
										</div>

										<h2 className="text-base font-black text-foreground tracking-tight flex items-center gap-1.5">
											{item.name}
										</h2>
										<p className="text-xs text-muted-foreground font-semibold leading-relaxed">
											{item.description}
										</p>
										{item.tip && (
											<div className="p-2.5 rounded-lg bg-zinc-950/20 border border-border/10 font-mono text-[10px] leading-normal text-muted-foreground">
												<strong className="text-foreground font-bold">Launch Tip:</strong> {item.tip}
											</div>
										)}
									</div>

									<div className="flex items-center justify-between pt-2 border-t border-border/10 text-[10px] text-muted-foreground">
										<div className="flex items-center gap-3">
											<span>Review: <strong className="text-foreground capitalize">{item.review}</strong></span>
											<span>Effort: <strong className="text-foreground capitalize">{item.effort}</strong></span>
										</div>
										<a
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
										>
											Open Directory <ExternalLink className="h-2.5 w-2.5" />
										</a>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
