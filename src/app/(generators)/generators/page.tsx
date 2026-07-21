import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Fun Generators",
	description: "Privacy-friendly, 100% client-side fun generators. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
	route: "/generators",
	category: "others",
});

export default function GeneratorsHub() {
	const tools = getAllToolsByCategory("generators");

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="AI & Fun Generators" 
					subtitle="Generate anything from stunning AI art to professional social bios instantly. Free, fast, and no registration required."
				/>
				
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-20" />
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight">{tool.name}</span>
											<ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{tool.description}
										</p>
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
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Generators — AI Content, Memes, Bios & Creative Tools</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's generator collection brings together 30+ creative tools for generating AI images, music, voiceovers, memes, social media bios, color palettes, pixel art, and more. Every generator runs 100% client-side in your browser using Canvas API, Web Audio API, and JavaScript — no data leaves your device.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								Create stunning AI-generated images from text prompts, compose royalty-free music with AI, convert text to natural-sounding speech, or generate professional Instagram bios with custom fonts. Our meme generator lets you add classic meme text to images, while the color palette generator creates harmonious schemes for your design projects.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Unlike competitor generators that upload your prompts and uploads to their servers (often for AI training), SopKit processes everything locally. Your ideas, images, and generated content are yours alone. Free, private, and no registration required.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
