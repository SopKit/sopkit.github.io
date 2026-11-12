import { buildCanonicalUrl } from "@/seo/canonical";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Text Tools - Free Online Text Utilities | SopKit",
	description:
		"Free online text tools: word counter, case converter, line sorter, find & replace with regex, duplicate remover, and text reverser. No signup required.",
	openGraph: {
		title: "Text Tools - Free Online Text Utilities | SopKit",
		description:
			"Count words, convert case, sort lines, and clean text instantly with free browser-based tools. No signup required.",
		url: buildCanonicalUrl("/text-tools"),
		siteName: "SopKit",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Text Tools - Free Online Text Utilities",
		description:
			"Sort, clean, and transform text instantly with free browser-based tools. Count words, convert case, sort lines, and remove duplicates.",
	},
	robots: { index: true, follow: true },
};

export default function TextGroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<main className="flex-1">{children}</main>
		</div>
	);
}
