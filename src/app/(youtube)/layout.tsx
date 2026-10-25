import { SITE_URL } from "@/constants/config";
import { generateCollectionPageSchema } from "@/lib/seo";

export const metadata = {
	title: "Free YouTube Tools Online - No Signup | SopKit",
	description:
		"Free YouTube tools: download videos and Shorts, check channel stats, and generate titles, tags and descriptions. No signup required.",
	keywords:
		"youtube tools, youtube downloader, youtube shorts downloader, youtube thumbnail downloader, youtube tag generator, youtube video summarizer, ai youtube tools, content creator tools, youtube to mp3, youtube thumbnail grabber",
	openGraph: {
		title: "Free YouTube Tools Online - No Signup | SopKit",
		description:
			"Download YouTube videos and Shorts, check channel stats, and generate titles, tags and descriptions — free, no signup.",
		url: `${SITE_URL}/youtube-tools`,
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
		title: "Free YouTube Tools Online - No Signup | SopKit",
		description:
			"Download YouTube videos and Shorts, check channel stats, and generate titles, tags and descriptions — free, no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

const collectionPageSchema = generateCollectionPageSchema('youtube', {
	name: 'YouTube Creator Tools',
	description: 'Suite of free tools for YouTube content creation and downloading.'
});

export default function YouTubeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(collectionPageSchema),
				}}
			/>
			<main className="flex-1">{children}</main>
		</div>
	);
}
