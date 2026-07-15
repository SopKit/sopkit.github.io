import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IzleseneDownloader from "@/components/tools/downloaders/IzleseneDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Izlesene Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Izlesene Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "izlesene video downloader, free online tool, no signup, izlesene-video-downloader, free izlesene-video-downloader, Izlesene Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/izlesene-video-downloader",
	},
	openGraph: {
		title: "Free Izlesene Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Izlesene Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/izlesene-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Izlesene Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Izlesene Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/izlesene-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IzleseneDownloader />
		</ToolLayout>
	);
}
