import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import KickstarterDownloader from "@/components/tools/downloaders/KickstarterDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Kickstarter Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Kickstarter Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "kickstarter video downloader, free online tool, no signup, kickstarter-video-downloader, free kickstarter-video-downloader, Kickstarter Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/kickstarter-video-downloader",
	},
	openGraph: {
		title: "Free Kickstarter Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Kickstarter Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/kickstarter-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Kickstarter Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Kickstarter Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/kickstarter-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KickstarterDownloader />
		</ToolLayout>
	);
}
