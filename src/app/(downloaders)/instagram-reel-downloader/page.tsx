import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramReelDownloader from "@/components/tools/downloaders/InstagramReelDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Reel Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Reel Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "instagram reel downloader, download reels, instagram reels saver, reel video downloader, free tool, SopKit, instagram-reel-downloader, free instagram-reel-downloader, instagram reel downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-reel-downloader",
	},
	openGraph: {
		title: "Free Instagram Reel Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Reel Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/instagram-reel-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Reel Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Reel Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-reel-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramReelDownloader />
		</ToolLayout>
	);
}
