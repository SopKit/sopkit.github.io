import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import OnlineVideoDownloader from "@/components/tools/downloaders/OnlineVideoDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Online Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Online Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "online video downloader, free online tool, no signup, online-video-downloader, free online-video-downloader, Online Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/online-video-downloader",
	},
	openGraph: {
		title: "Free Online Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Online Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/online-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Online Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Online Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/online-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<OnlineVideoDownloader />
		</ToolLayout>
	);
}
