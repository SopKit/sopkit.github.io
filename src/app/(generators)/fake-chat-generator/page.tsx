import ToolLayout from "@/components/tools/shared/ToolLayout";
import FakeChatGeneratorTool from "@/components/tools/generators/FakeChatGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Fake Chat Generator",
	description: "Private Fake Chat: privately generate content entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/fake-chat-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = { id: "fake-chat-generator", name: "Fake Chat Generator", description: "Create realistic fake chat screenshots for social media, presentations, or fun. Our free Fake Chat Generator supports multiple messaging app styles.", route: "/fake-chat-generator", category: "generators" };
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.name, description: tool.description, url: "https://sopkit.github.io/fake-chat-generator/", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
			<ToolLayout breadcrumbs={[]} tool={tool}><FakeChatGeneratorTool /></ToolLayout>
		</>
	);
}
