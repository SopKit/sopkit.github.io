import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RedditDownloader from "@/components/tools/downloaders/RedditDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Reddit Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Reddit Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "reddit video downloader, download reddit videos, reddit video saver, reddit to mp4, free tool, SopKit, reddit-video-downloader, free reddit-video-downloader, reddit video downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/reddit-video-downloader",
	},
	openGraph: {
		title: "Free Reddit Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Reddit Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/reddit-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Reddit Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Reddit Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/reddit-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RedditDownloader />
		</ToolLayout>
	);
}
