import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PinterestDownloader from "@/components/tools/downloaders/PinterestDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Pinterest Gif Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Pinterest Gif Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "pinterest gif downloader, free online tool, no signup, pinterest-gif-downloader, free pinterest-gif-downloader, Pinterest Gif Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pinterest-gif-downloader",
	},
	openGraph: {
		title: "Free Pinterest Gif Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Pinterest Gif Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/pinterest-gif-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Pinterest Gif Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Pinterest Gif Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pinterest-gif-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PinterestDownloader />
		</ToolLayout>
	);
}
