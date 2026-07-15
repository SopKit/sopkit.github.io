import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import TwitterDownloader from "@/components/tools/downloaders/TwitterDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Twitter Videos Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Twitter Videos online. Fast, secure, and private processing with no signup. Free & secure.",
	keywords: "save twitter videos, free online tool, no signup, save-twitter-videos, free save-twitter-videos, Save Twitter Videos online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/save-twitter-videos",
	},
	openGraph: {
		title: "Free Save Twitter Videos Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Twitter Videos online. Fast, secure, and private processing with no signup. Free & secure.",
		url: "https://sopkit.github.io/save-twitter-videos",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Twitter Videos Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Twitter Videos online. Fast, secure, and private processing with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-twitter-videos");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TwitterDownloader />
		</ToolLayout>
	);
}
