import React from "react";
import { Metadata } from "next";
import { getSearchToolRecords } from "@/lib/tools";
import { SITE_CONFIG } from "@/constants/config";
import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";
import StructuredData from "@/components/shared/StructuredData";
import AdPlacement from "@/components/ads/AdPlacement";

// Centralized Marketing Components
import { HeroSection } from "@/components/marketing/HeroSection";
import { CategoryShowcase } from "@/components/marketing/CategoryShowcase";
import { ToolDirectorySection } from "@/components/marketing/ToolDirectorySection";
import { TrustSection } from "@/components/marketing/TrustSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { EmbedShowcase } from "@/components/marketing/EmbedShowcase";
import { HomeSEOContent } from "@/components/marketing/HomeSEOContent";
import { Container } from "@/components/layout/Container";

export async function generateMetadata(): Promise<Metadata> {
	return baseGenerateMetadata({
		title: `Free Online Tools (600+) — Fast & Private Browser Utilities | SopKit`,
		description: `600+ free online tools for PDF, image, video, audio, developer code, and SEO. Process files 100% locally in your browser with zero uploads, no tracking, and no signup.`,
		path: "/",
	});
}

export default async function LandingPage() {
	const searchTools = getSearchToolRecords();
	// The hero only needs a compact search index. The full registry remains available
	// to the directory component, while the global command palette is loaded on demand.
	const heroSearchTools = searchTools.filter((tool) => tool.popular).slice(0, 120);

	return (
		<main id="main-content" className="flex flex-col min-h-screen bg-background text-foreground">
			{/* JSON-LD Structured Data (FAQ schema is provided by FAQSection) */}
			<StructuredData isHome={true} includeFAQ={false} />

			{/* 1. Hero Section with Editorial Display & Fanned Interactive Cards */}
			<HeroSection tools={heroSearchTools} />

			{/* Ad Unit after Hero */}
			<div className="py-4 max-w-4xl mx-auto w-full px-4">
				<AdPlacement placement="after-hero" pageType="home" />
			</div>

			{/* 2. Category Showcase: Visual Category Gateway */}
			<div className="[content-visibility:auto] [contain-intrinsic-size:1px_520px]">
				<CategoryShowcase />
			</div>

			{/* 3. Live 600+ Tool Directory with Fast Search & Category Filter Tabs */}
			<div className="[content-visibility:auto] [contain-intrinsic-size:1px_900px]">
				<ToolDirectorySection tools={searchTools} />
			</div>

			{/* 4. Trust & Architecture Pillars (Browser-First, No Signup, Fast) */}
			<div className="[content-visibility:auto] [contain-intrinsic-size:1px_560px]">
				<TrustSection />
			</div>

			{/* 5. Webmaster Embed Feature Showcase */}
			<div className="[content-visibility:auto] [contain-intrinsic-size:1px_700px]">
				<Container size="xl" className="py-12">
					<EmbedShowcase />
				</Container>
			</div>

			{/* In-Content Ad Placement */}
			<div className="py-4 max-w-4xl mx-auto w-full px-4 [content-visibility:auto]">
				<AdPlacement placement="in-content" pageType="home" />
			</div>

			{/* 6. Comprehensive Semantic SEO Domain Content */}
			<div className="[content-visibility:auto]">
				<HomeSEOContent />
			</div>

			{/* Footer Ad Slot */}
			<div className="py-4 max-w-4xl mx-auto w-full px-4 [content-visibility:auto]">
				<AdPlacement placement="footer" pageType="home" />
			</div>

			{/* 7. Honest Editorial FAQ Accordion */}
			<div className="[content-visibility:auto]">
				<FAQSection />
			</div>
		</main>
	);
}
