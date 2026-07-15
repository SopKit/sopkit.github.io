import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SoundcloudDownloader from "@/components/tools/downloaders/SoundcloudDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Soundcloud Video Downloader Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Soundcloud Video Downloader online. High-quality output and private browser-based tools with no signup.",
	keywords: "soundcloud video downloader, free online tool, no signup, soundcloud-video-downloader, free soundcloud-video-downloader, Soundcloud Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/soundcloud-video-downloader",
	},
	openGraph: {
		title: "Free Soundcloud Video Downloader Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Soundcloud Video Downloader online. High-quality output and private browser-based tools with no signup.",
		url: "https://sopkit.github.io/soundcloud-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Soundcloud Video Downloader Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Soundcloud Video Downloader online. High-quality output and private browser-based tools with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/soundcloud-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SoundcloudDownloader />
		</ToolLayout>
	);
}
