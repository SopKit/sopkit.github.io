import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import NinegagDownloader from "@/components/tools/downloaders/NinegagDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Ninegag Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Ninegag Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "ninegag video downloader, free online tool, no signup, ninegag-video-downloader, free ninegag-video-downloader, Ninegag Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ninegag-video-downloader",
	},
	openGraph: {
		title: "Free Ninegag Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ninegag Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/ninegag-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Ninegag Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ninegag Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ninegag-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<NinegagDownloader />
		</ToolLayout>
	);
}
