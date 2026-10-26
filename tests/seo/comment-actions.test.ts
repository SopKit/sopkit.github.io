import { describe, it, expect } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { findCommentActionIssues } from "../../scripts/validate-comment-actions";

// The comment section renders on every tool page through ToolSEOLayout,
// so a defect here is site-wide. Before the guard existed it shipped:
// a hardcoded 4.8/5 average rating over an empty comment list (while
// the schema layer deliberately emits no aggregateRating without
// genuine reviews), a Report button with no handler and no reporting
// backend, a Share button with no handler, a reply flow that only
// logged to the console, a Load More button with no pagination behind
// it, and an unused CommentsWidget whose only button did nothing.
// The prebuild script scripts/validate-comment-actions.ts enforces
// the same invariant on the parsed AST; these tests pin it through
// that same function plus the specific repairs, so none of them can
// come back without tripping a test.

const rootDir = path.resolve(import.meta.dir, "../..");

function readSource(relative: string): string {
	return fs.readFileSync(path.join(rootDir, relative), "utf8");
}

describe("Comment actions do something and claim only what is true", () => {
	it("every Button in UserComments.tsx carries an onClick", () => {
		const result = findCommentActionIssues(rootDir);
		// Guard against a vacuous pass: the section has eight wired
		// buttons (like, reply, share, post/cancel reply, post/cancel
		// comment, open comment form), so a zero here would mean the
		// walk itself broke, not that the tree is clean.
		expect(result.checked).toBeGreaterThanOrEqual(8);
		expect(result.violations).toEqual([]);
	});

	it("the invented rating, dead actions and void reply are gone", () => {
		const source = readSource("src/components/seo/UserComments.tsx");
		expect(source).not.toContain("4.8/5");
		expect(source).not.toContain("Report comment");
		expect(source).not.toContain("Load More");
		expect(source).not.toContain("View All Reviews");
		expect(source).not.toContain("CommentsWidget");
		expect(source).not.toContain("console.log");
	});

	it("the header rating is computed from rated comments, not fixed", () => {
		const source = readSource("src/components/seo/UserComments.tsx");
		expect(source).toContain("No ratings yet");
		expect(source).toContain("avg rating");
		expect(source).toContain("ratedComments");
	});

	it("share uses the native sheet with a clipboard fallback", () => {
		const source = readSource("src/components/seo/UserComments.tsx");
		expect(source).toContain("navigator.share");
		expect(source).toContain("navigator.clipboard.writeText");
		expect(source).toContain("AbortError");
		expect(source).toContain("Link copied");
	});

	it("replies are stored and rendered nested, not logged away", () => {
		const source = readSource("src/components/seo/UserComments.tsx");
		// New comments carry a reply list, and CommentItem renders it
		// recursively with a depth cap.
		expect(source).toContain("replies: []");
		expect(source).toContain("depth + 1");
		expect(source).toContain("depth < 3");
	});

	it("the removed widget stays removed from the seo barrel", () => {
		const index = readSource("src/components/seo/index.tsx");
		expect(index).not.toContain("CommentsWidget");
		expect(index).toContain('default as UserComments');
	});

	it("comments disclose that they are session-local only", () => {
		const source = readSource("src/components/seo/UserComments.tsx");
		expect(source).toContain("not saved or published");
	});
});
