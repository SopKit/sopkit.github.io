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
				<div className="absolute top-0 left-[-10%] w-[35%] h-[35%] bg-primary/5 blur-[100px] rounded-none" />
				<div className="absolute bottom-0 right-[-10%] w-[35%] h-[35%] bg-secondary/5 blur-[100px] rounded-none" />
			</div>

			<div className="w-full max-w-3xl mx-auto text-center px-4">
				<h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1] bg-gradient-to-b from-foreground to-foreground/80">
					{title}
				</h1>
				{subtitle && (
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
						{subtitle}
					</p>
				)}

				{/* Search Discovery Engine */}
				<form
					onSubmit={handleSearch}
					className="relative w-full max-w-2xl mx-auto group animate-fade-in"
				>
					<div className="relative flex items-center shadow-lg border border-border/40 hover:border-border transition-all">
						<Search className="absolute left-6 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
						<Input
							ref={inputRef}
							type="text"
							placeholder="Search for any tool (e.g. 'compress image', 'pdf', 'youtube')..."
							className="h-16 pl-16 pr-32 rounded-none bg-card border-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-muted-foreground/50 w-full"
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
							className="absolute right-2 h-12 px-6 rounded-none bg-primary hover:bg-primary/95 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
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
