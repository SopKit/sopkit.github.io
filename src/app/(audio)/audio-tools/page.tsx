import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, ArrowRight, Sparkles } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Audio Tools",
	description: "Private Audio Tools: privately convert audio files entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/audio-tools",
	category: "audio",
});

export default function AudioHub() {
	const tools = getAllToolsByCategory("audio");
	const categories = getAllCategories().map(cat => ({ 
		label: cat.name, 
		href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` 
	}));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero 
					title="Audio Utilities" 
					subtitle="Convert, compress, and edit audio files 100% free in your browser. No signup, no uploads to servers — everything stays private."
				/>
				
				<div className="container mx-auto px-4 py-16 max-w-7xl relative">
					<GridPattern className="opacity-10" />
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
						{tools.map((tool: Tool) => (
							<Link key={tool.id} href={tool.route}>
								<Card className="h-full border border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 group overflow-hidden bg-card/60 backdrop-blur-sm">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<span className="text-xl font-bold tracking-tight flex items-center gap-2">
												<Music className="w-5 h-5 text-primary" />
												{tool.name}
											</span>
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
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Audio Tools — Edit, Convert & Enhance Audio Files</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's audio toolkit lets you edit, convert, and enhance audio files directly in your browser — with zero uploads to any server. Use the 10-band graphic equalizer to fine-tune frequencies, join multiple audio clips into seamless tracks, convert text to natural-sounding speech, or tune your guitar with the built-in chromatic tuner.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								All audio processing leverages the Web Audio API for real-time, high-fidelity sound manipulation. Unlike online audio editors that require file uploads to their servers, SopKit processes everything locally — your audio files never leave your device. This means faster processing, unlimited file sizes (limited only by your browser's memory), and complete privacy.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Perfect for podcasters, musicians, content creators, and anyone who needs quick audio adjustments without installing heavy software or sharing their files with third-party services. Free, private, and no registration needed.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
