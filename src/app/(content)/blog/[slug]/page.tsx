import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs, getBlogArticleBySlug } from "@/constants/blog-data";
import { getToolByRoute } from "@/lib/tools";
import AdPlacement from "@/components/ads/AdPlacement";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";
import { Calendar, Clock, ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";

interface BlogArticlePageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return blogs.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
	const { slug } = await params;
	const article = getBlogArticleBySlug(slug);

	if (!article) {
		return {
			title: "Blog Article Not Found | SopKit",
			description: "The requested article was not found.",
		};
	}

	return {
		title: `${article.title} | SopKit`,
		description: article.description,
		keywords: [
			article.slug.split("-").join(" "),
			"free online tools",
			"SopKit blog",
		].join(", "),
		alternates: {
			canonical: `https://sopkit.github.io/blog/${article.slug}/`,
		},
		openGraph: {
			title: article.title,
			description: article.description,
			url: `https://sopkit.github.io/blog/${article.slug}/`,
			type: "article",
			images: [{ url: "/og-image.jpg" }],
		},
		robots: { index: true, follow: true },
	};
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
	const { slug } = await params;
	const article = getBlogArticleBySlug(slug);

	if (!article) return notFound();

	const featuredTools = (article.featuredToolRoutes || [])
		.map((route) => getToolByRoute(route))
		.filter(Boolean);

	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		datePublished: article.date,
		dateModified: article.date,
		author: {
			"@type": "Organization",
			name: "SopKit",
			url: "https://sopkit.github.io",
		},
		publisher: {
			"@type": "Organization",
			name: "SopKit",
			url: "https://sopkit.github.io",
			logo: {
				"@type": "ImageObject",
				url: "https://sopkit.github.io/icons/icon-512x512.png/",
			},
		},
		mainEntityOfPage: `https://sopkit.github.io/blog/${article.slug}`,
		image: "https://sopkit.github.io/og-image.jpg",
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
			{
				"@type": "ListItem",
				position: 3,
				name: article.title,
				item: `https://sopkit.github.io/blog/${article.slug}/`,
			},
		],
	};

	const faqSchema = article.faqs && article.faqs.length > 0
		? {
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: article.faqs.map((faq: any) => ({
					"@type": "Question",
					name: faq.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: faq.answer,
					},
				})),
		  }
		: null;

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema),
				}}
			/>
			{faqSchema && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(faqSchema),
					}}
				/>
			)}

			<main className="flex-1">
				<article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
					{/* Breadcrumbs & Back Link */}
					<div className="flex flex-col gap-6 border-b border-border/10 pb-6 mb-8">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>
						<Link
							href="/blog"
							className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
						>
							<ArrowLeft className="h-3.5 w-3.5" />
							Back to all guides
						</Link>
					</div>

					{/* Article Header */}
					<header className="space-y-4">
						<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
							Technical Guide
						</span>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
							{article.title}
						</h1>
						
						<div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/80 pt-2">
							<span className="flex items-center gap-1">
								<Calendar className="h-3.5 w-3.5" />
								{article.date}
							</span>
							<span>&bull;</span>
							<span className="flex items-center gap-1">
								<Clock className="h-3.5 w-3.5" />
								{article.readTimeMinutes || 5} min read
							</span>
						</div>
					</header>

					{/* Intro paragraph with blockquote style */}
					<div className="mt-8 border-l-2 border-primary/20 pl-4 py-1.5">
						<p className="text-base sm:text-lg leading-relaxed text-muted-foreground italic font-normal">
							{article.intro || article.description}
						</p>
					</div>

					<div className="mt-8 max-w-full">
						<AdPlacement placement="after-hero" pageType="blog" />
					</div>

					{/* Sections Content */}
					<div className="mt-12 space-y-12">
						{(article.sections || []).map((section: any) => {
							const sectionTools = (section.toolRoutes || [])
								.map((route: string) => getToolByRoute(route))
								.filter(Boolean);

							return (
								<section key={section.heading} className="space-y-4">
									<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8">
										{section.heading}
									</h2>
									<div className="space-y-4">
										{(section.paragraphs || []).map((paragraph: string) => {
											// Match "Term: Definition" glossary patterns, avoiding links
											const hasDefinition = paragraph.includes(":") && 
												paragraph.indexOf(":") < 45 && 
												!paragraph.startsWith("http") && 
												!paragraph.includes("://");
											if (hasDefinition) {
												const colonIdx = paragraph.indexOf(":");
												const term = paragraph.substring(0, colonIdx).trim();
												const definition = paragraph.substring(colonIdx + 1).trim();
												return (
													<dl key={paragraph} className="my-3 border-l-2 border-primary/20 pl-4 py-1.5 bg-muted/5">
														<dt className="font-bold text-foreground text-sm tracking-tight">{term}</dt>
														<dd className="text-muted-foreground text-xs mt-1 leading-relaxed">{definition}</dd>
													</dl>
												);
											}
											return (
												<p key={paragraph} className="text-base leading-relaxed text-muted-foreground/90">
													{paragraph}
												</p>
											);
										})}
									</div>

									{sectionTools.length > 0 && (
										<div className="mt-4 pt-2 flex flex-wrap gap-2">
											{sectionTools.map((tool: any) => (
												<Link
													key={tool!.route}
													href={tool!.route}
													className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200"
												>
													<LayoutGrid className="h-3.5 w-3.5" />
													<span>Use {tool!.name}</span>
												</Link>
											))}
										</div>
									)}
								</section>
							);
						})}
					</div>

					{/* FAQ Section */}
					{(article.faqs || []).length > 0 && (
						<section className="mt-16 border-t border-border/20 pt-12">
							<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
								Frequently Asked Questions
							</h2>
							
							<div className="space-y-6">
								{(article.faqs || []).map((faq: any) => (
									<div key={faq.question} className="bg-card/40 border border-border/40 p-5 rounded-2xl">
										<h3 className="text-base font-bold text-foreground leading-snug">
											{faq.question}
										</h3>
										<p className="text-sm text-muted-foreground mt-2 leading-relaxed">
											{faq.answer}
										</p>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Featured Tools Grid */}
					{featuredTools.length > 0 && (
						<section className="mt-16 border-t border-border/20 pt-12">
							<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
								Recommended Tools
							</h2>
							
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{featuredTools.map((tool: any) => (
									<Link
										key={tool!.route}
										href={tool!.route}
										className="group p-5 rounded-2xl border border-border/40 hover:border-primary/30 bg-card/20 hover:bg-card/60 transition-all duration-200 flex flex-col justify-between"
									>
										<div>
											<p className="font-bold text-foreground group-hover:text-primary transition-colors duration-200">
												{tool!.name}
											</p>
											<p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
												{tool!.description}
											</p>
										</div>
										<div className="mt-4 flex items-center text-xs font-bold text-primary gap-1">
											<span>Open tool</span>
											<ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
										</div>
									</Link>
								))}
							</div>

							<div className="mt-8 flex justify-center">
								<Link
									href="/blog"
									className="text-xs font-bold text-primary hover:underline underline-offset-4"
								>
									See all guides and articles
								</Link>
							</div>
						</section>
					)}

					<div className="mt-12 max-w-full">
						<AdPlacement placement="footer" pageType="blog" />
					</div>
				</article>
			</main>
		</div>
	);
}