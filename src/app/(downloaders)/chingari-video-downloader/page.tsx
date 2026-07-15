import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import ChingariDownloader from "@/components/tools/downloaders/ChingariDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Chingari Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Chingari Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "chingari video downloader, free online tool, no signup, chingari-video-downloader, free chingari-video-downloader, Chingari Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/chingari-video-downloader",
	},
	openGraph: {
		title: "Free Chingari Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Chingari Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/chingari-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Chingari Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Chingari Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/chingari-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ChingariDownloader />
		</ToolLayout>
	);
}
