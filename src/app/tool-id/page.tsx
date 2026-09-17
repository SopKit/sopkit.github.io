import React from "react";
import { Metadata } from "next";
import { getAllTools, getAllCategories } from "@/lib/tools";
import { generateMetadata as baseGenerateMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/config";
import { Container } from "@/components/layout/Container";
import ToolIdExplorer, { ToolSummary } from "./ToolIdExplorer";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
	return baseGenerateMetadata({
		title: "Tool IDs & Embed Directory — SopKit Developer Reference",
		description: `Lookup tool IDs, copy customizable iframe embed codes, and integrate ${SITE_CONFIG.toolCountString} free client-side utilities directly into your website or web app.`,
		path: "/tool-id",
	});
}

export default async function ToolIdPage() {
	const allTools = getAllTools();
	const allCategories = getAllCategories();

	const initialTools: ToolSummary[] = allTools.map((t) => ({
		id: t.id,
		name: t.name,
		route: t.route,
		category: t.category,
		description: t.description,
	}));

	const categories = [
		{ slug: "all", name: "All Categories" },
		...allCategories.map((c) => ({
			slug: c.slug,
			name: c.name,
		})),
	];

	// Schema.org Structured Data
	const structuredData = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": "https://sopkit.space/tool-id/#webpage",
				"url": "https://sopkit.space/tool-id",
				"name": "Tool IDs & Embed Directory — SopKit Developer Reference",
				"description": `Developer directory to lookup tool IDs, generate iframe embed codes, and integrate ${SITE_CONFIG.toolCountString} free tools into your site.`,
				"breadcrumb": {
					"@type": "BreadcrumbList",
					"itemListElement": [
						{
							"@type": "ListItem",
							"position": 1,
							"name": "Home",
							"item": "https://sopkit.space"
						},
						{
							"@type": "ListItem",
							"position": 2,
							"name": "Tool ID Directory",
							"item": "https://sopkit.space/tool-id"
						}
					]
				}
			},
			{
				"@type": "TechArticle",
				"@id": "https://sopkit.space/tool-id/#article",
				"headline": "Embedding SopKit Client-Side Tools: Developer Integration Guide",
				"description": "Comprehensive reference guide on embedding SopKit browser-based tools using responsive, privacy-compliant iframes.",
				"author": {
					"@type": "Organization",
					"name": "SopKit Engineering"
				}
			}
		]
	};

	return (
		<div className="bg-background min-h-screen relative text-foreground">
			<Script
				id="tool-id-schema"
				type="application/ld+json"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<Container size="xl" className="py-10 sm:py-14">
				{/* Editorial Header */}
				<div className="max-w-4xl mb-10 space-y-4">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border text-xs font-mono text-muted-foreground select-none">
						<span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
						<span>Developer Reference & Embed API</span>
						<span className="text-border">•</span>
						<span>{initialTools.length} Live Tools</span>
					</div>

					<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground leading-[1.15]">
						Tool IDs & Embed Directory
					</h1>
					<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
						Explore complete tool IDs, direct routes, and responsive iframe embed snippets for every
						utility on SopKit. Embed ad-free, 100% client-side converters, generators, and privacy tools
						directly into your blog, documentation, or SaaS application.
					</p>
				</div>

				{/* Interactive Explorer UI */}
				<ToolIdExplorer initialTools={initialTools} categories={categories} />

				{/* Developer Documentation & SEO Guide */}
				<div className="mt-16 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="space-y-3">
						<h2 className="text-base font-semibold text-foreground font-sans">
							100% Client-Side Execution
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							When you embed any SopKit tool using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">/embed-tool/?id=...</code> endpoint, all file processing, image transformations, and PDF calculations happen directly in the user&apos;s local browser session. Zero file uploads or payload transfers reach external servers.
						</p>
					</div>

					<div className="space-y-3">
						<h2 className="text-base font-semibold text-foreground font-sans">
							Ad-Free & Clean Embeds
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							The embed endpoint strips away site navigation headers, footers, advertisements, and extraneous links, presenting only the focused interactive tool interface designed to blend smoothly inside your application&apos;s UI.
						</p>
					</div>

					<div className="space-y-3">
						<h2 className="text-base font-semibold text-foreground font-sans">
							Customizable & Responsive
						</h2>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Use the theme and accent parameters to tailor the widget to your platform&apos;s design system. Add standard responsive iframe styles or CSS container queries to ensure seamless mobile and desktop rendering.
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
}
