import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDownloader from "@/components/tools/downloaders/InstagramDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Instagram Content Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Instagram Content online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "save ig content, free online tool, no signup, save-ig-content, free save-ig-content, Save Ig Content online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/save-ig-content",
	},
	openGraph: {
		title: "Free Save Instagram Content Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Instagram Content online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/save-ig-content",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Instagram Content Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Instagram Content online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-ig-content");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDownloader />
		</ToolLayout>
	);
}
