// Validates that every new-tab opener in the site severs the opener
// reference, so an opened page cannot reach back into the SopKit tab:
//
//   - Every `window.open(url, "_blank")` call must pass a features
//     string containing `noopener` (the repo convention is
//     `"noopener,noreferrer"`, matching LoveCalculator, URLExtractor
//     and the other calls that already had it). Without it, the opened
//     page keeps `window.opener` access and can redirect the SopKit
//     tab — the reverse-tabnabbing hole. This mattered most for the
//     downloader tools (the opened URL is a third-party media URL) and
//     for UrlParserTool (the opened URL is user-supplied), but the
//     rule is applied to every call, not just those two.
//   - Every JSX `<a>` / `<Link target="_blank">` must carry a `rel`
//     containing `noopener` or `noreferrer` (`noreferrer` implies
//     `noopener` in modern browsers, so the repo's many
//     `rel="noreferrer"` anchors already pass). Anchors were already
//     clean when this guard landed (39/39); they are pinned here so a
//     future anchor cannot regress silently.
//
// Why the TypeScript compiler API, not regex: a `window.open` check
// must see real calls, not text that merely mentions one. Regex
// over the same tree false-positives on the ConstructionCalculator
// comment ("window openings") and on the HtmlExtractorTool code
// sample (an escaped `<a target="_blank">` inside a string, not a
// rendered anchor), and it cannot tell a multi-line call's features
// argument from the next statement. Parsing the AST is the same
// approach as scripts/validate-icon-button-labels.ts and
// scripts/validate-comment-actions.ts, and TypeScript is already a
// direct devDependency, so this adds nothing to the prebuild chain.
//
// Scope limits, stated plainly:
//   - Only literal `"_blank"` targets are flagged: all 82 current
//     `window.open` calls use a literal target, and a dynamic target
//     cannot be proven to open a new tab, so it is unknown and not
//     flagged (the same unknown-means-not-flagged rule the icon-label
//     validator uses for interpolated labels).
//   - Only literal features strings are checked: a call whose third
//     argument is an identifier is unknown and not flagged. A missing
//     third argument IS flagged — `window.open(url, "_blank")` with
//     no features is exactly the defect this guard exists to catch.
//   - JSX `rel` given as an expression (`rel={...}`) is unknown and
//     not flagged; a missing `rel` on a literal `_blank` anchor IS
//     flagged. A `rel` string literal must contain `noopener` or
//     `noreferrer`.
//   - This guard proves the opener is severed, not that the opened
//     URL is safe or correct; URL safety is a separate concern
//     (safeFetch/SSRF guards cover server fetches, and downloader
//     URLs come from the tool's own lookup, not from this guard).
//
// Run: bun run validate:window-opener (also wired into `prebuild`,
// after validate-site-urls and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export interface WindowOpenerResult {
	checkedCalls: number;
	checkedAnchors: number;
	violations: string[];
}

function collectFiles(dir: string, out: string[]): void {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === "node_modules") continue;
			collectFiles(full, out);
		} else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
			out.push(full);
		}
	}
}

function location(sf: ts.SourceFile, node: ts.Node): string {
	const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
	return `${line + 1}`;
}

