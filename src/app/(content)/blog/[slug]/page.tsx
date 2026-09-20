import { SITE_URL } from "@/constants/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogArticleBySlug } from "@/constants/blog-data";
import { getToolByRoute } from "@/lib/tools";
import { getRelatedBlogArticles, getAdjacentBlogArticles, getSortedBlogs } from "@/lib/blog";
import AdPlacement from "@/components/ads/AdPlacement";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Suspense } from "react";
import { Calendar, Clock, ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { formatSeoTitle } from "@/seo/metadata";

interface BlogArticlePageProps {
	params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
	return getSortedBlogs()
		.slice(0, 50)
		.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps) {
	const { slug } = await params;
	const article = getBlogArticleBySlug(slug);

	if (!article) {
		return {
			title: "Blog Article Not Found | SopKit",
			description: "The requested article was not found.",
			robots: { index: false, follow: false },
		};
	}

	const canonical = `${SITE_URL}/blog/${article.slug}/`;
	const seoTitle = formatSeoTitle(article.title);

	return {
		title: seoTitle,
		description: article.description,
		keywords: [
			article.slug.split("-").join(" "),
			"free online tools",
			"SopKit blog",
			"how to guide",
		].join(", "),
		alternates: { canonical },
		openGraph: {
			title: article.title,
			description: article.description,
			url: canonical,
			type: "article",
			publishedTime: article.date,
			modifiedTime: article.date,
			images: [{ url: "/og-image.jpg" }],
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: article.description,
			images: ["/og-image.jpg"],
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

	const relatedArticles = getRelatedBlogArticles(article, 4);
	const { previous, next } = getAdjacentBlogArticles(article.slug);

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
			url: SITE_URL,
		},
		publisher: {
			"@type": "Organization",
			name: "SopKit",
			url: SITE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}/icons/icon-512x512.png`,
			},
		},
		mainEntityOfPage: `${SITE_URL}/blog/${article.slug}/`,
		image: `${SITE_URL}/og-image.jpg`,
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: `${SITE_URL}/`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: `${SITE_URL}/blog/`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: article.title,
				item: `${SITE_URL}/blog/${article.slug}/`,
			},
		],
	};

	const faqSchema = article.faqs && article.faqs.length > 0
		? {
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: article.faqs.map((faq) => ({
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
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
			{faqSchema && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
			)}

			<main className="flex-1">
				<article className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
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

					<header className="space-y-4">
						<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
							Technical Guide
						</span>
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
							{article.title}
						</h1>
						<p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
							{article.description}
						</p>
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
						<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
							<span>Written by SopKit Editorial Team</span>
							<span>&bull;</span>
							<Link href="/editorial-policy" className="text-primary hover:underline underline-offset-2">Editorial policy</Link>
						</div>
					</header>

					<div className="mt-8 rounded-xl border border-border/40 bg-muted/10 px-4 py-3">
						<p className="text-xs leading-5 text-muted-foreground">
							Guides are maintained as practical technical references. Requirements or third-party behavior that can change over time should be verified against the relevant official source.
						</p>
					</div>

					<div className="mt-5 border-l-2 border-primary/20 pl-4 py-1.5">
						<p className="text-base sm:text-lg leading-relaxed text-muted-foreground italic font-normal">
							{article.intro || article.description}
						</p>
					</div>

					<div className="mt-8 max-w-full">
						<AdPlacement placement="after-hero" pageType="blog" />
					</div>

					<div className="mt-12 space-y-12">
						{(article.sections || []).map((section) => {
							const sectionTools = (section.toolRoutes || [])
								.map((route) => getToolByRoute(route))
								.filter(Boolean);

							return (
								<section key={section.heading} className="space-y-4">
									<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8">
										{section.heading}
									</h2>
									<div className="space-y-4">
										{(section.paragraphs || []).map((paragraph) => {
											const hasDefinition =
												paragraph.includes(":") &&
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
											{sectionTools.map((tool) => (
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

					{(article.faqs || []).length > 0 && (
						<section className="mt-16 border-t border-border/20 pt-12">
							<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
								Frequently Asked Questions
							</h2>
							<div className="space-y-6">
								{(article.faqs || []).map((faq) => (
									<div key={faq.question} className="bg-card/40 border border-border/40 p-5 rounded-2xl">
										<h3 className="text-base font-bold text-foreground leading-snug">{faq.question}</h3>
										<p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.answer}</p>
									</div>
								))}
							</div>
						</section>
					)}

					{relatedArticles.length > 0 && (
						<section className="mt-16 border-t border-border/20 pt-12">
							<div className="flex items-end justify-between gap-4 mb-6">
								<div>
									<p className="text-[10px] font-bold uppercase tracking-widest text-primary">Continue reading</p>
									<h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight">Related guides</h2>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{relatedArticles.map((related) => (
									<Link
										key={related.slug}
										href={`/blog/${related.slug}`}
										className="group p-5 rounded-2xl border border-border/40 hover:border-primary/30 bg-card/20 hover:bg-card/60 transition-all duration-200"
									>
										<p className="font-bold text-foreground group-hover:text-primary transition-colors">{related.title}</p>
										<p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{related.description}</p>
										<div className="mt-4 flex items-center text-xs font-bold text-primary gap-1">
											Read guide <ArrowRight className="h-3 w-3" />
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{featuredTools.length > 0 && (
						<section className="mt-16 border-t border-border/20 pt-12">
							<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
								Recommended Tools
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{featuredTools.map((tool) => (
									<Link
										key={tool!.route}
										href={tool!.route}
										className="group p-5 rounded-2xl border border-border/40 hover:border-primary/30 bg-card/20 hover:bg-card/60 transition-all duration-200 flex flex-col justify-between"
									>
										<div>
											<p className="font-bold text-foreground group-hover:text-primary transition-colors">{tool!.name}</p>
											<p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{tool!.description}</p>
										</div>
										<div className="mt-4 flex items-center text-xs font-bold text-primary gap-1">
											Open tool <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
										</div>
									</Link>
								))}
							</div>
						</section>
					)}

					{(previous || next) && (
						<nav className="mt-16 border-t border-border/20 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Article navigation">
							{previous ? (
								<Link href={`/blog/${previous.slug}`} className="group rounded-2xl border border-border/40 p-5 hover:border-primary/30 transition-colors">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Older article</span>
									<p className="mt-2 font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{previous.title}</p>
								</Link>
							) : <div />}
							{next && (
								<Link href={`/blog/${next.slug}`} className="group rounded-2xl border border-border/40 p-5 hover:border-primary/30 transition-colors sm:text-right">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Newer article</span>
									<p className="mt-2 font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{next.title}</p>
								</Link>
							)}
						</nav>
					)}

					<div className="mt-12 max-w-full">
						<AdPlacement placement="footer" pageType="blog" />
					</div>
				</article>
			</main>
		</div>
	);
}
