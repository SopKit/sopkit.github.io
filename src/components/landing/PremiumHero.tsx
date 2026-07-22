"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTools } from "@/lib/tools";

const SUGGESTIONS = [
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

export function PremiumHero({ title, subtitle = "" }) {
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const allTools = getAllTools();

	const suggestions = (() => {
		if (!query.trim()) return SUGGESTIONS.slice(0, 6);
		const q = query.toLowerCase();
		return allTools
			.filter(
				(t) =>
					t.name.toLowerCase().includes(q) ||
					t.description.toLowerCase().includes(q) ||
					t.id.toLowerCase().includes(q)
			)
			.slice(0, 6);
	})();

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query)}`);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative pt-12 pb-8 md:pt-20 md:pb-12 overflow-hidden flex flex-col justify-center items-center">
			{/* Background Ambient Glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-blue-500/15 dark:bg-blue-500/20 blur-[130px] rounded-full" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-sky-500/15 dark:bg-sky-500/20 blur-[130px] rounded-full" />
			</div>

			<div className="w-full max-w-3xl mx-auto text-center px-4">
				<h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
					{title.includes("—") ? (
						<>
							{title.split("—")[0]} — <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 dark:from-blue-400 dark:via-sky-400 dark:to-blue-300 bg-clip-text text-transparent">{title.split("—")[1]}</span>
						</>
					) : (
						title
					)}
				</h1>
				{subtitle && (
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
						{subtitle}
					</p>
				)}
 
 				{/* Search Discovery Engine */}
 				<form
 					onSubmit={handleSearch}
 					className="relative w-full max-w-2xl mx-auto group animate-fade-in"
 				>
					<div className="relative flex items-center shadow-md shadow-blue-500/5 border border-blue-500/20 dark:border-blue-500/30 rounded-xl bg-card overflow-hidden transition-all duration-200 hover:border-blue-500/40 focus-within:border-blue-500 dark:focus-within:border-blue-400">
 						<Search className="absolute left-6 h-5 w-5 text-blue-600 dark:text-blue-400 transition-colors" />
 						<Input
 							ref={inputRef}
 							type="text"
 							placeholder="Search for any tool (e.g. 'compress image', 'pdf', 'youtube')...."
							className="h-16 pl-16 pr-32 bg-transparent border-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-muted-foreground/50 w-full"
 							value={query}
 							onChange={(e) => {
 								setQuery(e.target.value);
 								setShowSuggestions(true);
 							}}
 							onFocus={() => setShowSuggestions(true)}
 							autoComplete="off"
 						/>
 						<Button
 							type="submit"
							className="absolute right-2 h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25 transition-all"
 						>
 							Find Tool
 						</Button>
 					</div>

					{showSuggestions && (
						<div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border/60 shadow-2xl z-50 max-h-[320px] overflow-y-auto rounded-xl">
							{suggestions.map((item) => {
								const isTool = "route" in item;
								const label = isTool ? item.name : item;
								const description = isTool ? item.description : "";
								const category = isTool ? item.category : "";
								const href = isTool ? item.route : `/search?q=${encodeURIComponent(label)}`;

								return (
									<div
										key={label}
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => {
											setQuery(label);
											setShowSuggestions(false);
											if (isTool) {
												router.push(href);
											} else {
												router.push(`/search?q=${encodeURIComponent(label)}`);
											}
										}}
										className="flex items-center justify-between px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/10 last:border-b-0 cursor-pointer"
									>
										<div className="flex items-center gap-3 min-w-0">
											<Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
											<div className="min-w-0">
												<p className="text-sm font-bold truncate">{label}</p>
												{description && (
													<p className="text-[11px] text-muted-foreground truncate">{description}</p>
												)}
											</div>
										</div>
										{category && (
											<Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wide shrink-0">
												{category.replace("-tools", "")}
											</Badge>
										)}
									</div>
								);
							})}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
