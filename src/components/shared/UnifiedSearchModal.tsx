"use client";

/**
 * @file src/components/shared/UnifiedSearchModal.tsx
 * @description Centralized, accessible Command Palette and Search Modal.
 * Supports Cmd+K, mobile trigger, intent-first search, recents, and favorites.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
	Search,
	X,
	Clock,
	Star,
	Sparkles,
	ArrowRight,
	Trash2,
	CornerDownLeft,
	ShieldCheck,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useUserToolbox } from "@/hooks/useUserToolbox";
import { searchTools, type SearchResult } from "@/features/search/engine";
import { resolveDataProcessing } from "@/features/tools/archetypes";
import { ProcessingBadge } from "@/components/shared/ProcessingBadge";
import { trackSearch, trackToolAction } from "@/lib/analytics";

import { OPEN_SEARCH_EVENT } from "./search-events";

const QUICK_TASK_SUGGESTIONS = [
	{ label: "Compress Image", query: "compress image" },
	{ label: "Merge PDF", query: "merge pdf" },
	{ label: "Format JSON", query: "format json" },
	{ label: "Remove Background", query: "remove bg" },
	{ label: "Calculate CGPA", query: "calculate gpa" },
	{ label: "Generate QR", query: "generate qr" },
	{ label: "Word Counter", query: "word count" },
	{ label: "Password Generator", query: "generate password" },
];

export function UnifiedSearchModal({
	initialOpen = false,
	onOpenChange,
}: {
	initialOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [isOpen, setIsOpen] = React.useState(initialOpen);
	const [query, setQuery] = React.useState("");
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const listRef = React.useRef<HTMLDivElement>(null);

	const {
		favorites,
		recents,
		toggleFavorite,
		isFavorite,
		recordRecent,
		clearRecents,
		recordSearch,
	} = useUserToolbox();

	// Global Keyboard Shortcut: Cmd+K / Ctrl+K
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		};

		const handleCustomOpen = () => {
			setIsOpen(true);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener(OPEN_SEARCH_EVENT, handleCustomOpen);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener(OPEN_SEARCH_EVENT, handleCustomOpen);
		};
	}, []);

	// Reset state on open/close
	React.useEffect(() => {
		if (isOpen) {
			setQuery("");
			setSelectedIndex(0);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	// Search Results
	const searchResults = React.useMemo<SearchResult[]>(() => {
		if (!query.trim()) return [];
		return searchTools(query, 12);
	}, [query]);

	// Keep selected index in bounds
	React.useEffect(() => {
		setSelectedIndex(0);
	}, [query]);

	// Keyboard navigation within list
	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			const max = searchResults.length > 0 ? searchResults.length - 1 : 0;
			setSelectedIndex((prev) => (prev < max ? prev + 1 : 0));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			const max = searchResults.length > 0 ? searchResults.length - 1 : 0;
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : max));
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (searchResults.length > 0 && selectedIndex < searchResults.length) {
				handleSelectTool(searchResults[selectedIndex]);
			} else if (query.trim()) {
				recordSearch(query);
				trackSearch(query, searchResults.length);
				router.push(`/search?q=${encodeURIComponent(query.trim())}`);
				setIsOpen(false);
			}
		}
	};

	const handleSelectTool = (result: SearchResult) => {
		const tool = result.tool;
		const route = tool.slug ? `/${tool.slug}` : `/${tool.id}`;
		recordRecent({
			id: tool.id,
			name: tool.name,
			route,
			category: tool.category,
		});
		if (query.trim()) {
			recordSearch(query);
			trackSearch(query, searchResults.length);
		}
		trackToolAction(tool.id, "start");
		setIsOpen(false);
		router.push(route);
	};

	const handleSelectRecent = (recent: { id: string; name: string; route: string; category?: string }) => {
		recordRecent(recent);
		trackToolAction(recent.id, "start");
		setIsOpen(false);
		router.push(recent.route);
	};

	// Scroll active item into view
	React.useEffect(() => {
		if (!listRef.current) return;
		const activeEl = listRef.current.querySelector(`[data-active="true"]`);
		if (activeEl) {
			activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
		}
	}, [selectedIndex]);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				onOpenChange?.(open);
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl rounded-2xl top-[12%] sm:top-[20%] translate-y-0"
			>
				<DialogTitle className="sr-only">Search Tools</DialogTitle>
				<DialogDescription className="sr-only">
					Search over 600 client-side and cloud utilities by name, task intent, or category.
				</DialogDescription>

				{/* Search Input Bar */}
				<div className="relative flex items-center px-4 border-b border-border/70 bg-background/50">
					<Search className="h-5 w-5 text-muted-foreground shrink-0 ml-1" />
					<input
						ref={inputRef}
						type="text"
						role="combobox"
						aria-autocomplete="list"
						aria-expanded={isOpen}
						aria-label="Search tools by name, task, or format"
						placeholder="What do you want to do? (e.g. compress photo, merge pdf)..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleInputKeyDown}
						className="w-full h-14 pl-3.5 pr-10 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
					/>
					{query ? (
						<button
							type="button"
							onClick={() => setQuery("")}
							className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
							aria-label="Clear search query"
						>
							<X className="h-4 w-4" />
						</button>
					) : (
						<kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground select-none">
							ESC
						</kbd>
					)}
				</div>

				{/* Content Body */}
				<div ref={listRef} className="max-h-[60vh] sm:max-h-[460px] overflow-y-auto p-3 space-y-4">
					{/* Active Search Results */}
					{query.trim().length > 0 ? (
						<div>
							{searchResults.length > 0 ? (
								<div className="space-y-1" role="listbox" aria-label="Search results">
									<div className="px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center justify-between">
										<span>Matching Utilities ({searchResults.length})</span>
										<span className="text-[10px] lowercase font-normal">Use ↑↓ and Enter</span>
									</div>

									{searchResults.map((result, idx) => {
										const tool = result.tool;
										const isSelected = idx === selectedIndex;
										const isFav = isFavorite(tool.id);
										const dataProcessing = resolveDataProcessing(tool);

										return (
											<div
												key={tool.id}
												role="option"
												aria-selected={isSelected}
												data-active={isSelected}
												onClick={() => handleSelectTool(result)}
												onMouseEnter={() => setSelectedIndex(idx)}
												className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
													isSelected
														? "bg-primary/10 text-primary shadow-xs"
														: "hover:bg-muted/50 text-foreground"
												}`}
											>
												<div className="flex items-center gap-3 min-w-0 flex-1">
													<div
														className={`p-2 rounded-lg shrink-0 transition-colors ${
															isSelected
																? "bg-primary text-primary-foreground"
																: "bg-muted text-muted-foreground group-hover:text-foreground"
														}`}
													>
														<Search className="h-4 w-4" />
													</div>

													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm truncate text-foreground">
																{tool.name}
															</span>
															{tool.category && (
																<span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
																	{tool.category.replace("-tools", "")}
																</span>
															)}
														</div>

														{result.explanation ? (
															<p className="text-xs text-primary/80 font-medium truncate mt-0.5">
																✦ {result.explanation}
															</p>
														) : tool.description ? (
															<p className="text-xs text-muted-foreground truncate mt-0.5">
																{tool.description}
															</p>
														) : null}
													</div>
												</div>

												<div className="flex items-center gap-2 shrink-0 ml-3">
													<ProcessingBadge
														model={dataProcessing.type}
														compact
														interactive={false}
													/>

													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															toggleFavorite(tool.id);
														}}
														className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
															isFav
																? "text-amber-500 hover:text-amber-600"
																: "text-muted-foreground/40 hover:text-foreground hover:bg-muted"
														}`}
														aria-label={isFav ? "Remove favorite" : "Add to favorites"}
													>
														<Star className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`} />
													</button>

													<CornerDownLeft
														className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
															isSelected ? "opacity-100 text-primary" : "text-muted-foreground"
														}`}
													/>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="text-center py-10 px-4 space-y-3">
									<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
										<Search className="h-5 w-5" />
									</div>
									<p className="font-semibold text-sm text-foreground">
										No utilities found for &ldquo;{query}&rdquo;
									</p>
									<p className="text-xs text-muted-foreground max-w-sm mx-auto">
										Try searching by general task keywords like &ldquo;compress&rdquo;, &ldquo;pdf&rdquo;, &ldquo;json&rdquo;, or &ldquo;format&rdquo;.
									</p>
									<div className="flex flex-wrap justify-center gap-1.5 pt-2">
										{QUICK_TASK_SUGGESTIONS.slice(0, 4).map((task) => (
											<button
												key={task.query}
												type="button"
												onClick={() => setQuery(task.query)}
												className="px-3 py-1 rounded-full bg-surface-muted hover:bg-muted text-xs text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
											>
												{task.label}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						/* Empty Query: Intent suggestions, Recents, and Favorites */
						<div className="space-y-5">
							{/* Quick Task Pills */}
							<div className="space-y-2">
								<div className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
									<Sparkles className="h-3 w-3 text-primary" />
									<span>Common Tasks</span>
								</div>
								<div className="flex flex-wrap gap-1.5 px-1">
									{QUICK_TASK_SUGGESTIONS.map((task) => (
										<button
											key={task.query}
											type="button"
											onClick={() => setQuery(task.query)}
											className="px-3 py-1.5 rounded-full bg-surface-muted hover:bg-muted hover:border-foreground/30 text-xs font-medium text-foreground border border-border/70 transition-all cursor-pointer flex items-center gap-1.5"
										>
											<span>{task.label}</span>
											<ArrowRight className="h-3 w-3 text-muted-foreground opacity-60" />
										</button>
									))}
								</div>
							</div>

							{/* Recently Used Tools */}
							{recents.length > 0 && (
								<div className="space-y-2">
									<div className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center justify-between">
										<span className="flex items-center gap-1.5">
											<Clock className="h-3 w-3 text-muted-foreground" />
											Recently Used
										</span>
										<button
											type="button"
											onClick={clearRecents}
											className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors cursor-pointer"
										>
											<Trash2 className="h-3 w-3" />
											Clear
										</button>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1">
										{recents.slice(0, 6).map((item) => (
											<button
												key={item.id}
												type="button"
												onClick={() => handleSelectRecent(item)}
												className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted/50 hover:bg-muted border border-border/50 text-left transition-all group cursor-pointer"
											>
												<div className="min-w-0 pr-2">
													<p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
														{item.name}
													</p>
													<p className="text-[10px] text-muted-foreground font-mono">
														{item.category || "utility"}
													</p>
												</div>
												<ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
											</button>
										))}
									</div>
								</div>
							)}

							{/* Popular Quick Links */}
							<div className="space-y-2">
								<div className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
									<Star className="h-3 w-3 text-amber-500" />
									<span>Popular Utilities</span>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-1">
									{[
										{ name: "Image Compressor", route: "/image-compressor", cat: "image" },
										{ name: "Merge PDF Online", route: "/merge-pdf-online", cat: "pdf" },
										{ name: "JSON Formatter", route: "/json-formatter", cat: "developer" },
										{ name: "Background Remover", route: "/background-remover", cat: "image" },
										{ name: "CGPA Calculator", route: "/cgpa-calculator", cat: "calculators" },
										{ name: "QR Code Generator", route: "/qr-code-generator", cat: "utilities" },
									].map((tool) => (
										<button
											key={tool.route}
											type="button"
											onClick={() => {
												setIsOpen(false);
												router.push(tool.route);
											}}
											className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted/50 hover:bg-muted border border-border/50 text-left transition-all group cursor-pointer"
										>
											<span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
												{tool.name}
											</span>
											<span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
												{tool.cat}
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer Bar */}
				<div className="px-4 py-2.5 border-t border-border/60 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
					<div className="flex items-center gap-2">
						<ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
						<span>100% In-Browser Privacy</span>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden sm:inline-flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↑↓</kbd> navigate
						</span>
						<span className="hidden sm:inline-flex items-center gap-1">
							<kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↵</kbd> open
						</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
