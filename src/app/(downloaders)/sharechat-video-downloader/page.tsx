import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SharechatDownloader from "@/components/tools/downloaders/SharechatDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Sharechat Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Sharechat Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "sharechat video downloader, free online tool, no signup, sharechat-video-downloader, free sharechat-video-downloader, Sharechat Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/sharechat-video-downloader",
	},
	openGraph: {
		title: "Free Sharechat Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Sharechat Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/sharechat-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Sharechat Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Sharechat Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/sharechat-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SharechatDownloader />
		</ToolLayout>
	);
}
