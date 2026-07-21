import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "SEO Tools",
	description: "Privacy-friendly, 100% client-side SEO Tools. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/seo-tools",
	category: "seo",
});

export default function SEOHub() {
	const tools = getAllToolsByCategory("seo");
	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="SEO Utilities" 
					subtitle="Boost your search visibility with our professional SEO toolkit. Fast, data-driven, and 100% free online optimization tools."
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
											<Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{tool.description}
										</p>
										<div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest gap-1">
											Analyze Site <ArrowRight className="w-3 h-3" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Rich SEO Content */}
					<section className="mt-20 max-w-4xl mx-auto space-y-8">
						<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online SEO Tools — Analyze, Audit & Optimize Your Website</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's SEO tools help you analyze, audit, and optimize your website for better search engine rankings — all 100% free and processed entirely in your browser. Unlike other SEO toolkits that upload your website data to their servers, every tool here runs client-side, keeping your search strategies and site data completely private.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								From checking meta tags and Open Graph previews to generating sitemaps and auditing technical SEO, our suite covers the essential on-page optimization tasks that drive organic traffic. Use the backlink checker to monitor your link profile, the keyword research tool to discover ranking opportunities, and the Google cache checker to verify indexing status.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								All tools are free to use with no registration, no usage limits, and no data collection. Perfect for SEO professionals, bloggers, small business owners, and anyone looking to improve their search visibility without compromising their privacy.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
