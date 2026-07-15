import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokAudioDownloader from "@/components/tools/downloaders/TikTokAudioDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Free MP3 Extractor Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Free MP3 Extractor online. High-quality output and private browser-based tools with no signup. Easy to use.",
	keywords: "free mp3 extractor, free online tool, no signup, free-mp3-extractor, Free Mp3 Extractor online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/free-mp3-extractor",
	},
	openGraph: {
		title: "Free Free MP3 Extractor Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Free MP3 Extractor online. High-quality output and private browser-based tools with no signup. Easy to use.",
		url: "https://sopkit.github.io/free-mp3-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Free MP3 Extractor Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Free MP3 Extractor online. High-quality output and private browser-based tools with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/free-mp3-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokAudioDownloader />
		</ToolLayout>
	);
}
