import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import RedditDownloader from "@/components/tools/downloaders/RedditDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Reddit Media Saver Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Reddit Media Saver online. Fast, secure, and private processing with no signup. Try it free now.",
	keywords: "reddit media saver, free online tool, no signup, reddit-media-saver, free reddit-media-saver, Reddit Media Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/reddit-media-saver",
	},
	openGraph: {
		title: "Free Reddit Media Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Reddit Media Saver online. Fast, secure, and private processing with no signup. Try it free now.",
		url: "https://sopkit.github.io/reddit-media-saver",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Reddit Media Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Reddit Media Saver online. Fast, secure, and private processing with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/reddit-media-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<RedditDownloader />
		</ToolLayout>
	);
}
