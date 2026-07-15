import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FebspotDownloader from "@/components/tools/downloaders/FebspotDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Febspot Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Febspot Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "febspot video downloader, free online tool, no signup, febspot-video-downloader, free febspot-video-downloader, Febspot Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/febspot-video-downloader",
	},
	openGraph: {
		title: "Free Febspot Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Febspot Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/febspot-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Febspot Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Febspot Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/febspot-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FebspotDownloader />
		</ToolLayout>
	);
}
