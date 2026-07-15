import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import OdnoklassnikiDownloader from "@/components/tools/downloaders/OdnoklassnikiDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Odnoklassniki Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Odnoklassniki Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "odnoklassniki video downloader, free online tool, no signup, odnoklassniki-video-downloader, free odnoklassniki-video-downloader, Odnoklassniki Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/odnoklassniki-video-downloader",
	},
	openGraph: {
		title: "Free Odnoklassniki Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Odnoklassniki Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/odnoklassniki-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Odnoklassniki Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Odnoklassniki Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/odnoklassniki-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<OdnoklassnikiDownloader />
		</ToolLayout>
	);
}
