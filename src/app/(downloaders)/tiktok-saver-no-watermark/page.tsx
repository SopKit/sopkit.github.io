import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TikTokDownloader from "@/components/tools/downloaders/TikTokDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Tiktok Saver No Watermark Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Tiktok Saver No Watermark online. Fast, secure, and private processing with no signup.",
	keywords: "tiktok saver no watermark, free online tool, no signup, tiktok-saver-no-watermark, free tiktok-saver-no-watermark, Tiktok Saver No Watermark online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tiktok-saver-no-watermark",
	},
	openGraph: {
		title: "Free Tiktok Saver No Watermark Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Saver No Watermark online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/tiktok-saver-no-watermark",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Tiktok Saver No Watermark Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Tiktok Saver No Watermark online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/tiktok-saver-no-watermark");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TikTokDownloader />
		</ToolLayout>
	);
}
