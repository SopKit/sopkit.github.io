import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import LinkedinDownloader from "@/components/tools/downloaders/LinkedinDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Linkedin Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Linkedin Video Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "linkedin video downloader, download linkedin videos, linkedin video saver, linkedin to mp4, free tool, SopKit, linkedin-video-downloader, free linkedin-video-downloader, linkedin video downloader online, online downloader, free media saver, video downloader",
	alternates: {
		canonical: "https://sopkit.github.io/linkedin-video-downloader",
	},
	openGraph: {
		title: "Free Linkedin Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Linkedin Video Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/linkedin-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Linkedin Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Linkedin Video Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/linkedin-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LinkedinDownloader />
		</ToolLayout>
	);
}
