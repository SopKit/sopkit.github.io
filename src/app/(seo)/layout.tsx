import { buildCanonicalUrl } from "@/seo/canonical";



export const metadata = {
	title: "Free SEO Tools Online - No Signup | SopKit",
	description:
		"Boost your search rankings with 17+ SEO tools — site audit, keyword research, backlink checker, and meta tag generator. No signup, 100% browser-based analysis.",
	openGraph: {
		title: "Free SEO Tools Online - No Signup | SopKit",
		description:
			"17+ free SEO tools for site audits, keyword research, schema markup, and meta tag optimization. No signup required.",
		url: buildCanonicalUrl("/seo-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1024,
				height: 541,
				alt: "Free SEO Tools Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free SEO Tools Online - No Signup | SopKit",
		description:
			"Boost your rankings with our free SEO tools. Keyword planner, backlink checker, site audit, and more.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function SEOToolsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<main className="flex-1">{children}</main>
		</div>
	);
}
