import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FlickrDownloader from "@/components/tools/downloaders/FlickrDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Flickr Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Flickr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "flickr video downloader, free online tool, no signup, flickr-video-downloader, free flickr-video-downloader, Flickr Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/flickr-video-downloader",
	},
	openGraph: {
		title: "Free Flickr Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Flickr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/flickr-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Flickr Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Flickr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/flickr-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FlickrDownloader />
		</ToolLayout>
	);
}
