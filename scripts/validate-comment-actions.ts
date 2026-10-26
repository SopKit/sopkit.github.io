// Validates that the comment section on every tool page only claims what
// is true and that every comment action actually does something:
//
//   - Every <Button> in src/components/seo/UserComments.tsx must carry
//     an onClick. A button without one renders, looks clickable, and
//     does nothing when clicked — the exact defect this file shipped
//     three times over (Report, Share, Load More), plus a fourth in
//     the unused CommentsWidget (View All Reviews).
//   - The removed defects must not come back as literal strings:
//     a hardcoded aggregate rating, the Report button's label, the
//     Load More / View All Reviews labels, the deleted CommentsWidget
//     name, and the console.log that used to be the entire reply
//     implementation.
//   - src/components/seo/index.tsx must not re-export CommentsWidget:
//     the widget was unused anywhere in src, rendered an empty card
//     from empty data, and its only action was handlerless.
//
// Why the TypeScript compiler API, not regex: the onClick check must
// see real JSX elements, not text that merely looks like a tag inside
// a string or comment. Parsing the AST is the same approach as
// scripts/validate-icon-button-labels.ts, and TypeScript is already
// a direct devDependency, so this adds nothing to the prebuild chain.
//
// Why this exists: UserComments renders on every tool page through
// ToolSEOLayout, so a defect here is site-wide. Before this guard,
// the section advertised a fixed 4.8/5 average rating over an empty
// comment list (while the schema layer deliberately emits no
// aggregateRating without genuine reviews), a Report button with no
// handler and no reporting backend, a Share button with no handler,
// a reply flow that only logged to the console, a Load More button
// with no pagination behind it, and an unused widget whose only
// button did nothing. The fixes: the rating is computed from rated
// comments or shown as "No ratings yet"; Report, Load More and the
// widget are removed rather than faked; Share uses the native share
// sheet with a clipboard fallback; replies are stored and rendered
// nested. A real report flow needs a backend decision first and is
// deliberately not faked here.
//
// Scope limits, stated plainly:
//   - Only this one file's Buttons are checked. A handler proves a
//     button is wired, not that the handler is correct; share/reply
//     behaviour is pinned by source-string tests in
//     tests/seo/comment-actions.test.ts and by typecheck, not by a
//     DOM test — the repo has no DOM harness for client components.
//   - The string bans are literal: a future comment mentioning one
//     of the banned phrases (even to explain it) trips the guard and
//     must be reworded, which is the intended friction.
//
// Run: bun run validate:comment-actions (also wired into `prebuild`,
// after validate-icon-button-labels and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export interface CommentActionResult {
	checked: number;
	violations: string[];
}

// Literal strings whose return means a removed defect came back. Kept
// separate from the AST check so a reworded comment cannot smuggle
// one past: these are checked against the raw file text.
const BANNED_STRINGS = [
	"4.8/5",
	"Report comment",
	"Load More",
	"View All Reviews",
	"CommentsWidget",
	"console.log",
];

function tagNameOf(node: ts.Node): string | null {
	if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
		const tag = node.tagName;
		if (ts.isIdentifier(tag)) {
			return tag.text;
		}
	}
	return null;
}

function hasOnClick(node: ts.Node, sourceFile: ts.SourceFile): boolean {
	const attributes = ts.isJsxOpeningElement(node)
		? node.attributes.properties
		: ts.isJsxSelfClosingElement(node)
			? node.attributes.properties
			: [];
	return attributes.some(
		(prop) =>
			// JsxAttributeName can be a namespaced name, so read the
			// name through getText rather than .text (the same trap
			// the icon-label validator hit: a namespaced name has no
			// .text property and typecheck fails).
			ts.isJsxAttribute(prop) && prop.name.getText(sourceFile) === "onClick",
	);
}

export function findCommentActionIssues(root: string): CommentActionResult {
	const violations: string[] = [];
	let checked = 0;

	const commentsPath = path.join(
		root,
		"src/components/seo/UserComments.tsx",
	);
	const sourceText = fs.readFileSync(commentsPath, "utf8");
	const sourceFile = ts.createSourceFile(
		commentsPath,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
	);

	const visit = (node: ts.Node): void => {
		const tag = tagNameOf(node);
		if (tag === "Button") {
			checked += 1;
			if (!hasOnClick(node, sourceFile)) {
				const { line } = sourceFile.getLineAndCharacterOfPosition(
					node.getStart(sourceFile),
				);
				violations.push(
					`src/components/seo/UserComments.tsx:${line + 1} <Button> without onClick (renders but does nothing when clicked)`,
				);
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sourceFile);

	for (const banned of BANNED_STRINGS) {
		if (sourceText.includes(banned)) {
			violations.push(
				`src/components/seo/UserComments.tsx contains removed defect string ${JSON.stringify(banned)}`,
			);
		}
	}

	const indexPath = path.join(root, "src/components/seo/index.tsx");
	const indexText = fs.readFileSync(indexPath, "utf8");
	if (indexText.includes("CommentsWidget")) {
		violations.push(
			"src/components/seo/index.tsx still exports CommentsWidget (removed widget must stay removed)",
		);
	}

	return { checked, violations };
}

function fail(message: string): never {
	console.error(`❌ ${message}`);
	process.exit(1);
}

const invokedAsScript =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
	const result = findCommentActionIssues(rootDir);
	if (result.violations.length > 0) {
		console.error(
			`❌ validate-comment-actions: ${result.violations.length} comment action issue(s) (checked ${result.checked} Buttons):`,
		);
		for (const violation of result.violations) {
			console.error(`  - ${violation}`);
		}
		process.exit(1);
	}
	console.log(
		`✅ validate-comment-actions: all ${result.checked} Buttons in UserComments.tsx carry an onClick, no removed defect strings present.`,
	);
}
