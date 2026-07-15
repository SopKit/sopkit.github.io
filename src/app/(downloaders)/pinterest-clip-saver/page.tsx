import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import PinterestDownloader from "@/components/tools/downloaders/PinterestDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Pinterest Clip Saver Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Pinterest Clip Saver online. Fast, secure, and private processing with no signup. Free & secure.",
	keywords: "pinterest clip saver, free online tool, no signup, pinterest-clip-saver, free pinterest-clip-saver, Pinterest Clip Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/pinterest-clip-saver",
	},
	openGraph: {
		title: "Free Pinterest Clip Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Pinterest Clip Saver online. Fast, secure, and private processing with no signup. Free & secure.",
		url: "https://sopkit.github.io/pinterest-clip-saver",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Pinterest Clip Saver Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Pinterest Clip Saver online. Fast, secure, and private processing with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/pinterest-clip-saver");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PinterestDownloader />
		</ToolLayout>
	);
}
