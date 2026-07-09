import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HelpCircle, FileText, ArrowRight, Rss, Layers } from "lucide-react";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "SopKit Resources — Developer Guides, APIs, and Documentation",
	description: "Access official guides, cheat sheets, API specifications, and community resources to maximize your developer productivity with SopKit.",
	alternates: {
		canonical: "https://sopkit.github.io/resources/",
	},
	openGraph: {
		title: "SopKit Resources — Developer Guides, APIs, and Documentation",
		description: "Browse guides, tools libraries, and API specifications.",
		url: "https://sopkit.github.io/resources/",
		images: [{ url: "/og-images/packages.png" }],
	},
};

export default function ResourcesPage() {
	const resourcesSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": "SopKit Resources Hub",
		"description": "Guides, APIs, sitemaps, RSS feeds, and packages list for SopKit developer ecosystem.",
		"url": "https://sopkit.github.io/resources/"
	};

	const resourceCards = [
		{
			title: "Packages & Ecosystem",
			desc: "Explore zero-dependency TypeScript libraries on NPM including Base64, UUID, and validator suites.",
			link: "/packages/",
			icon: Layers
		},
		{
			title: "Guides & Blog",
			desc: "Read detailed integration tutorials, how-to documents, and conversion workflow breakdowns.",
			link: "/blog/",
			icon: BookOpen
		},
		{
			title: "XML Sitemap",
			desc: "Direct access to the complete XML sitemap directory listing all 1,200+ online utilities.",
			link: "/sitemap.xml",
			icon: FileText,
			external: true
		},
		{
			title: "RSS Feed",
			desc: "Subscribe to our content feed to stay updated with new developer utility releases and articles.",
			link: "/feed.xml",
			icon: Rss,
			external: true
		}
	];

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(resourcesSchema),
				}}
			/>
			<main className="flex-grow">
				{/* Top Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-16 md:py-24 border-b border-border/10">
					<div className="container mx-auto max-w-5xl px-4 text-center">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 max-w-3xl mx-auto space-y-4">
							<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded">
								Resources
							</span>
							<h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
								Developer Resources Hub
							</h1>
							<p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
								Access cheat sheets, documentation, API specifications, and site syndication to make the most of SopKit tools.
							</p>
						</div>
					</div>
				</section>

				{/* Resource Links Grid */}
				<section className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
					<div className="grid md:grid-cols-2 gap-6">
						{resourceCards.map((card, idx) => {
							const Icon = card.icon;
							const isExternal = card.external;
							return (
								<div key={idx} className="p-6 md:p-8 rounded-3xl border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm space-y-4 hover:border-primary/20 hover:bg-card/30 transition-all duration-200 flex flex-col justify-between">
									<div className="space-y-3">
										<div className="inline-flex p-3 bg-primary/5 rounded-2xl text-primary">
											<Icon className="h-6 w-6" />
										</div>
										<h2 className="text-xl font-bold">{card.title}</h2>
										<p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
									</div>

									{isExternal ? (
										<a
											href={card.link}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
										>
											Access Resource
											<ArrowRight className="h-3 w-3" />
										</a>
									) : (
										<Link
											href={card.link}
											className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
										>
											Access Resource
											<ArrowRight className="h-3 w-3" />
										</Link>
									)}
								</div>
							);
						})}
					</div>
				</section>
			</main>
		</div>
	);
}
