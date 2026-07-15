import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokDownloader from "@/components/tools/downloaders/TikTokDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Tiktok MP4 Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Tiktok MP4 online. Fast, secure, and private processing with no signup. No signup required.",
	keywords: "save tiktok mp4, free online tool, no signup, save-tiktok-mp4, free save-tiktok-mp4, Save Tiktok Mp4 online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/save-tiktok-mp4",
	},
	openGraph: {
		title: "Free Save Tiktok MP4 Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Tiktok MP4 online. Fast, secure, and private processing with no signup. No signup required.",
		url: "https://sopkit.github.io/save-tiktok-mp4",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Tiktok MP4 Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Tiktok MP4 online. Fast, secure, and private processing with no signup. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-tiktok-mp4");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokDownloader />
		</ToolLayout>
	);
}
