import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import VkontakteDownloader from "@/components/tools/downloaders/VkontakteDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Vkontakte Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Vkontakte Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "vkontakte video downloader, free online tool, no signup, vkontakte-video-downloader, free vkontakte-video-downloader, Vkontakte Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/vkontakte-video-downloader",
	},
	openGraph: {
		title: "Free Vkontakte Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Vkontakte Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/vkontakte-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Vkontakte Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Vkontakte Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/vkontakte-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<VkontakteDownloader />
		</ToolLayout>
	);
}
