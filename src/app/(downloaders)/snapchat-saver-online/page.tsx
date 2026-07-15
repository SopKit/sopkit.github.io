import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Snapchat Saver Online Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Snapchat Saver Online online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "snapchat saver online, free online tool, no signup, snapchat-saver-online, Snapchat Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/snapchat-saver-online",
	},
	openGraph: {
		title: "Free Snapchat Saver Online Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Snapchat Saver Online online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/snapchat-saver-online",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Snapchat Saver Online Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Snapchat Saver Online online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/snapchat-saver-online");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SnapchatDownloader />
		</ToolLayout>
	);
}
