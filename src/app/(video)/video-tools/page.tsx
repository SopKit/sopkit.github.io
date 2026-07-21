import { getAllToolsByCategory, getAllCategories, Tool } from "@/lib/tools";
import { PremiumHero } from "@/components/landing/PremiumHero";
import { GridPattern } from "@/components/shared/GridPattern";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, ArrowRight, Sparkles } from "lucide-react";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Video Tools",
	description: "Private Video Tools: privately convert videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/video-tools",
	category: "video",
});

export default function VideoToolsHub() {
	const tools = getAllToolsByCategory("video");
	const categories = getAllCategories().map(cat => ({ label: cat.name, href: cat.slug.startsWith("/") ? cat.slug : `/${cat.slug}` }));

	return (
		<div className="min-h-screen bg-background">
			<main>
				<PremiumHero title="Video Tools" subtitle="Convert, edit, and download videos 100% free in your browser. No signup, no uploads to servers — everything stays private." />
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
							<h2 className="text-2xl font-bold tracking-tight mb-4">Free Online Video Tools — Convert, Edit & Download Videos Privately</h2>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								SopKit's video tools let you convert, edit, and summarize video content entirely in your browser. Convert between MP4, WebM, AVI, and other formats using the built-in video converter, or use the AI Video Summarizer to extract key points from YouTube lectures and meeting recordings.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								All video processing uses browser-based APIs (Canvas, MediaRecorder) to handle conversion and editing locally. Unlike competing video tools that upload your files to their servers for processing — where they can be logged, analyzed, or used for training — SopKit ensures your videos never leave your device.
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Free to use with no registration, no upload limits, and no watermarks. Perfect for content creators, marketers, educators, and anyone who needs quick video processing without compromising their privacy.
							</p>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
