import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, ArrowRight } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Developer Tools",
	description: "Privacy-friendly, 100% client-side Developer Tools online. Run secure local processing in your browser with zero file uploads and no data selling. Fast, safe, and free forever.",
	route: "/developer-tools",
	category: "others",
});

export default function DeveloperHub() {
	const tools = getAllToolsByCategory("developer");
	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="Developer Utilities" 
					subtitle="Professional-grade tools for modern workflows. Fast, private, and 100% browser-based processing for all your coding needs."
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
											<Terminal className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
											{tool.description}
										</p>
										<div className="mt-4 flex items-center text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest gap-1">
											Open Tool <ArrowRight className="w-3 h-3" />
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Rich SEO Content */}
					<section className="mt-20 max-w-4xl mx-auto space-y-8">
						<div className="p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Developer Tools — Format, Convert, Validate & Debug</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's developer toolkit provides 60+ utilities for formatting, validating, converting, and debugging code and data — all running 100% client-side in your browser. Whether you need to beautify JSON, minify CSS, encode Base64, decode JWTs, or convert between YAML and XML, every tool processes your data locally with no server uploads.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								Unlike online code tools that send your sensitive source code to external servers (where it can be logged, analyzed, or used for training), SopKit ensures your code never leaves your machine. Our tools include JSON formatters and validators, HTML/CSS/JS beautifiers and minifiers, SQL formatters, JWT decoders, UUID generators, Base64 encoders, and much more.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								All developer tools are free with no registration, no API keys, and no usage limits. Perfect for software engineers, web developers, DevOps professionals, and students who need quick, reliable development utilities without compromising data privacy.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
