import { PremiumHero } from "@/components/landing/PremiumHero";
import { HomeSEOContent } from "@/components/landing/HomeSEOContent";
import { HomeFAQ } from "@/components/landing/HomeFAQ";
import { BentoCategoryGrid } from "@/components/landing/BentoCategoryGrid";
import { EmbedShowcase } from "@/components/landing/EmbedShowcase";
import { getAllTools } from "@/lib/tools";
import Link from "next/link";
import StructuredData from "@/components/shared/StructuredData";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { ToolDirectory } from "@/components/landing/ToolDirectory";
import { ArrowRight } from "lucide-react";

import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<any> {
	return baseGenerateMetadata({
		title: `SopKit — ${SITE_CONFIG.toolCountString} Free Online Tools (100% Client-Side & Private)`,
		description: `${SITE_CONFIG.toolCountString} free online tools for Image, PDF, Video, Audio, Developer utilities, and SEO that run 100% client-side in your browser. Private, fast, and secure — zero uploads, no tracking, no signup required.`,
		path: "/",
	});
}

export default async function LandingPage() {
	const heroSubtitle = `While other tool sites upload and store your files on cloud servers, SopKit runs 100% locally in your browser sandbox using WebAssembly. Zero data collection, instant speed, no signup required.`;
	const allTools = getAllTools();

	return (
		<main className="bg-background min-h-screen relative overflow-hidden">
			<StructuredData isHome={true} />
			{/* Global Decorative Gradients */}
			<div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-cute opacity-20 -z-10" />

			<div className="container mx-auto px-4 max-w-7xl">
				{/* Hero Section */}
				<PremiumHero subtitle={heroSubtitle} tools={allTools} />

				{/* High Viewability Ad Unit after Hero & Sponsors */}
				<div className="py-4 max-w-4xl mx-auto">
					<AdPlacement placement="after-hero" pageType="home" />
				</div>

				{/* Bento Category Grid */}
				<BentoCategoryGrid />

				{/* 605+ Live Tool Directory Search & Index Grid */}
				<ToolDirectory tools={allTools} />

				{/* Ad-Free Embed Feature Highlight */}
				<EmbedShowcase />

				{/* High-Value In-Content Ad Section */}
				<div className="py-8 max-w-4xl mx-auto [content-visibility:auto] [contain-intrinsic-size:1px_300px]">
					<AdPlacement placement="in-content" pageType="home" />
				</div>

				{/* Final CTA - View All Tools */}
				<section className="py-14 text-center border-t border-border/40 [content-visibility:auto] [contain-intrinsic-size:1px_300px]">
					<div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 sm:py-16 rounded-3xl bg-gradient-to-b from-card/90 via-card/70 to-card/40 border border-border/80 dark:border-border/40 text-foreground relative overflow-hidden group shadow-xl backdrop-blur-xl">
						{/* Ambient Glow */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-600/15 via-sky-400/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 select-none">
							<span>Instant Client-Side Execution</span>
						</div>

						<h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground uppercase">
							Looking for a specific utility?
						</h2>
						<p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
							We maintain {SITE_CONFIG.toolCountString} free browser-based tools for image editing, PDF compression, code formatting, calculators, and content utilities.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<Link 
								href="/tools" 
								className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 shadow-lg shadow-primary/25"
							>
								View All {SITE_CONFIG.toolCountString} Tools
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="/image-tools"
								className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-muted/50 hover:bg-muted text-foreground border border-border/60 px-6 text-sm font-semibold transition-all hover:border-border"
							>
								Explore Image Suite
							</Link>
						</div>
					</div>
				</section>

				{/* High-Value SEO Content Section */}
				<div className="[content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
					<HomeSEOContent />
				</div>

				{/* Multiplex Footer Ad Slot */}
				<div className="py-8 max-w-4xl mx-auto [content-visibility:auto] [contain-intrinsic-size:1px_300px]">
					<AdPlacement placement="footer" pageType="home" />
				</div>

				{/* Conversational SEO (FAQs) */}
				<div className="[content-visibility:auto] [contain-intrinsic-size:1px_600px]">
					<HomeFAQ />
				</div>
			</div>
		</main>
	);
}
