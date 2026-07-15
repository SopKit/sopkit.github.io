import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramStoryDownloader from "@/components/tools/downloaders/InstagramStoryDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Story Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Story Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "instagram story downloader, download instagram stories, story saver, ig story downloader, free tool, SopKit, instagram-story-downloader, free instagram-story-downloader, instagram story downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-story-downloader",
	},
	openGraph: {
		title: "Free Instagram Story Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Story Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/instagram-story-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Story Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Story Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-story-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramStoryDownloader />
		</ToolLayout>
	);
}
