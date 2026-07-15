import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import GaanaDownloader from "@/components/tools/downloaders/GaanaDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Gaana Video Downloader Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Gaana Video Downloader online. High-quality output and private browser-based tools with no signup.",
	keywords: "gaana video downloader, free online tool, no signup, gaana-video-downloader, free gaana-video-downloader, Gaana Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gaana-video-downloader",
	},
	openGraph: {
		title: "Free Gaana Video Downloader Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Gaana Video Downloader online. High-quality output and private browser-based tools with no signup.",
		url: "https://sopkit.github.io/gaana-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Gaana Video Downloader Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Gaana Video Downloader online. High-quality output and private browser-based tools with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/gaana-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<GaanaDownloader />
		</ToolLayout>
	);
}
