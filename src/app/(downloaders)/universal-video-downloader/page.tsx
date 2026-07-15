import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import UniversalVideoDownloader from "@/components/tools/downloaders/UniversalVideoDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Universal Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Universal Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "universal video downloader, free online tool, no signup, universal-video-downloader, free universal-video-downloader, Universal Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/universal-video-downloader",
	},
	openGraph: {
		title: "Free Universal Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Universal Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/universal-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Universal Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Universal Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/universal-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UniversalVideoDownloader />
		</ToolLayout>
	);
}
