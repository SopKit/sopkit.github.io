import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import M3u8Downloader from "@/components/tools/downloaders/M3u8Downloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free M3u8 Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free M3u8 Downloader online. Fast, secure, and private processing with no signup. No signup required.",
	keywords: "m3u8 downloader, free online tool, no signup, m3u8-downloader, free m3u8-downloader, M3u8 Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/m3u8-downloader",
	},
	openGraph: {
		title: "Free M3u8 Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free M3u8 Downloader online. Fast, secure, and private processing with no signup. No signup required.",
		url: "https://sopkit.github.io/m3u8-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free M3u8 Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free M3u8 Downloader online. Fast, secure, and private processing with no signup. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/m3u8-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<M3u8Downloader />
		</ToolLayout>
	);
}
