import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDownloader from "@/components/tools/downloaders/InstagramDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Videos Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Videos Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "instagram videos downloader, free online tool, no signup, instagram-videos-downloader, free instagram-videos-downloader, Instagram Videos Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-videos-downloader",
	},
	openGraph: {
		title: "Free Instagram Videos Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Videos Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/instagram-videos-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Videos Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Videos Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-videos-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDownloader />
		</ToolLayout>
	);
}
