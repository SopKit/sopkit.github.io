import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata = {
	title: "Free YouTube Tools Online - No Signup | SopKit",
	description:
		"Free YouTube tools: download videos and Shorts, check channel stats, and generate titles, tags and descriptions. No signup required.",
	openGraph: {
		title: "Free YouTube Tools Online - No Signup | SopKit",
		description:
			"Download YouTube videos and Shorts, check channel stats, and generate titles, tags and descriptions — free, no signup.",
		url: buildCanonicalUrl("/youtube-tools"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free YouTube Creator Tools",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free YouTube Tools Online - No Signup | SopKit",
		description:
			"Download YouTube videos and Shorts, check channel stats, and generate titles, tags and descriptions — free, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function YouTubeLayout({
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
