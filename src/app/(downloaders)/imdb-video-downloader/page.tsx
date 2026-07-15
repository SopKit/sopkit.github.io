import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ImdbDownloader from "@/components/tools/downloaders/ImdbDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Imdb Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Imdb Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "imdb video downloader, free online tool, no signup, imdb-video-downloader, free imdb-video-downloader, Imdb Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/imdb-video-downloader",
	},
	openGraph: {
		title: "Free Imdb Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Imdb Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/imdb-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Imdb Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Imdb Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/imdb-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImdbDownloader />
		</ToolLayout>
	);
}
