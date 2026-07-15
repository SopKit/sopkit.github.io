import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokDownloader from "@/components/tools/downloaders/TikTokDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Tiktok Videos Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Tiktok Videos Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "tiktok videos downloader, free online tool, no signup, tiktok-videos-downloader, free tiktok-videos-downloader, Tiktok Videos Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tiktok-videos-downloader",
	},
	openGraph: {
		title: "Free Tiktok Videos Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Videos Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/tiktok-videos-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tiktok Videos Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Videos Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tiktok-videos-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokDownloader />
		</ToolLayout>
	);
}
