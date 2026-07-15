import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BlutvDownloader from "@/components/tools/downloaders/BlutvDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Blutv Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Blutv Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "blutv video downloader, free online tool, no signup, blutv-video-downloader, free blutv-video-downloader, Blutv Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/blutv-video-downloader",
	},
	openGraph: {
		title: "Free Blutv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Blutv Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/blutv-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Blutv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Blutv Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/blutv-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BlutvDownloader />
		</ToolLayout>
	);
}
