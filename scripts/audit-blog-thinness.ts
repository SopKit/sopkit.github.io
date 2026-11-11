// Audits every blog article in src/constants/blog-data.ts for thin content.
//
// The word count covers the body a reader actually sees on the article page:
// the intro, every section heading and paragraph, and every FAQ question and
// answer. Title and meta description are excluded because they are not body
// copy. Articles under THIN_WORD_THRESHOLD words are flagged; the lead's
// policy is to retire such posts (redirecting to the tool they promote)
// rather than pad them with generated text.
//
// Output: one line per article, sorted by word count ascending, with the
// slug, the word count, the first featured tool route (or "-" when the
// article has none) and a THIN marker when the count is under the threshold.
// Pass --json to get the same rows as a JSON array for other scripts.
//
// Run: bun run audit:blog

import { blogs, type BlogArticle } from "../src/constants/blog-data";

export const THIN_WORD_THRESHOLD = 180;

export interface BlogThinnessRow {
  slug: string;
  words: number;
  firstFeaturedRoute: string | null;
  thin: boolean;
}

function countWords(text: string | undefined): number {
  if (!text) return 0;
  return text.split(/\s+/).filter((token) => token.length > 0).length;
}

export function countArticleWords(article: BlogArticle): number {
  const introWords = countWords(article.intro);
  const sectionWords = (article.sections || []).reduce(
    (total, section) =>
      total +
      countWords(section.heading) +
      section.paragraphs.reduce((sum, paragraph) => sum + countWords(paragraph), 0),
    0,
  );
  const faqWords = (article.faqs || []).reduce(
    (total, faq) => total + countWords(faq.question) + countWords(faq.answer),
    0,
  );
  return introWords + sectionWords + faqWords;
}

export function auditBlogThinness(articles: readonly BlogArticle[] = blogs): BlogThinnessRow[] {
  return articles
    .map((article) => {
      const words = countArticleWords(article);
      return {
        slug: article.slug,
        words,
        firstFeaturedRoute: article.featuredToolRoutes?.[0] ?? null,
        thin: words < THIN_WORD_THRESHOLD,
      };
    })
    .sort((a, b) => a.words - b.words || a.slug.localeCompare(b.slug));
}

function main(): void {
  const rows = auditBlogThinness();

  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    return;
  }

  const slugWidth = Math.max(...rows.map((row) => row.slug.length));
  for (const row of rows) {
    const marker = row.thin ? "THIN" : "";
    const route = row.firstFeaturedRoute ?? "-";
    process.stdout.write(
      `${row.slug.padEnd(slugWidth)}  ${String(row.words).padStart(5)}  ${route.padEnd(44)}  ${marker}\n`,
    );
  }

  const thinCount = rows.filter((row) => row.thin).length;
  process.stdout.write(
    `\n${rows.length} articles, ${thinCount} under ${THIN_WORD_THRESHOLD} words.\n`,
  );
}

const invokedDirectly =
  typeof process.argv[1] === "string" &&
  /audit-blog-thinness\.(ts|js|mjs|cjs)$/.test(process.argv[1]);

if (invokedDirectly) {
  main();
}
