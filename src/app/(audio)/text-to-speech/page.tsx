import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextToSpeechTool from "@/components/tools/audio/TextToSpeechTool";

export const metadata = {
	title: "Text to Speech Online Free - No Signup | SopKit",
	description: "Convert text to natural sounding speech audio No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/text-to-speech",
	},
	openGraph: {
		title: "Text to Speech Online Free - No Signup",
		description: "Convert text to natural sounding speech audio No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/text-to-speech",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Text to Speech Online Free - Fast & Secure",
		description: "Convert text to natural sounding speech audio No signup, no uploads, 100% private browser-based tool.",
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