/** Check one parsed source file; exported for the bun test's synthetic cases. */
export function checkWindowOpenerSource(
	sourceText: string,
	fileName: string,
): { calls: number; anchors: number; violations: string[] } {
	const sf = ts.createSourceFile(
		fileName,
		sourceText,
		ts.ScriptTarget.Latest,
		true,
	);
	const violations: string[] = [];
	let calls = 0;
	let anchors = 0;

	const visit = (node: ts.Node): void => {
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			node.expression.name.text === "open" &&
			node.expression.expression.getText(sf) === "window"
		) {
			const args = [...node.arguments];
			const target = args[1];
			if (target && ts.isStringLiteral(target) && target.text === "_blank") {
				calls += 1;
				const features = args[2];
				if (
					!features ||
					!ts.isStringLiteral(features) ||
					!features.text.includes("noopener")
				) {
					violations.push(
						`${fileName}:${location(sf, node)}: window.open with target "_blank" lacks a features string containing "noopener"`,
					);
				}
			}
			// Non-literal targets and non-literal features are
			// unknown, not violations (see header scope limits).
		}

		if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
			const tag = node.tagName.getText(sf);
			if (tag === "a" || tag === "Link") {
				let targetIsBlank = false;
				let relText: string | null = null;
				let relIsLiteral = false;
				for (const attr of node.attributes.properties) {
					if (!ts.isJsxAttribute(attr)) continue;
					const name = attr.name.getText(sf);
					if (name === "target" && attr.initializer) {
						const text = attr.initializer.getText(sf);
						if (text.includes("_blank")) targetIsBlank = true;
					}
					if (name === "rel" && attr.initializer) {
						if (ts.isStringLiteral(attr.initializer)) {
							relText = attr.initializer.text;
							relIsLiteral = true;
						} else if (ts.isJsxExpression(attr.initializer)) {
							// rel={...}: unknown, not a violation.
							relText = null;
							relIsLiteral = false;
						}
					}
				}
				if (targetIsBlank) {
					anchors += 1;
					if (
						relIsLiteral &&
						(relText === null ||
							(!relText.includes("noopener") &&
								!relText.includes("noreferrer")))
					) {
						violations.push(
							`${fileName}:${location(sf, node)}: <${tag}> with target "_blank" lacks rel="noopener" (or "noreferrer")`,
						);
					}
					if (!relIsLiteral && relText === null) {
						// Missing rel entirely (relIsLiteral false and
						// no expression either) is a violation; an
						// expression rel is unknown and skipped. The
						// two cases are distinguished by whether a
						// rel attribute exists at all.
						const hasRel = node.attributes.properties.some(
							(prop) =>
								ts.isJsxAttribute(prop) &&
								prop.name.getText(sf) === "rel",
						);
						if (!hasRel) {
							violations.push(
								`${fileName}:${location(sf, node)}: <${tag}> with target "_blank" has no rel attribute`,
							);
						}
					}
				}
			}
		}

		ts.forEachChild(node, visit);
	};
	visit(sf);

	return { calls, anchors, violations };
}

export function findWindowOpenerIssues(root: string): WindowOpenerResult {
	const srcDir = path.join(root, "src");
	const files: string[] = [];
	collectFiles(srcDir, files);
	let checkedCalls = 0;
	let checkedAnchors = 0;
	const violations: string[] = [];
	for (const file of files) {
		const sourceText = fs.readFileSync(file, "utf8");
		// Cheap pre-filter, correctness-preserving: a file whose raw
		// text contains neither "window.open" nor a "target" attribute
		// cannot contain a window.open call or a target="_blank"
		// anchor, so parsing its AST cannot add a violation. This
		// keeps the full-tree scan fast (most of src/ is data and
		// server code that never opens a tab); checkWindowOpenerSource
		// itself always parses, so synthetic and per-file checks are
		// unaffected.
		if (!sourceText.includes("window.open") && !sourceText.includes("target")) {
			continue;
		}
		const result = checkWindowOpenerSource(sourceText, path.relative(root, file));
		checkedCalls += result.calls;
		checkedAnchors += result.anchors;
		violations.push(...result.violations);
	}
	return { checkedCalls, checkedAnchors, violations };
}

const invokedAsScript =
	process.argv[1] !== undefined &&
	path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
	const result = findWindowOpenerIssues(rootDir);
	if (result.violations.length > 0) {
		console.error(
			`validate-window-opener: FAILED with ${result.violations.length} violation(s):`,
		);
		for (const violation of result.violations) {
			console.error(`  - ${violation}`);
		}
		process.exit(1);
	}
	console.log(
		`validate-window-opener: OK (${result.checkedCalls} window.open calls, ${result.checkedAnchors} target="_blank" anchors, 0 violations)`,
	);
}
