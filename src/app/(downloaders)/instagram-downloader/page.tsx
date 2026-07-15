import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDownloader from "@/components/tools/downloaders/InstagramDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
	keywords: "instagram downloader, download instagram videos, instagram reels downloader, instagram photo downloader, free online tool, SopKit, instagram-downloader, free instagram-downloader, instagram downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-downloader",
	},
	openGraph: {
		title: "Free Instagram Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
		url: "https://sopkit.github.io/instagram-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Downloader online. Fast, secure, and private processing with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDownloader />
		</ToolLayout>
	);
}
