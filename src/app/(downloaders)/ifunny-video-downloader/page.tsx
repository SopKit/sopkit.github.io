import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IfunnyDownloader from "@/components/tools/downloaders/IfunnyDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Ifunny Video Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Ifunny Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
	keywords: "ifunny video downloader, free online tool, no signup, ifunny-video-downloader, free ifunny-video-downloader, Ifunny Video Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ifunny-video-downloader",
	},
	openGraph: {
		title: "Free Ifunny Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ifunny Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		url: "https://sopkit.github.io/ifunny-video-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Ifunny Video Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Ifunny Video Downloader online. Fast, secure, and private processing with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ifunny-video-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IfunnyDownloader />
		</ToolLayout>
	);
}
