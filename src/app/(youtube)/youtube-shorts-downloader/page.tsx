import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YouTubeShortsDownloader from "@/components/tools/downloaders/YouTubeShortsDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free YouTube Shorts Downloader Online - No Signup | SopKit",
	description: "Download YouTube Shorts videos in high quality for offline viewing",
	keywords: "youtube shorts downloader, free online tool, no signup, youtube-shorts-downloader, free youtube-shorts-downloader, Youtube Shorts Downloader online, YouTube tool, free YouTube utility, YouTube optimizer, video analytics, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-shorts-downloader/",
	},
	openGraph: {
		title: "Free YouTube Shorts Downloader Online - No Signup | SopKit",
		description: "Download YouTube Shorts videos in high quality for offline viewing",
		url: "https://sopkit.github.io/youtube-shorts-downloader/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Shorts Downloader Online - No Signup | SopKit",
		description: "Download YouTube Shorts videos in high quality for offline viewing",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-shorts-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeShortsDownloader />
		</ToolLayout>
	);
}
