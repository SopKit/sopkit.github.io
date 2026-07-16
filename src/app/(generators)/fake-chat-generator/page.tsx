import ToolLayout from "@/components/tools/shared/ToolLayout";
import FakeChatGeneratorTool from "@/components/tools/generators/FakeChatGeneratorTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Fake Chat Generator",
	description: "Privacy-friendly, 100% client-side fake chat generation. Run secure local processing in your browser with zero file uploads and no data selling. No AI training on your data. Fast, safe, and free forever.",
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
