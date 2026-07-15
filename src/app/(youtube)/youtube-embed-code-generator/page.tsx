import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeEmbedGeneratorTool from "@/components/tools/youtube/YouTubeEmbedGeneratorTool";

export const metadata = {
	title: "Free YouTube Embed Code Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Embed Code Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "youtube embed code generator, free online tool, no signup, youtube embed code generator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-embed-code-generator",
	},
	openGraph: {
		title: "Free YouTube Embed Code Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Embed Code Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/youtube-embed-code-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Embed Code Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Embed Code Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-embed-code-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeEmbedGeneratorTool />
		</ToolLayout>
	);
}
