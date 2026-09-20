import React from "react";
import { Metadata } from "next";
import { getSearchToolRecords } from "@/lib/tools";
import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/config";
import AdPlacement from "@/components/ads/AdPlacement";
import { Container } from "@/components/layout/Container";
import { ToolDirectorySection } from "@/components/marketing/ToolDirectorySection";
import { VisitorBadge } from "@/components/shared/VisitorBadge";

export async function generateMetadata(): Promise<Metadata> {
	return baseGenerateMetadata({
		title: `All Free Online Tools Directory (${SITE_CONFIG.toolCountString} Tools) | SopKit`,
		description: `Browse a curated directory of SopKit browser utilities for Image, PDF, Video, Audio, SEO, and developer workflows, with processing details shown on each tool page.`,
		path: "/tools",
	});
}

export default async function ToolsDirectoryPage() {
	const searchTools = getSearchToolRecords();

	return (
		<div className="bg-background min-h-screen relative text-foreground">
			<Container size="xl" className="py-12 sm:py-16">
				{/* Editorial Header */}
				<div className="max-w-3xl mb-12 space-y-4">
					<div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border text-xs font-mono text-muted-foreground select-none">
						<span className="w-2 h-2 rounded-full bg-emerald-500" />
						<span>{SITE_CONFIG.toolCountString} Available Utilities</span>
						<span className="text-border">•</span>
						<span>Browser-First</span>
						<span className="text-border">•</span>
						<VisitorBadge path="/tools" label="PAGE VIEWS" />
					</div>

					<h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-[1.1]">
						Complete Tool Directory
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
						Explore a curated catalog of {SITE_CONFIG.toolCountString} browser utilities across common file, developer, calculator, and content workflows.
						Each tool page explains its processing model, supported inputs, and important limitations before you use it.
					</p>
				</div>

				<div className="max-w-4xl mx-auto my-6">
					<AdPlacement placement="after-hero" pageType="category" />
				</div>

				{/* Centralized Search and Filter Directory */}
				<ToolDirectorySection tools={searchTools} />

				<div className="max-w-4xl mx-auto my-12">
					<AdPlacement placement="footer" pageType="category" />
				</div>
			</Container>
		</div>
	);
}
