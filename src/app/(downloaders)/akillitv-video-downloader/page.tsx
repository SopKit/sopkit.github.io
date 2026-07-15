import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import AkillitvDownloader from "@/components/tools/downloaders/AkillitvDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Akillitv Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Akillitv Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "akillitv video downloader, free online tool, no signup, akillitv-video-downloader, free akillitv-video-downloader, Akillitv Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/akillitv-video-downloader",
	},
	openGraph: {
		title: "Free Akillitv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Akillitv Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/akillitv-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Akillitv Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Akillitv Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/akillitv-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AkillitvDownloader />
		</ToolLayout>
	);
}
