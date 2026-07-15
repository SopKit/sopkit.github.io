import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ThreadsDownloader from "@/components/tools/downloaders/ThreadsDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Threads Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Threads Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "threads video downloader, free online tool, no signup, threads-video-downloader, free threads-video-downloader, Threads Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/threads-video-downloader",
	},
	openGraph: {
		title: "Free Threads Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Threads Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/threads-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Threads Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Threads Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/threads-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ThreadsDownloader />
		</ToolLayout>
	);
}
