import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIImageGeneratorTool from "@/components/tools/generators/AIImageGeneratorTool";

export const metadata = {
	title: "AI Image Generator Online Free - No Signup | SopKit",
	description: "Generate stunning AI images from text prompts instantly. Create photorealistic photos, digital art, anime, and illustrations for free. No signup required, unlimited generations, and 100% private browser-based processing. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ai-image-generator/",
	},
	openGraph: {
		title: "AI Image Generator Online Free - No Signup",
		description: "Generate stunning AI images from text prompts instantly. Create photorealistic photos, digital art, anime, and illustrations for free. No signup required, unlim",
		url: "https://sopkit.github.io/ai-image-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Image Generator Online Free - Fast & Secure",
		description: "Generate stunning AI images from text prompts instantly. Create photorealistic photos, digital art, anime, and illustrations for free. No signup required, unlim",
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
