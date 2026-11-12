import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free Utility Tools Online - No Signup | SopKit",
	description:
		"Free online utility tools: internet speed test, URL shortener, password generator, and QR code maker. Everything runs in your browser with no signup.",
	openGraph: {
		title: "Free Utility Tools Online - No Signup | SopKit",
		description:
			"85+ free utility tools — speed test, password generator, QR codes, converters, and calculators. No signup required.",
		url: buildCanonicalUrl("/other-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Utility Tools Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Utility Tools Online - No Signup | SopKit",
		description:
			"85+ free utility tools — speed test, password generator, QR codes, converters, and calculators. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function UtilityToolsLayout({
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
