import { blogs, type BlogArticle } from "@/constants/blog-data";

export function getSortedBlogs() {
	return [...blogs].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

export function getRelatedBlogArticles(article: BlogArticle, limit = 4) {
	const sourceRoutes = new Set(article.featuredToolRoutes || []);

	return getSortedBlogs()
		.filter((candidate) => candidate.slug !== article.slug)
		.map((candidate) => {
			const sharedRoutes = (candidate.featuredToolRoutes || []).filter((route) =>
				sourceRoutes.has(route)
			).length;
			const sourceTerms = new Set(
				article.slug.split("-").filter((term) => term.length > 3)
			);
			const termOverlap = candidate.slug
				.split("-")
				.filter((term) => sourceTerms.has(term)).length;

			return {
				article: candidate,
				score: sharedRoutes * 100 + termOverlap * 10,
			};
		})
		.sort(
			(a, b) =>
				b.score - a.score ||
				new Date(b.article.date).getTime() - new Date(a.article.date).getTime()
		)
		.slice(0, limit)
		.map(({ article: related }) => related);
}

export function getAdjacentBlogArticles(slug: string) {
	const sorted = getSortedBlogs();
	const index = sorted.findIndex((article) => article.slug === slug);

	if (index === -1) {
		return { previous: undefined, next: undefined };
	}

	return {
		previous: sorted[index + 1],
		next: sorted[index - 1],
	};
}
