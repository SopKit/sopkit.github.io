import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDPDownloader from "@/components/tools/downloaders/InstagramDPDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Instagram Image Downloader Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Instagram Image Downloader online. Fast, secure, and private processing with no signup.",
	keywords: "instagram image downloader, free online tool, no signup, instagram-image-downloader, free instagram-image-downloader, Instagram Image Downloader online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/instagram-image-downloader",
	},
	openGraph: {
		title: "Free Instagram Image Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Image Downloader online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/instagram-image-downloader",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Instagram Image Downloader Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Instagram Image Downloader online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/instagram-image-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDPDownloader />
		</ToolLayout>
	);
}
