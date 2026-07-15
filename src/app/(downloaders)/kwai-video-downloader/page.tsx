import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import KwaiDownloader from "@/components/tools/downloaders/KwaiDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Kwai Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Kwai Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "kwai video downloader, free online tool, no signup, kwai-video-downloader, free kwai-video-downloader, Kwai Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/kwai-video-downloader",
	},
	openGraph: {
		title: "Free Kwai Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Kwai Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/kwai-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Kwai Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Kwai Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/kwai-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KwaiDownloader />
		</ToolLayout>
	);
}
