import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokDownloader from "@/components/tools/downloaders/TikTokDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Tiktok Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Tiktok Downloader online. Fast, secure, and private processing with no signup. Try it free now.",
	keywords: "tiktok downloader, download tiktok videos, tiktok video downloader, tiktok mp4, tiktok no watermark, SopKit, tiktok-downloader, free tiktok-downloader, tiktok downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/tiktok-downloader",
	},
	openGraph: {
		title: "Free Tiktok Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Downloader online. Fast, secure, and private processing with no signup. Try it free now.",
		url: "https://sopkit.github.io/tiktok-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tiktok Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Downloader online. Fast, secure, and private processing with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tiktok-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokDownloader />
		</ToolLayout>
	);
}
