import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Free YouTube Description Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Description Extractor online. Fast, secure browser-based utility with no registration. 100% free.",
	keywords: "youtube description extractor, free online tool, no signup, youtube description extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-description-extractor",
	},
	openGraph: {
		title: "Free YouTube Description Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Description Extractor online. Fast, secure browser-based utility with no registration. 100% free.",
		url: "https://sopkit.github.io/youtube-description-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Description Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Description Extractor online. Fast, secure browser-based utility with no registration. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-description-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
