import { SITE_URL } from "@/constants/config";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { SimpleTeraboxPlayer } from "@/components/tools/video/SimpleTeraboxPlayer";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Terabox Video Player - Open Share Links Online",
	description: "Paste a Terabox share link to open the file in an embedded third-party player, with a new-tab option and copyable embed code. Nothing is converted or edited.",
	alternates: {
		canonical: `${SITE_URL}/terabox-downloader`,
	},
	openGraph: {
		title: "Terabox Video Player - Open Share Links Online",
		description: "Paste a Terabox share link to open the file in an embedded third-party player, with a new-tab option and copyable embed code. Nothing is converted or edited.",
		url: `${SITE_URL}/terabox-downloader`,
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Terabox Video Player - Open Share Links Online",
		description: "Paste a Terabox share link to open the file in an embedded third-party player, with a new-tab option and copyable embed code. Nothing is converted or edited.",
		images: ["/og-image.jpg"],
	},
	// Downloader-style pages stay out of the index (src/data/monetization.ts).
	robots: { index: false, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/terabox-downloader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SimpleTeraboxPlayer />
		</ToolLayout>
	);
}
