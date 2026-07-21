import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type, ArrowRight } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Text Tools",
	description: "Private Text Tools: privately convert web data entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/text-tools",
	category: "utilities",
});

export default function TextHub() {
	const tools = getAllToolsByCategory("text");
	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="Text Utilities" 
					subtitle="Fast and secure text transformation tools. Format, clean, and analyze your content instantly with our professional suite."
				/>
				
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-10" />
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight">{tool.name}</span>
											<Type className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{tool.description}
										</p>
										<div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest gap-1">
											Process Text <ArrowRight className="w-3 h-3" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Rich SEO Content */}
					<section className="mt-20 max-w-4xl mx-auto space-y-8">
						<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Text Tools — Transform, Analyze & Format Text Instantly</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's text tools provide 35+ utilities for transforming, analyzing, and formatting text — all processed 100% client-side in your browser. From word counters and case converters to Markdown editors, Lorem Ipsum generators, and legacy Devanagari converters, every tool keeps your data private and secure.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								Need to compare two documents, remove duplicate lines, sort text alphabetically, or convert between Kruti Dev and Unicode Hindi scripts? Our text manipulation suite handles it all. Use the word frequency counter for content analysis, the text-to-handwriting converter for creative projects, or the fancy text generator for social media posts.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Unlike online text tools that send your content to external servers, SopKit processes everything locally in your browser. Your text never leaves your device. Free, private, and no registration required.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
