import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookDownloader from "@/components/tools/downloaders/FacebookDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Facebook Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Facebook Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "facebook video downloader, download fb videos, facebook reels downloader, free video downloader, SopKit, facebook-video-downloader, free facebook-video-downloader, facebook video downloader online, online downloader, free media saver, video downloader, url downloader",
	alternates: {
		canonical: "https://sopkit.github.io/facebook-video-downloader",
	},
	openGraph: {
		title: "Free Facebook Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/facebook-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Facebook Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/facebook-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookDownloader />
		</ToolLayout>
	);
}
