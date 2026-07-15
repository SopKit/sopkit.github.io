import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TumblrVideoDownloader from "@/components/tools/downloaders/TumblrVideoDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Tumblr Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Tumblr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "tumblr video downloader, free online tool, no signup, tumblr-video-downloader, free tumblr-video-downloader, Tumblr Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tumblr-video-downloader",
	},
	openGraph: {
		title: "Free Tumblr Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tumblr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/tumblr-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tumblr Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tumblr Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tumblr-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TumblrVideoDownloader />
		</ToolLayout>
	);
}
