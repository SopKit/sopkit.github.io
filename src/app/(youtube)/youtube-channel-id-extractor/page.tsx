import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Free YouTube Channel ID Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Channel ID Extractor online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "youtube channel id extractor, free online tool, no signup, youtube channel id extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-channel-id-extractor",
	},
	openGraph: {
		title: "Free YouTube Channel ID Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel ID Extractor online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/youtube-channel-id-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Channel ID Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Channel ID Extractor online. Fast, secure browser-based utility with no registration. Easy to use.",
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
