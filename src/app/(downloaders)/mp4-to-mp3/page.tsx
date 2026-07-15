import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokMP3Converter from "@/components/tools/downloaders/TikTokMP3Converter";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free MP4 To MP3 Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free MP4 To MP3 online. High-quality output and private browser-based tools with no signup. No signup required.",
	keywords: "mp4 to mp3, free online tool, no signup, mp4-to-mp3, free mp4-to-mp3, Mp4 To Mp3 online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/mp4-to-mp3",
	},
	openGraph: {
		title: "Free MP4 To MP3 Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free MP4 To MP3 online. High-quality output and private browser-based tools with no signup. No signup required.",
		url: "https://sopkit.github.io/mp4-to-mp3",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free MP4 To MP3 Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free MP4 To MP3 online. High-quality output and private browser-based tools with no signup. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/mp4-to-mp3");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokMP3Converter />
		</ToolLayout>
	);
}
