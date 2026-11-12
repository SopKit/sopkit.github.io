import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free PDF Tools Online - No Signup | SopKit",
	description:
		"Professional free PDF tools: merge, split, compress, convert to/from Word, protect with passwords, and unlock secured PDFs. No signup, no watermarks.",
	openGraph: {
		title: "Free PDF Tools Online - No Signup | SopKit",
		description:
			"Merge, split, compress, and convert PDFs for free. No signup, no watermarks, zero-storage security policy.",
		url: buildCanonicalUrl("/pdf-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free PDF Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free PDF Tools Online - No Signup | SopKit",
		description:
			"Merge, split, compress, and convert PDFs for free. No signup, no watermarks, zero-storage security policy.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function PDFToolsLayout({
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

