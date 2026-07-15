import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DownloaderEngine from "@/components/tools/downloaders/DownloaderEngine";

export const metadata = {
	title: "Free YouTube Tag Extractor Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Tag Extractor online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "youtube tag extractor, free online tool, no signup, youtube tag extractor online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-tag-extractor",
	},
	openGraph: {
		title: "Free YouTube Tag Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Tag Extractor online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/youtube-tag-extractor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Tag Extractor Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Tag Extractor online. Fast, secure browser-based utility with no registration. No signup required.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-tag-extractor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DownloaderEngine />
		</ToolLayout>
	);
}
