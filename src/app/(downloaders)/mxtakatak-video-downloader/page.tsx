import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import MxTakaTakDownloader from "@/components/tools/downloaders/MxTakaTakDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Mxtakatak Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Mxtakatak Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "mxtakatak video downloader, free online tool, no signup, mxtakatak-video-downloader, free mxtakatak-video-downloader, Mxtakatak Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/mxtakatak-video-downloader",
	},
	openGraph: {
		title: "Free Mxtakatak Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Mxtakatak Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/mxtakatak-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Mxtakatak Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Mxtakatak Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/mxtakatak-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MxTakaTakDownloader />
		</ToolLayout>
	);
}
