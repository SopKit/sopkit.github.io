import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokAudioDownloader from "@/components/tools/downloaders/TikTokAudioDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free MP3 From Tiktok Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free MP3 From Tiktok online. High-quality output and private browser-based tools with no signup. Free & secure.",
	keywords: "mp3 from tiktok, free online tool, no signup, mp3-from-tiktok, free mp3-from-tiktok, Mp3 From Tiktok online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/mp3-from-tiktok",
	},
	openGraph: {
		title: "Free MP3 From Tiktok Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free MP3 From Tiktok online. High-quality output and private browser-based tools with no signup. Free & secure.",
		url: "https://sopkit.github.io/mp3-from-tiktok",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free MP3 From Tiktok Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free MP3 From Tiktok online. High-quality output and private browser-based tools with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/mp3-from-tiktok");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokAudioDownloader />
		</ToolLayout>
	);
}
