import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RumbleDownloader from "@/components/tools/downloaders/RumbleDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Rumble Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Rumble Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "rumble video downloader, free online tool, no signup, rumble-video-downloader, free rumble-video-downloader, Rumble Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/rumble-video-downloader",
	},
	openGraph: {
		title: "Free Rumble Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Rumble Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/rumble-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Rumble Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Rumble Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/rumble-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RumbleDownloader />
		</ToolLayout>
	);
}
