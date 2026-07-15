import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import FacebookDownloader from "@/components/tools/downloaders/FacebookDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Facebook Video Saver Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Facebook Video Saver online. Fast, secure, and private processing with no signup. Free & secure.",
	keywords: "fb video saver, facebook video saver, save facebook videos, fb video downloader, free tool, SopKit, fb-video-saver, free fb-video-saver, fb video saver online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/fb-video-saver",
	},
	openGraph: {
		title: "Free Facebook Video Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Video Saver online. Fast, secure, and private processing with no signup. Free & secure.",
		url: "https://sopkit.github.io/fb-video-saver",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Facebook Video Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Facebook Video Saver online. Fast, secure, and private processing with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/fb-video-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FacebookDownloader />
		</ToolLayout>
	);
}
