import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import BitchuteDownloader from "@/components/tools/downloaders/BitchuteDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Bitchute Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Bitchute Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "bitchute video downloader, free online tool, no signup, bitchute-video-downloader, free bitchute-video-downloader, Bitchute Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/bitchute-video-downloader",
	},
	openGraph: {
		title: "Free Bitchute Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Bitchute Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/bitchute-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Bitchute Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Bitchute Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bitchute-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BitchuteDownloader />
		</ToolLayout>
	);
}
