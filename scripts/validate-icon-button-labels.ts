// Validates that every icon-only button/link in the component tree carries
// an accessible name, and fails loudly (non-zero exit, no partial output)
// when any does not:
//
//   - A <Button>, <button> or <a> element whose rendered children are only
//     icons (lucide components, an inline <svg>, or an icon chosen by a
//     ternary such as `{copied ? <Check /> : <Copy />}`) and which has no
//     visible text, no string-literal text and no dynamic text must carry
//     an aria-label (aria-labelledby or title also count, matching the
//     definition this validator was built from).
//
// Why this exists: a screen reader announces an icon-only button with no
// accessible name as just "button", so the control's purpose is invisible
// to keyboard and screen-reader users. Before this validator existed,
// 136 such controls shipped across the tool components (copy/download/
// remove/reset buttons, list reorder buttons, media transport buttons,
// password-visibility toggles), each silently unusable without sight.
// The fix is an aria-label naming the control's action (dynamic where
// the action itself toggles, e.g. play/pause and show/hide password).
//
// Why the TypeScript compiler API, not regex: JSX children mix text,
// nested elements and expressions (`{copied ? <Check /> : <Copy />}`,
// `{isPlaying ? <Pause /> : <Play />}`), and a regex scan cannot tell
// a button whose label lives inside a ternary branch ("COPIED METRICS!")
// from one whose branches are icons only. Parsing the real AST is the
// only scan that does not drown in false positives or miss the
// conditional-icon cases. TypeScript is a direct devDependency, so this
// does not add a new dependency to the prebuild chain.
//
// Scope limits, stated plainly:
//   - Only src/components and src/app .tsx files are checked. The
//     validator walks the parsed AST, so it sees through ternaries,
//     fragments and nested elements; it does not execute components.
//   - An expression that could render text at runtime (an identifier, a
//     member access such as `{t.download}`, a function call) is treated
//     as "unknown, possibly text" and is NOT flagged. This is deliberate:
//     flagging dynamic text would false-positive on i18n strings and
//     interpolated labels. The cost is that a dynamic expression that in
//     fact renders no text is missed; the 136 fixed controls were all
//     statically provable icon-only.
//   - A <Button asChild> wrapper that itself carries a label covers the
//     <a> it renders (Radix Slot merges the props onto the child), so
//     that <a> is not flagged separately. The QrReaderPremium open-link
//     control additionally labels the <a> directly, so it passes either
//     way.
//   - Tooltip wrappers do NOT count as a label: a Radix Tooltip shows
//     text on hover but does not give the button an accessible name.
//     The LogoGenerator undo/redo buttons therefore carry aria-labels
//     matching their tooltip text.
//   - Self-closing elements (<Button /> with no children) are skipped:
//     they render no icon and no control content, so the icon-only
//     definition does not apply to them.
//   - The two print-preview document headings demoted from <h1> to <h2>
//     in the same round (BioDataMaker, InvoiceGenerator) are a heading
//     fix, not a button fix, and are pinned by the test, not here.
//
// Run: bun run validate:icon-button-labels (also wired into `prebuild`,
// after validate-blog-tool-routes and before generate-sitemap).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export interface IconControlViolation {
  file: string;
  line: number;
  tag: string;
  snippet: string;
}

export interface IconControlResult {
  checked: number;
  violations: IconControlViolation[];
}

const LABEL_ATTRIBUTES = new Set(["aria-label", "aria-labelledby", "title"]);

function elementName(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): string {
  const tag = node.tagName;
  if (ts.isIdentifier(tag)) {
    return tag.text;
  }
  return tag.getText();
}

// JsxAttributeName is either a plain identifier or a namespaced name
// (e.g. xml:lang), which carries no single .text property.
function attributeName(attr: ts.JsxAttribute): string {
  if (ts.isIdentifier(attr.name)) {
    return attr.name.text;
  }
  return `${attr.name.namespace.text}:${attr.name.name.text}`;
}

function hasLabelAttribute(opening: ts.JsxOpeningElement): boolean {
  for (const attr of opening.attributes.properties) {
    if (ts.isJsxAttribute(attr) && LABEL_ATTRIBUTES.has(attributeName(attr))) {
      return true;
    }
  }
  return false;
}

function hasAttribute(opening: ts.JsxOpeningElement, name: string): boolean {
  for (const attr of opening.attributes.properties) {
    if (ts.isJsxAttribute(attr) && attributeName(attr) === name) {
      return true;
    }
  }
  return false;
}

function isIconElementName(name: string): boolean {
  return name === "svg" || /^[A-Z]/.test(name);
}

interface NameInfo {
  text: string;
  unknown: boolean;
  hasIcon: boolean;
}

function emptyInfo(): NameInfo {
  return { text: "", unknown: false, hasIcon: false };
}

function merge(a: NameInfo, b: NameInfo): NameInfo {
  return {
    text: [a.text, b.text].filter(Boolean).join(" "),
    unknown: a.unknown || b.unknown,
    hasIcon: a.hasIcon || b.hasIcon,
  };
}

