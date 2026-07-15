import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TedDownloader from "@/components/tools/downloaders/TedDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Ted Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Ted Video Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
	keywords: "ted video downloader, free online tool, no signup, ted-video-downloader, free ted-video-downloader, Ted Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ted-video-downloader",
	},
	openGraph: {
		title: "Free Ted Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ted Video Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
		url: "https://sopkit.github.io/ted-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Ted Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ted Video Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ted-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TedDownloader />
		</ToolLayout>
	);
}
