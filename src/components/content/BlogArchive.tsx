import { SITE_URL } from "@/constants/config";
import Link from "next/link";
import { getSortedBlogs } from "@/lib/blog";
import BreadcrumbsEnhanced from "@/components/seo/BreadcrumbsEnhanced";
import { Fragment, Suspense } from "react";
import { Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export function getBlogArchiveMeta(requestedPage: number) {
  const totalArticles = getSortedBlogs().length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  return {
    totalArticles,
    totalPages,
    currentPage,
    canonical:
      currentPage === 1
        ? `${SITE_URL}/blog/`
        : `${SITE_URL}/blog/page/${currentPage}/`,
  };
}

export default function BlogArchive({ currentPage }: { currentPage: number }) {
	const sortedArticles = getSortedBlogs();
	const totalArticles = sortedArticles.length;
	const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));
	const page = Math.min(Math.max(currentPage, 1), totalPages);
	const startIndex = (page - 1) * PAGE_SIZE;
	const pageArticles = sortedArticles.slice(startIndex, startIndex + PAGE_SIZE);
	const pageUrl = page === 1 ? `${SITE_URL}/blog/` : `${SITE_URL}/blog/page/${page}/`;

	const featuredGuides = [
		{ slug: "best-free-tools-for-students", label: "Students Guide" },
		{ slug: "tools-for-developers", label: "Developer Guide" },
		{ slug: "seo-tools-free-online", label: "SEO Guide" },
		{ slug: "ai-tools-alternatives-free", label: "AI Alternatives" },
	];

	const blogSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: page === 1
			? "SopKit Blog & Guides"
			: `SopKit Blog & Guides — Page ${page}`,
		description:
			"Actionable guides, tutorials, comparisons, and workflows for online utilities, developers, SEO, PDFs, images, and productivity.",
		url: pageUrl,
		mainEntity: {
			"@type": "ItemList",
			itemListElement: pageArticles.map((article, i) => ({
				"@type": "ListItem",
				position: startIndex + i + 1,
				name: article.title,
				url: `${SITE_URL}/blog/${article.slug}/`,
			})),
		},
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
			{ "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
			...(page > 1
				? [{ "@type": "ListItem", position: 3, name: `Page ${page}`, item: pageUrl }]
				: []),
		],
	};

	const getPageHref = (targetPage: number) => targetPage === 1 ? "/blog/" : `/blog/page/${targetPage}/`;
	const pageNumbers = Array.from(
		new Set([1, page - 1, page, page + 1, totalPages].filter(
			(page) => page >= 1 && page <= totalPages
		))
	).sort((a, b) => a - b);

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

			<main className="flex-grow">
				<section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent py-12 md:py-20 border-b border-border/10">
					<div className="container mx-auto max-w-6xl px-4">
						<Suspense fallback={null}>
							<BreadcrumbsEnhanced suppressSchema={true} />
						</Suspense>

						<div className="mt-8 max-w-3xl">
							<span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
								SopKit Content Library
							</span>
							<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">
								Guides & tutorials for browser utilities.
							</h1>
							<p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
								Step-by-step documentation, practical comparisons, and workflow guides for engineering, SEO, documents, images, and everyday digital tasks.
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

				<section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
						<div>
							<p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content archive</p>
							<h2 className="mt-1 text-2xl font-bold tracking-tight">
								{totalArticles} guides, tutorials, and explainers
							</h2>
						</div>
						<p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {PAGE_SIZE} per page</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{pageArticles.map((article) => (
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

					{totalPages > 1 && (
						<nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Blog pagination">
							{page > 1 ? (
								<Link
									href={getPageHref(page - 1)}
									className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
									aria-label="Previous blog page"
								>
									<ChevronLeft className="h-3.5 w-3.5" />
									Previous
								</Link>
							) : (
								<span className="inline-flex h-9 items-center gap-1 rounded-full border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40">
									<ChevronLeft className="h-3.5 w-3.5" />
									Previous
								</span>
							)}

							{pageNumbers.map((number, index) => {
								const previous = pageNumbers[index - 1];
								const hasGap = previous !== undefined && number - previous > 1;
								return (
									<Fragment key={number}>
										{hasGap && <span className="px-1 text-xs text-muted-foreground">…</span>}
										<Link
											href={getPageHref(number)}
											aria-current={number === page ? "page" : undefined}
											className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-bold transition-colors ${
												page === page
													? "border-primary bg-primary text-primary-foreground"
													: "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
											}`}
										>
											{number}
										</Link>
									</Fragment>
								);
							})}

							{page < totalPages ? (
								<Link
									href={getPageHref(page + 1)}
									className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
									aria-label="Next blog page"
								>
									Next
									<ChevronRight className="h-3.5 w-3.5" />
								</Link>
							) : (
								<span className="inline-flex h-9 items-center gap-1 rounded-full border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40">
									Next
									<ChevronRight className="h-3.5 w-3.5" />
								</span>
							)}
						</nav>
					)}
				</section>
			</main>
		</div>
	);
}