// Accessible-name text of an expression, following the same rules as the
// scan this validator was built from: string literals and template-literal
// text count; both branches of a conditional count; anything that could
// render text at runtime (identifiers, calls, member access) marks the
// result unknown instead of flagging it.
function expressionInfo(expr: ts.Expression): NameInfo {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
    return { text: expr.text, unknown: false, hasIcon: false };
  }
  if (ts.isTemplateExpression(expr)) {
    let info: NameInfo = { text: expr.head.text, unknown: false, hasIcon: false };
    for (const span of expr.templateSpans) {
      const inner = expressionInfo(span.expression);
      info = merge(info, inner);
    }
    return info;
  }
  if (ts.isConditionalExpression(expr)) {
    return merge(
      expressionInfo(expr.whenTrue),
      expressionInfo(expr.whenFalse),
    );
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
    return expressionInfo(expr.right);
  }
  if (
    ts.isParenthesizedExpression(expr) ||
    ts.isAsExpression(expr) ||
    ts.isSatisfiesExpression(expr) ||
    ts.isNonNullExpression(expr)
  ) {
    return expressionInfo(expr.expression);
  }
  if (ts.isJsxElement(expr) || ts.isJsxFragment(expr)) {
    return childrenInfo(expr);
  }
  if (ts.isJsxSelfClosingElement(expr)) {
    const name = elementName(expr);
    return {
      text: "",
      unknown: false,
      hasIcon: isIconElementName(name),
    };
  }
  // Identifier, call, member access, arrow function, etc.: may render
  // text at runtime. Do not flag.
  return { text: "", unknown: true, hasIcon: false };
}

function childrenInfo(
  node: ts.JsxElement | ts.JsxFragment | ts.JsxSelfClosingElement,
): NameInfo {
  let info = emptyInfo();
  if (ts.isJsxElement(node)) {
    const selfName = elementName(node.openingElement);
    // The node itself is an icon element (reached through an expression):
    // it contributes an icon, not text. The control element itself
    // (Button/button/a) is never counted as its own icon.
    if (isIconElementName(selfName) && !["Button", "button", "a"].includes(selfName)) {
      info.hasIcon = true;
    }
  }
  if (!ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
    return info;
  }
  for (const child of node.children) {
    if (ts.isJsxText(child)) {
      const text = child.text.trim();
      if (text) {
        info.text = [info.text, text].filter(Boolean).join(" ");
      }
    } else if (ts.isJsxExpression(child)) {
      if (child.expression) {
        info = merge(info, expressionInfo(child.expression));
      }
    } else if (ts.isJsxElement(child) || ts.isJsxFragment(child)) {
      const inner = childrenInfo(child);
      info = merge(info, inner);
      if (ts.isJsxElement(child)) {
        const name = elementName(child.openingElement);
        if (isIconElementName(name)) {
          info.hasIcon = true;
        }
      }
    } else if (ts.isJsxSelfClosingElement(child)) {
      const name = elementName(child);
      if (isIconElementName(name)) {
        info.hasIcon = true;
      }
    }
  }
  return info;
}

function collectTsxFiles(dir: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsxFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
}

// <a> elements rendered by a labelled <Button asChild> (Radix Slot merges
// the button's props onto the child) are covered by the button's label.
function collectAsChildCoveredLinks(sourceFile: ts.SourceFile): Set<ts.Node> {
  const covered = new Set<ts.Node>();
  const visit = (node: ts.Node): void => {
    if (
      ts.isJsxElement(node) &&
      elementName(node.openingElement) === "Button" &&
      hasAttribute(node.openingElement, "asChild") &&
      hasLabelAttribute(node.openingElement)
    ) {
      const mark = (inner: ts.Node): void => {
        if (ts.isJsxElement(inner) && elementName(inner.openingElement) === "a") {
          covered.add(inner);
        }
        ts.forEachChild(inner, mark);
      };
      ts.forEachChild(node, mark);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return covered;
}

export function findUnlabelledIconControls(root: string): IconControlResult {
  const files: string[] = [];
  for (const sub of ["src/components", "src/app"]) {
    const dir = path.join(root, sub);
    if (fs.existsSync(dir)) {
      collectTsxFiles(dir, files);
    }
  }
  if (files.length === 0) {
    throw new Error("no .tsx files found under src/components or src/app; refusing to pass vacuously");
  }

  const violations: IconControlViolation[] = [];
  let checked = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const coveredLinks = collectAsChildCoveredLinks(sourceFile);
    const visit = (node: ts.Node): void => {
      if (ts.isJsxElement(node)) {
        const name = elementName(node.openingElement);
        if (name === "Button" || name === "button" || name === "a") {
          const opening = node.openingElement;
          const isLink = name === "a";
          const hasHref =
            !isLink ||
            opening.attributes.properties.some(
              (attr) => ts.isJsxAttribute(attr) && attributeName(attr) === "href",
            );
          if (hasHref && !coveredLinks.has(node) && !hasLabelAttribute(opening)) {
            checked += 1;
            const info = childrenInfo(node);
            if (info.hasIcon && !info.text.trim() && !info.unknown) {
              const { line } = sourceFile.getLineAndCharacterOfPosition(
                node.getStart(sourceFile),
              );
              const snippet = content
                .slice(node.getStart(sourceFile), node.getStart(sourceFile) + 160)
                .replace(/\s+/g, " ");
              violations.push({
                file: path.relative(root, file),
                line: line + 1,
                tag: name,
                snippet,
              });
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  return { checked, violations };
}

function fail(message: string): never {
  console.error(`\u274c ${message}`);
  process.exit(1);
}

const invokedAsScript =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(__filename);

if (invokedAsScript) {
  const result = findUnlabelledIconControls(rootDir);
  if (result.violations.length > 0) {
    console.error(
      `\u274c validate-icon-button-labels: ${result.violations.length} icon-only control(s) without an accessible name (checked ${result.checked} unlabelled controls):`,
    );
    for (const violation of result.violations) {
      console.error(`  - ${violation.file}:${violation.line} <${violation.tag}> ${violation.snippet}`);
    }
    process.exit(1);
  }
  console.log(
    `\u2705 validate-icon-button-labels: all ${result.checked} unlabelled controls checked, no icon-only control without an accessible name.`,
  );
}
