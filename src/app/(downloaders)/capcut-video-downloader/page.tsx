import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import CapcutDownloader from "@/components/tools/downloaders/CapcutDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Capcut Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Capcut Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "capcut video downloader, free online tool, no signup, capcut-video-downloader, free capcut-video-downloader, Capcut Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/capcut-video-downloader",
	},
	openGraph: {
		title: "Free Capcut Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Capcut Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/capcut-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Capcut Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Capcut Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/capcut-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<CapcutDownloader />
		</ToolLayout>
	);
}
