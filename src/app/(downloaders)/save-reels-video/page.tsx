import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramReelDownloader from "@/components/tools/downloaders/InstagramReelDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Reels Video Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Reels Video online. Fast, secure, and private processing with no signup. Try it free now.",
	keywords: "save reels video, save instagram reels, instagram reels saver, reel video downloader, free tool, SopKit, save-reels-video, free save-reels-video, save reels video online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/save-reels-video",
	},
	openGraph: {
		title: "Free Save Reels Video Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Reels Video online. Fast, secure, and private processing with no signup. Try it free now.",
		url: "https://sopkit.github.io/save-reels-video",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Reels Video Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Reels Video online. Fast, secure, and private processing with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-reels-video");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramReelDownloader />
		</ToolLayout>
	);
}
