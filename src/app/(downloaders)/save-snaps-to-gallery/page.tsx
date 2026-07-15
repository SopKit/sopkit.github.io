import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Snaps To Gallery Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Snaps To Gallery online. Fast, secure, and private processing with no signup. Easy to use.",
	keywords: "save snaps to gallery, free online tool, no signup, save-snaps-to-gallery, free save-snaps-to-gallery, Save Snaps To Gallery online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/save-snaps-to-gallery",
	},
	openGraph: {
		title: "Free Save Snaps To Gallery Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Snaps To Gallery online. Fast, secure, and private processing with no signup. Easy to use.",
		url: "https://sopkit.github.io/save-snaps-to-gallery",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Snaps To Gallery Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Snaps To Gallery online. Fast, secure, and private processing with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-snaps-to-gallery");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SnapchatDownloader />
		</ToolLayout>
	);
}
