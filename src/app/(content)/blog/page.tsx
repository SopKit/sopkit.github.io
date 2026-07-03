import Link from "next/link";
import { blogs } from "@/constants/blog-data";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";
import { Clock, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
	title: "Blog & Guides for Free Online Tools | SopKit",
	description: "Actionable guides, tool lists, and tutorials for SEO, developer workflows, and everyday online conversion tasks.",
	keywords: "SopKit blog, free online tools guides, seo tutorials, json guides, converter tutorials, no signup tools",
	alternates: {
		canonical: "https://sopkit.github.io/blog/",
	},
	openGraph: {
		title: "Blog & Guides for Free Online Tools | SopKit",
		description: "Read practical guides that link directly to free tools you can use instantly.",
		url: "https://sopkit.github.io/blog",
		type: "website",
		images: [{ url: "/og-image.jpg" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog & Guides for Free Online Tools | SopKit",
		description: "Read practical guides that link directly to free tools you can use instantly.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function BlogPage() {
	const sortedArticles = [...blogs].sort((a, b) =>
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	const featuredGuides = [
		{ slug: "best-free-tools-for-students", label: "Students Guide" },
		{ slug: "tools-for-developers", label: "Developer Guide" },
		{ slug: "seo-tools-free-online", label: "SEO Guide" },
		{ slug: "ai-tools-alternatives-free", label: "AI Alternatives" },
	];

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Blog & Guides for Free Online Tools",
		description: "Actionable guides, tool lists, and tutorials for SEO, developer workflows, and everyday online conversion tasks.",
		url: "https://sopkit.github.io/blog/",
		mainEntity: {
			"@type": "ItemList",
			itemListElement: sortedArticles.slice(0, 10).map((article, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: article.title,
				url: `https://sopkit.github.io/blog/${article.slug}/`,
			})),
		},
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://sopkit.github.io/",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: "https://sopkit.github.io/blog/",
			},
		],
	};

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(blogSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>

			<main className="flex-grow">
				{/* Top Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-12 md:py-20 border-b border-border/10">
					<div className="container mx-auto max-w-6xl px-4">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 max-w-3xl">
							<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
								SopKit Content Engine
							</span>
							<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">
								Guides & tutorials for browser utilities.
							</h1>
							<p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
								Step-by-step documentation, comparative analysis, and quick workflows to help you solve everyday engineering, conversion, and optimization tasks locally.
							</p>

							<div className="mt-8 flex flex-wrap gap-2">
								{featuredGuides.map((guide) => (
									<Link
										key={guide.slug}
										href={`/${guide.slug}`}
										className="rounded-full border border-border hover:border-primary/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/[0.02] transition-all duration-200"
									>
										{guide.label}
									</Link>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Blog Cards List */}
				<section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{sortedArticles.map((article) => (
							<Link
								key={article.slug}
								href={`/blog/${article.slug}`}
								className="group flex flex-col justify-between p-6 rounded-2xl border border-border/40 hover:border-primary/30 bg-card/30 hover:bg-card/70 transition-all duration-300 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]"
							>
								<div>
									<div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground/80">
										<span className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											{article.date}
										</span>
										<span>&bull;</span>
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{article.readTimeMinutes || 5} min read
										</span>
									</div>

									<h2 className="mt-3 text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
										{article.title}
									</h2>
									<p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
										{article.description}
									</p>
								</div>

								<div className="mt-6 flex items-center text-xs font-bold text-primary gap-1 group-hover:gap-2 transition-all duration-200">
									<span>Read guide</span>
									<ArrowRight className="h-3.5 w-3.5 transition-transform" />
								</div>
							</Link>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
