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
		title: `SopKit — ${SITE_CONFIG.toolCountString} Free Online Tools`,
		description: `${SITE_CONFIG.toolCountString} free online tools for Image, PDF, Video, Audio, Developer utilities, and SEO. Browser-first workflows with clear processing details and no mandatory signup.`,
		path: "/",
	});
}

export default async function LandingPage() {
	const searchTools = getSearchToolRecords();

	return (
		<main id="main-content" className="flex flex-col min-h-screen bg-background text-foreground">
			{/* JSON-LD Structured Data */}
			<StructuredData isHome={true} />

			{/* 1. Hero Section with Editorial Display & Fanned Interactive Cards */}
			<HeroSection tools={searchTools} />

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
