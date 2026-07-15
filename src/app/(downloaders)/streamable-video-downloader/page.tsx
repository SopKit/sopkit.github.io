import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import StreamableDownloader from "@/components/tools/downloaders/StreamableDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Streamable Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Streamable Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "streamable video downloader, free online tool, no signup, streamable-video-downloader, free streamable-video-downloader, Streamable Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/streamable-video-downloader",
	},
	openGraph: {
		title: "Free Streamable Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Streamable Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/streamable-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Streamable Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Streamable Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/streamable-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<StreamableDownloader />
		</ToolLayout>
	);
}
