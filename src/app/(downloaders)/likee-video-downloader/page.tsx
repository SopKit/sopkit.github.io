import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import LikeeDownloader from "@/components/tools/downloaders/LikeeDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Likee Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Likee Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "likee video downloader, free online tool, no signup, likee-video-downloader, free likee-video-downloader, Likee Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/likee-video-downloader",
	},
	openGraph: {
		title: "Free Likee Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Likee Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/likee-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Likee Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Likee Video Downloader online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/likee-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LikeeDownloader />
		</ToolLayout>
	);
}
