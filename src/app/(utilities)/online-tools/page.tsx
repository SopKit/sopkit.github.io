import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { GridPattern } from "@/components/shared/GridPattern";
import { getAllCategories, type Category, type Tool } from "@/lib/tools";

export const metadata = {
	title: "Free Online Tools — 600+ Browser-Based Utilities | SopKit",
	description:
		"Browse 600+ free online tools for images, PDFs, text, video, SEO, and code. Everything runs in your browser — no signup, no uploads, no limits.",
	keywords:
		"online tools, free online tools, browser tools, web utilities, image tools, pdf tools, text tools, developer tools, seo tools, converters, calculators, sopkit",
	alternates: {
		canonical: "https://sopkit.github.io/online-tools",
	},
	openGraph: {
		title: "Free Online Tools — 600+ Browser-Based Utilities | SopKit",
		description:
			"Browse 600+ free online tools for images, PDFs, text, video, SEO, and code. Everything runs in your browser — no signup, no uploads, no limits.",
		url: "https://sopkit.github.io/online-tools",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Online Tools — 600+ Browser-Based Utilities | SopKit",
		description:
			"Browse 600+ free online tools for images, PDFs, text, video, SEO, and code. Everything runs in your browser — no signup, no uploads, no limits.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

const EXCLUDED_CATEGORY_SLUGS = new Set(["company", "guides", "blog"]);

function ToolCard({ tool }: { tool: Tool }) {
	return (
		<Link
			href={tool.route}
			className="group flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-card/50 px-3.5 py-3 hover:border-primary/40 hover:bg-card transition-colors"
		>
			<span className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
				{tool.name}
			</span>
			{tool.popular && (
				<span className="shrink-0 mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
					Popular
				</span>
			)}
		</Link>
	);
}

function CategorySection({ category }: { category: Category }) {
	const tools = category.tools || [];
	if (tools.length === 0) return null;
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
				{category.description && (
					<p className="mt-1 text-sm text-muted-foreground max-w-3xl">{category.description}</p>
				)}
				<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
					{tools.length} tools
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
				{tools.map((tool) => (
					<ToolCard key={tool.id} tool={tool} />
				))}
			</div>
		</section>
	);
}

export default function OnlineToolsHub() {
	const allCategories = getAllCategories().filter((c) => !EXCLUDED_CATEGORY_SLUGS.has(c.slug));
	const totalTools = allCategories.reduce((sum, c) => sum + (c.tools?.length || 0), 0);

	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Free Online Tools",
		description: `Browse ${totalTools}+ free online tools for images, PDFs, text, video, audio, SEO, developers, and more. No signup, no uploads — everything runs in your browser.`,
		url: "https://sopkit.github.io/online-tools",
		isAccessibleForFree: true,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: allCategories.length,
			itemListElement: allCategories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CollectionPage",
					name: category.name,
					description: category.description,
				},
			})),
		},
	};

	return (
		<div className="min-h-screen bg-background selection:bg-primary/10">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
			/>
			<main>
				<header className="relative border-b border-border/40 overflow-hidden">
					<GridPattern className="opacity-10" />
					<div className="container mx-auto px-4 py-16 md:py-20 max-w-7xl relative z-10">
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Free Online Tools</h1>
						<p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
							A complete library of {totalTools}+ browser-based utilities — compress an image, format
							JSON, convert units, or build a QR code in seconds. Every tool runs locally on your device,
							so nothing you paste or upload ever leaves your browser.
						</p>
						<p className="mt-3 text-sm text-muted-foreground flex items-center gap-1.5">
							Looking for something specific?
							<Link href="/search" className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors">
								<Search className="h-3.5 w-3.5" />
								Search all tools
							</Link>
						</p>
					</div>
				</header>

				<div className="container mx-auto px-4 py-14 max-w-7xl space-y-16">
					{allCategories.map((category) => (
						<CategorySection key={category.slug} category={category} />
					))}

					<section className="rounded-2xl border border-border/60 bg-card/40 p-8 md:p-10">
						<h2 className="text-2xl font-bold tracking-tight">Embed Any Tool on Your Site</h2>
						<p className="mt-3 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
							Want these tools on your own website? Every SopKit tool ships as a sandboxed iframe widget
							with light/dark themes and accent colors — copy one snippet and you are done. Grab ready-made
							code on our{" "}
							<Link href="/embed-tools" className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors">
								embed widgets page
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
							.
						</p>
					</section>
				</div>
			</main>
		</div>
	);
}
