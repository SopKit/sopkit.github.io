import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramReelDownloader from "@/components/tools/downloaders/InstagramReelDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Insta Reels Saver Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Insta Reels Saver online. Fast, secure, and private processing with no signup. Try it free now.",
	keywords: "insta reels saver, free online tool, no signup, insta-reels-saver, free insta-reels-saver, Insta Reels Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/insta-reels-saver",
	},
	openGraph: {
		title: "Free Insta Reels Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Insta Reels Saver online. Fast, secure, and private processing with no signup. Try it free now.",
		url: "https://sopkit.github.io/insta-reels-saver",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Insta Reels Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Insta Reels Saver online. Fast, secure, and private processing with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/insta-reels-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramReelDownloader />
		</ToolLayout>
	);
}
