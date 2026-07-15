import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Free YouTube Title Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Title Extractor online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "youtube title extractor, free online tool, no signup, youtube title extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-extractor",
	},
	openGraph: {
		title: "Free YouTube Title Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Title Extractor online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/youtube-title-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Title Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Title Extractor online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
