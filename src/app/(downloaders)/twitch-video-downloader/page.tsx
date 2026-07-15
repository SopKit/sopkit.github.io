import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TwitchDownloader from "@/components/tools/downloaders/TwitchDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Twitch Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Twitch Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "twitch video downloader, download twitch clips, twitch vod downloader, twitch to mp4, free tool, SopKit, twitch-video-downloader, free twitch-video-downloader, twitch video downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/twitch-video-downloader",
	},
	openGraph: {
		title: "Free Twitch Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Twitch Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/twitch-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Twitch Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Twitch Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/twitch-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TwitchDownloader />
		</ToolLayout>
	);
}
