import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookStoryDownloader from "@/components/tools/downloaders/FacebookStoryDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Facebook Story Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Facebook Story Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "facebook story downloader, save facebook stories, fb story saver, facebook story saver, free tool, SopKit, facebook-story-downloader, free facebook-story-downloader, facebook story downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/facebook-story-downloader",
	},
	openGraph: {
		title: "Free Facebook Story Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Story Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/facebook-story-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Facebook Story Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Story Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/facebook-story-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookStoryDownloader />
		</ToolLayout>
	);
}
