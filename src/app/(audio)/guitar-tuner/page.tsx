import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import GuitarTunerTool from "@/components/tools/audio/GuitarTunerTool";

export const metadata = {
	title: "Free Guitar Tuner Online - No Signup | SopKit",
	description: "Process, edit, and convert audio files with our free Guitar Tuner online. High-quality output and private browser-based tools with no signup. Try it free now.",
	keywords: "guitar tuner, free online tool, no signup, guitar tuner online, audio, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/guitar-tuner",
	},
	openGraph: {
		title: "Free Guitar Tuner Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Guitar Tuner online. High-quality output and private browser-based tools with no signup. Try it free now.",
		url: "https://sopkit.github.io/guitar-tuner",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Guitar Tuner Online - No Signup | SopKit",
		description: "Process, edit, and convert audio files with our free Guitar Tuner online. High-quality output and private browser-based tools with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/guitar-tuner");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<GuitarTunerTool />
		</ToolLayout>
	);
}
