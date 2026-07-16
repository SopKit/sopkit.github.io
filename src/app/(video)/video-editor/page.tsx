import ToolLayout from "@/components/tools/shared/ToolLayout";
import VideoEditorTool from "@/components/tools/video/VideoEditorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Video Editor",
	description: "Private Video Editor: privately process videos entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/video-editor",
	category: "video",
});

export default async function ToolPage() {
	const tool = { id: "video-editor", name: "Video Editor", description: "Trim, cut, and edit video clips directly in your browser. Our free Video Editor requires no software installation and supports all major formats.", route: "/video-editor", category: "video" };
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.name, description: tool.description, url: "https://sopkit.github.io/video-editor/", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
			<ToolLayout breadcrumbs={[]} tool={tool}><VideoEditorTool /></ToolLayout>
		</>
	);
}
