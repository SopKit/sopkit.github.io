import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIVoiceGeneratorTool from "@/components/tools/generators/AIVoiceGeneratorTool";

export const metadata = {
	title: "Free AI Voice Generator Online - No Signup | SopKit",
	description: "Create custom content with our free AI Voice Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
	keywords: "ai voice generator, free online tool, no signup, ai voice generator online, generators, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ai-voice-generator",
	},
	openGraph: {
		title: "Free AI Voice Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Voice Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		url: "https://sopkit.github.io/ai-voice-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free AI Voice Generator Online - No Signup | SopKit",
		description: "Create custom content with our free AI Voice Generator online. Generate high-quality outputs instantly with no registration required. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ai-voice-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AIVoiceGeneratorTool />
		</ToolLayout>
	);
}
