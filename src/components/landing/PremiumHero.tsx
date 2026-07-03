"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PremiumHero({ title, subtitle = "" }) {
	const [query, setQuery] = useState("");
	const router = useRouter();

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query)}`);
		}
	};

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
				
				{/* Search Discovery Engine */}
				<form 
					onSubmit={handleSearch}
					className="relative w-full max-w-2xl mx-auto group animate-fade-in"
				>
					<div className="relative flex items-center shadow-lg border border-border/40 hover:border-border transition-all">
						<Search className="absolute left-6 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
						<Input
							type="text"
							placeholder="Search for any tool (e.g. 'compress image', 'pdf', 'youtube')..."
							className="h-16 pl-16 pr-32 rounded-none bg-card border-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-muted-foreground/50 w-full"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<Button 
							type="submit"
							className="absolute right-2 h-12 px-6 rounded-none bg-primary hover:bg-primary/95 text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
						>
							Find Tool
						</Button>
					</div>
				</form>

				<div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', border: '1px solid rgb(224, 224, 224)', borderRadius: '12px', padding: '20px', maxWidth: '500px', background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px', margin: '32px auto 0' }} className="text-left dark:bg-zinc-950 dark:border-zinc-800/80">
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
						<img alt="SopKit" src="https://ph-files.imgix.net/47198f1e-0017-4cdc-85b9-c0b00a293f45.vnd.microsoft.icon?auto=compress,format&amp;codec=mozjpeg&amp;cs=strip&amp;fit=crop&amp;h=80&amp;w=80" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
						<div style={{ flex: '1 1 0%', minWidth: '0px' }}>
							<h3 style={{ margin: '0px', fontSize: '18px', fontWeight: '600', color: 'rgb(26, 26, 26)', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="dark:text-zinc-100">SopKit</h3>
							<p style={{ margin: '4px 0px 0px', fontSize: '14px', color: 'rgb(102, 102, 102)', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} className="dark:text-zinc-400">SopKit — 460+ Free Online Tools, No Signup Required</p>
						</div>
					</div>
					<a href="https://www.producthunt.com/products/sopkit?embed=true&amp;utm_source=embed&amp;utm_medium=post_embed" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '12px', padding: '8px 16px', background: 'rgb(255, 97, 84)', color: 'rgb(255, 255, 255)', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>Check it out on Product Hunt →</a>
				</div>
			</div>
		</div>
	);
}
