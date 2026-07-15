import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import YoutubeThumbnailDownloader from "@/components/tools/downloaders/YoutubeThumbnailDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Youtube Thumbnail Downloader Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Youtube Thumbnail Downloader online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "youtube thumbnail downloader, download youtube thumbnails, video thumbnail grabber, free tool, SopKit, youtube-thumbnail-downloader, free youtube-thumbnail-downloader, youtube thumbnail downloader online, online downloader, free media saver, video downloader, url downloader",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-thumbnail-downloader",
	},
	openGraph: {
		title: "Free Youtube Thumbnail Downloader Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Youtube Thumbnail Downloader online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/youtube-thumbnail-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Youtube Thumbnail Downloader Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Youtube Thumbnail Downloader online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-thumbnail-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YoutubeThumbnailDownloader />
		</ToolLayout>
	);
}
