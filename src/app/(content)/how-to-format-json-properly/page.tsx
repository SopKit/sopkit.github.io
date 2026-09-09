import Link from "next/link";
import ToolLayout from "@/components/tools/shared/ToolLayout";

export const metadata = {
	title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
	description: "Format JSON the safe way: validate first, pretty-print second, minify last. Common errors explained plus local, in-browser tools that never upload data.",
	keywords: "how to format json properly (without breaking data), how to format json properly (without breaking data) guide, SopKit, how-to-format-json-properly, how to format json properly, free how-to-format-json-properly, how to format json properly online, SopKit guide, online tool guide, free tool category, tool directory, tool overview",
	alternates: {
		canonical: "https://sopkit.github.io/how-to-format-json-properly",
	},
	openGraph: {
		title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
		description: "Format JSON the safe way: validate first, pretty-print second, minify last. Common errors explained plus local, in-browser tools that never upload data.",
		url: "https://sopkit.github.io/how-to-format-json-properly",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free How to Format JSON Properly (Without Breaking Data) Online - No Signup | SopKit",
		description: "Format JSON the safe way: validate first, pretty-print second, minify last. Common errors explained plus local, in-browser tools that never upload data.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = {
		id: "how-to-format-json-properly",
		name: "How to Format JSON Properly (Without Breaking Data)",
		description:
			"Learn how to format JSON correctly with a simple workflow for validation, cleanup, and conversion-safe output.",
		route: "/how-to-format-json-properly",
		extraSlugs: [],
		popular: false,
		category: "content",
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: tool.name,
						description: tool.description,
						url: "https://sopkit.github.io/how-to-format-json-properly/",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "Any",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
					}),
				}}
			/>

			<ToolLayout breadcrumbs={[]} tool={{ ...tool, category: "content" }}>
				<div className="mx-auto max-w-3xl px-4 py-8">
					<p className="leading-relaxed text-muted-foreground">
						Broken JSON has a way of finding you at the worst moment — a deploy
						config that won't parse, an API response your code chokes on, a
						translation file with one stray comma. The good news: formatting
						JSON properly is a three-step habit, not a talent. Validate,
						format, then ship. Here's the workflow and the mistakes that cause
						nearly every failure.
					</p>

					<h2 className="mt-8 text-2xl font-semibold">
						What makes JSON invalid in the first place
					</h2>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						JSON is stricter than JavaScript object literals, which trips up
						even experienced developers. These are the usual suspects:
					</p>
					<ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
						<li>
							<strong>Trailing commas.</strong> Valid in JS, fatal in JSON.{" "}
							<code>{'{"a": 1,}'}</code> fails everywhere except your editor's
							forgiving parser.
						</li>
						<li>
							<strong>Single quotes.</strong> Keys and string values must use
							double quotes, always.
						</li>
						<li>
							<strong>Unquoted keys.</strong> <code>{"{name: 'x'}"}</code> is
							JavaScript, not JSON.
						</li>
						<li>
							<strong>Comments.</strong> There is no <code>//</code> or{" "}
							<code>/* */</code> in standard JSON. If you need annotations,
							add a <code>"_comment"</code> key instead.
						</li>
						<li>
							<strong>Smart quotes.</strong> Copying examples from docs, Word,
							or Slack can replace straight quotes with curly ones — invisible
							in some fonts, instantly fatal to parsers.
						</li>
					</ul>

					<h2 className="mt-8 text-2xl font-semibold">
						The three-pass workflow that keeps data intact
					</h2>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						Pass one: validate before touching anything. Paste your payload
						into the{" "}
						<Link href="/json-validator" className="text-primary underline">JSON validator</Link>{" "}
						and read the error position it reports — most validators point at
						the exact character that broke parsing. Fixing an invalid file by
						reformatting it just rearranges the wreckage; formatting only
						preserves structure when the structure already parses.
					</p>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						Pass two: pretty-print with the{" "}
						<Link href="/json-formatter" className="text-primary underline">JSON formatter</Link>.
						It re-indents nested objects so you can actually see array
						boundaries and mismatched braces. Two-space indentation is the
						de facto standard for configs; four spaces read better for
						documentation. Either is fine — pick one and stay consistent per
						project, since mixed indentation makes diffs noisy.
					</p>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						Pass three (only when shipping): strip whitespace with the{" "}
						<Link href="/json-minify" className="text-primary underline">JSON minifier</Link>{" "}
						to cut bytes from API responses or embedded payloads. Keep the
						formatted version as your source of truth and treat the minified
						output as disposable build output.
					</p>

					<h2 className="mt-8 text-2xl font-semibold">
						Understanding large or unfamiliar payloads
					</h2>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						A formatted wall of nested arrays is still hard to reason about. A{" "}
						<Link href="/json-viewer" className="text-primary underline">JSON viewer</Link>{" "}
						lets you collapse branches and inspect nodes interactively, which
						is far quicker than scrolling. When two versions of a config
						disagree and CI is red, a{" "}
						<Link href="/json-diff-checker" className="text-primary underline">JSON diff checker</Link>{" "}
						shows exactly which keys changed — including subtle type changes
						like <code>"1"</code> versus <code>1</code> that eyeballs miss.
					</p>

					<h2 className="mt-8 text-2xl font-semibold">
						Converting between formats safely
					</h2>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						JSON rarely stays alone. Spreadsheets become config files via a{" "}
						<Link href="/csv-to-json-converter" className="text-primary underline">CSV to JSON converter</Link>,
						YAML-heavy DevOps pipelines exchange data through a{" "}
						<Link href="/json-to-yaml-converter" className="text-primary underline">JSON to YAML converter</Link>,
						and typed codebases generate interfaces with a{" "}
						<Link href="/json-to-typescript" className="text-primary underline">JSON to TypeScript converter</Link>.
						The rule of thumb after any conversion: round-trip the output back
						through validation once. Conversions preserve data but occasionally
						change shape — empty strings becoming nulls, numbers becoming
						strings — and catching that takes seconds.
					</p>

					<h2 className="mt-8 text-2xl font-semibold">
						One more thing: where you paste matters
					</h2>
					<p className="mt-4 leading-relaxed text-muted-foreground">
						API payloads routinely contain tokens, session IDs, or customer
						rows. Random "free JSON formatter" sites upload whatever you paste
						to their servers. SopKit's tools parse everything client-side in
						your browser — the data never leaves the device — so formatting a
						response containing an auth header doesn't leak it anywhere.
					</p>

					<h2 className="mt-8 text-2xl font-semibold">
						Frequently asked questions
					</h2>

					<h3 className="mt-6 text-lg font-semibold">
						Should I indent JSON with 2 or 4 spaces?
					</h3>
					<p className="mt-2 leading-relaxed text-muted-foreground">
						Functionally identical — parsers don't care. Two spaces dominates
						web configs and most style guides; four spaces wins on readability
						for deeply nested data. Consistency within a project beats either
						default.
					</p>

					<h3 className="mt-6 text-lg font-semibold">
						Why does my JSON work in JavaScript but fail validators?
					</h3>
					<p className="mt-2 leading-relaxed text-muted-foreground">
						Because JavaScript accepts superset syntax: trailing commas,
						single quotes, unquoted keys, and comments all run fine as JS
						expressions. Strict JSON rejects them. If a validator flags those,
						it's doing its job.
					</p>

					<h3 className="mt-6 text-lg font-semibold">
						Can formatting ever change my data?
					</h3>
					<p className="mt-2 leading-relaxed text-muted-foreground">
						Whitespace-only reformatting cannot alter values. Data changes come
						from edits made while reading badly formatted files, or from lossy
						conversions between formats — which is why validating before and
						diffing after any conversion is worth the thirty seconds.
					</p>

					<h3 className="mt-6 text-lg font-semibold">
						How do I format JSON without uploading it anywhere?
					</h3>
					<p className="mt-2 leading-relaxed text-muted-foreground">
						Use a client-side tool like the ones linked above. All parsing and
						formatting happens in your browser tab; there's no network call
						carrying your payload, which you can verify in dev tools if
						you're skeptical.
					</p>

					<p className="mt-8 leading-relaxed text-muted-foreground">
						Need more than formatting — schema checks, XML bridges, CSV
						pipelines? The full toolkit is searchable via{" "}
						<Link href="/search" className="text-primary underline">SopKit search</Link>.
					</p>
				</div>
			</ToolLayout>
		</>
	);
}
