import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ImgurDownloader from "@/components/tools/downloaders/ImgurDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Imgur Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Imgur Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "imgur video downloader, free online tool, no signup, imgur-video-downloader, free imgur-video-downloader, Imgur Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/imgur-video-downloader",
	},
	openGraph: {
		title: "Free Imgur Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Imgur Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/imgur-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Imgur Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Imgur Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/imgur-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ImgurDownloader />
		</ToolLayout>
	);
}
