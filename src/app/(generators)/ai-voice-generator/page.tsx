import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AIVoiceGeneratorTool from "@/components/tools/generators/AIVoiceGeneratorTool";

export const metadata = {
	title: "AI Voice Generator Online Free - No Signup | SopKit",
	description: "Convert text to natural-sounding AI voices instantly. Our free text-to-speech tool offers multiple languages and accents for professional voiceovers, accessibility, and creative projects. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ai-voice-generator",
	},
	openGraph: {
		title: "AI Voice Generator Online Free - No Signup",
		description: "Convert text to natural-sounding AI voices instantly. Our free text-to-speech tool offers multiple languages and accents for professional voiceovers, accessibil",
		url: "https://sopkit.github.io/ai-voice-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Voice Generator Online Free - Fast & Secure",
		description: "Convert text to natural-sounding AI voices instantly. Our free text-to-speech tool offers multiple languages and accents for professional voiceovers, accessibil",
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
