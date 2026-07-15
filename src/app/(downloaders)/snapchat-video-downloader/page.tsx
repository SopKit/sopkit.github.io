import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Snapchat Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Snapchat Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "snapchat video downloader, download snapchat videos, snap video saver, snapchat stories downloader, free tool, SopKit, snapchat-video-downloader, free snapchat-video-downloader, snapchat video downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/snapchat-video-downloader",
	},
	openGraph: {
		title: "Free Snapchat Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Snapchat Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/snapchat-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Snapchat Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Snapchat Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/snapchat-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SnapchatDownloader />
		</ToolLayout>
	);
}
