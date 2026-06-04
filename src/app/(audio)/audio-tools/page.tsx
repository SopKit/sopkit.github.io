import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AudioToolsHub from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "Audio Tools Online Free - No Signup | SopKit",
	description: "Compress and convert audio files between formats No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/audio-tools",
	},
	openGraph: {
		title: "Audio Tools Online Free - No Signup",
		description: "Compress and convert audio files between formats No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/audio-tools",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Audio Tools Online Free - Fast & Secure",
		description: "Compress and convert audio files between formats No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/audio-tools");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<AudioToolsHub />
		</ToolLayout>
	);
}
