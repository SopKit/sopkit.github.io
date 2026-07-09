import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokAudioDownloader from "@/components/tools/downloaders/TikTokAudioDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Mp3 Extractor Online - No Signup | SopKit",
	description: "Save and download media files from multiple platforms with our free Mp3 Extractor online. High-speed downloading with no signup needed.",
	keywords: "free mp3 extractor, free online tool, no signup, free-mp3-extractor, Free Mp3 Extractor online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/free-mp3-extractor/",
	},
	openGraph: {
		title: "Free Mp3 Extractor Online - No Signup | SopKit",
		description: "Save and download media files from multiple platforms with our free Mp3 Extractor online. High-speed downloading with no signup needed.",
		url: "https://sopkit.github.io/free-mp3-extractor/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Mp3 Extractor Online - No Signup | SopKit",
		description: "Save and download media files from multiple platforms with our free Mp3 Extractor online. High-speed downloading with no signup needed.",
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
