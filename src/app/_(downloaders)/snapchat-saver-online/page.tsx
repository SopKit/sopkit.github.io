import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import SnapchatDownloader from "@/components/tools/downloaders/SnapchatDownloader";
import { getToolByRoute } from "@/lib/tools";

export const metadata = {
	title: "Snapchat Saver Online - No Signup | SopKit",
	description: "Save and download media files from Snapchat with our free Snapchat Saver online. High-speed downloading with no signup needed.",
	keywords: "snapchat saver online, free online tool, no signup, snapchat-saver-online, Snapchat Saver online, video downloader, free download tool, online media saver, no signup download, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/snapchat-saver-online/",
	},
	openGraph: {
		title: "Snapchat Saver Online - No Signup | SopKit",
		description: "Save and download media files from Snapchat with our free Snapchat Saver online. High-speed downloading with no signup needed.",
		url: "https://sopkit.github.io/snapchat-saver-online",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Snapchat Saver Online - Fast & Secure",
		description: "Save and download media files from Snapchat with our free Snapchat Saver online. High-speed downloading with no signup needed.",
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
