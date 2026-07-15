import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PuhutvDownloader from "@/components/tools/downloaders/PuhutvDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Puhutv Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Puhutv Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "puhutv video downloader, free online tool, no signup, puhutv-video-downloader, free puhutv-video-downloader, Puhutv Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/puhutv-video-downloader",
	},
	openGraph: {
		title: "Free Puhutv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Puhutv Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/puhutv-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Puhutv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Puhutv Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/puhutv-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PuhutvDownloader />
		</ToolLayout>
	);
}
