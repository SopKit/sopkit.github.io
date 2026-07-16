import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata = {
	title: "Free AI Prompt Tools & Persona Generators - SopKit",
	description: "Optimize your AI workflows. Build Midjourney prompts, generate custom system personas for ChatGPT and Claude, and optimize your prompts online.",
	keywords: "ai tools, midjourney prompt builder, system prompt generator, chatgpt persona creator, ai prompt optimizer, free online prompt helper, SopKit, ai-tools, free ai-tools, ai tools online, prompt tools, free prompt tool",
	alternates: {
		canonical: "https://sopkit.github.io/ai-tools/",
	},
	openGraph: {
		title: "Free AI Prompt Tools & Persona Generators - SopKit",
		description: "Optimize your AI workflows. Build Midjourney prompts, generate custom system personas for ChatGPT and Claude, and optimize your prompts online.",
		url: "https://sopkit.github.io/ai-tools/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free AI Prompt Tools & Persona Generators - SopKit",
		description: "Optimize your AI workflows. Build Midjourney prompts, generate custom system personas for ChatGPT and Claude, and optimize your prompts online.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function AiToolsHub() {
	const tools = getAllToolsByCategory("ai-tools");
	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="AI Prompt Engineering Suite" 
					subtitle="Interactive prompt builders and system instructions generators. Elevate your creative output on Midjourney, ChatGPT, Claude, and Gemini with optimized structures."
				/>
				
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-10" />
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full hover:shadow-2xl hover:border-primary/50 transition-all group overflow-hidden bg-card/50 backdrop-blur-sm border-border/40">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight">{tool.name}</span>
											<Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
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
				</div>
			</main>
		</div>
	);
}
