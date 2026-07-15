import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextToSpeechTool from "@/components/tools/audio/TextToSpeechTool";

export const metadata = {
	title: "Free Text to Speech Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Text to Speech online. High-quality output and private browser-based tools with no signup. Try it free now.",
	keywords: "text to speech, free online tool, no signup, text to speech online, audio, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-speech",
	},
	openGraph: {
		title: "Free Text to Speech Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Text to Speech online. High-quality output and private browser-based tools with no signup. Try it free now.",
		url: "https://sopkit.github.io/text-to-speech",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Text to Speech Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Text to Speech online. High-quality output and private browser-based tools with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/text-to-speech");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextToSpeechTool />
		</ToolLayout>
	);
}
