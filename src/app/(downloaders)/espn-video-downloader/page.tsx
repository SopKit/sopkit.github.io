import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import EspnDownloader from "@/components/tools/downloaders/EspnDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Espn Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Espn Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "espn video downloader, free online tool, no signup, espn-video-downloader, free espn-video-downloader, Espn Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/espn-video-downloader",
	},
	openGraph: {
		title: "Free Espn Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Espn Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/espn-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Espn Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Espn Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/espn-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<EspnDownloader />
		</ToolLayout>
	);
}
