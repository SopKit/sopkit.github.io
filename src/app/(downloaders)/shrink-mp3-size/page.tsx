import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokMP3Converter from "@/components/tools/downloaders/TikTokMP3Converter";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Shrink MP3 Size Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Shrink MP3 Size online. High-quality output and private browser-based tools with no signup. Free & secure.",
	keywords: "shrink mp3 size, free online tool, no signup, shrink-mp3-size, free shrink-mp3-size, Shrink Mp3 Size online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/shrink-mp3-size",
	},
	openGraph: {
		title: "Free Shrink MP3 Size Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Shrink MP3 Size online. High-quality output and private browser-based tools with no signup. Free & secure.",
		url: "https://sopkit.github.io/shrink-mp3-size",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Shrink MP3 Size Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Shrink MP3 Size online. High-quality output and private browser-based tools with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/shrink-mp3-size");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokMP3Converter />
		</ToolLayout>
	);
}
