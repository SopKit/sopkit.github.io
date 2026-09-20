import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, ArrowRight, Sparkles } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";
import { getMonetizationDecision } from "@/data/monetization";

export const metadata = generateToolMetadata({
	name: "Video Tools",
	description: "Explore SopKit video utilities for conversion and editing. Each tool page explains its processing model, supported formats, and privacy considerations.",
	route: "/video-tools",
	category: "video",
});

export default function VideoToolsHub() {
	const tools = getAllToolsByCategory("video").filter((tool) => getMonetizationDecision({ slug: tool.id, category: tool.category }).indexable);
	const categories = getAllCategories().map(cat => ({ label: cat.name, href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` }));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero title="Video Tools — Convert & Edit" subtitle="Convert and edit supported video files with browser-based utilities. Review each tool's processing model before using it." />
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-20" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight flex items-center gap-2">
												<Film className="w-5 h-5 text-primary" />
												{tool.name}
											</span>
											<ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</p>
										{tool.popular && (
											<div className="mt-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
												<Sparkles className="w-3 h-3" /> Popular
											</div>
										)}
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Rich SEO Content */}
					<section className="mt-20 max-w-4xl mx-auto space-y-8">
						<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Video Tools — Convert & Edit</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit provides browser utilities for common video conversion and editing tasks. Supported capabilities vary by tool, so each page documents its inputs, outputs, and processing model.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								Some video tools process locally in the browser, while other workflows can use external services. The individual tool page identifies the applicable processing model rather than applying one privacy claim to the entire category.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Core tools are available without registration. Review the tool-specific limits and requirements before processing or exporting a video.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
