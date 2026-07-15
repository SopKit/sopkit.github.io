import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIImageGeneratorTool from "@/components/tools/generators/AIImageGeneratorTool";

export const metadata = {
	title: "Free AI Image Generator Online - No Signup | SopKit",
	description: "Create custom content with our free AI Image Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "ai image generator, free online tool, no signup, ai image generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ai-image-generator",
	},
	openGraph: {
		title: "Free AI Image Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Image Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/ai-image-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free AI Image Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Image Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-image-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIImageGeneratorTool />
		</ToolLayout>
	);
}
