import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import VimeoDownloader from "@/components/tools/downloaders/VimeoDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Vimeo Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Vimeo Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "vimeo downloader, download vimeo videos, vimeo video downloader, vimeo to mp4, free tool, SopKit, vimeo-video-downloader, free vimeo-video-downloader, vimeo video downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/vimeo-video-downloader",
	},
	openGraph: {
		title: "Free Vimeo Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Vimeo Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/vimeo-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Vimeo Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Vimeo Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/vimeo-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<VimeoDownloader />
		</ToolLayout>
	);
}
