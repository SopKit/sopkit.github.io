import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "YouTube Channel ID Extractor Online Free - No Signup | SopKit",
	description: "Extract the unique Channel ID from any YouTube URL instantly. Perfect for developer API calls, marketing automation, and third-party tool integrations. Free and fast online tool. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-id-extractor/",
	},
	openGraph: {
		title: "YouTube Channel ID Extractor Online Free - No Signup",
		description: "Extract the unique Channel ID from any YouTube URL instantly. Perfect for developer API calls, marketing automation, and third-party tool integrations. Free and",
		url: "https://sopkit.github.io/youtube-channel-id-extractor/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "YouTube Channel ID Extractor Online Free - Fast & Secure",
		description: "Extract the unique Channel ID from any YouTube URL instantly. Perfect for developer API calls, marketing automation, and third-party tool integrations. Free and",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-channel-id-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
