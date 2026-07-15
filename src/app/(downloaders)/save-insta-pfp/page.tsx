import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import InstagramDPDownloader from "@/components/tools/downloaders/InstagramDPDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Free Save Insta Profile Picture Online - No Signup | SopKit",
	description: "Download, convert, and edit video files instantly with our free Save Insta Profile Picture online. Fast, secure, and private processing with no signup.",
	keywords: "save insta pfp, free online tool, no signup, save-insta-pfp, free save-insta-pfp, Save Insta Pfp online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/save-insta-pfp",
	},
	openGraph: {
		title: "Free Save Insta Profile Picture Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Insta Profile Picture online. Fast, secure, and private processing with no signup.",
		url: "https://sopkit.github.io/save-insta-pfp",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Save Insta Profile Picture Online - No Signup | SopKit",
		description: "Download, convert, and edit video files instantly with our free Save Insta Profile Picture online. Fast, secure, and private processing with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/save-insta-pfp");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<InstagramDPDownloader />
		</ToolLayout>
	);
}
