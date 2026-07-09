import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import GuitarTunerTool from "@/components/tools/audio/GuitarTunerTool";

export const metadata = {
	title: "Guitar Tuner Online Free - No Signup | SopKit",
	description: "Free online guitar tuner. Uses your microphone to tune your guitar accurately. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/guitar-tuner/",
	},
	openGraph: {
		title: "Guitar Tuner Online Free - No Signup",
		description: "Free online guitar tuner. Uses your microphone to tune your guitar accurately. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/guitar-tuner/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Guitar Tuner Online Free - Fast & Secure",
		description: "Free online guitar tuner. Uses your microphone to tune your guitar accurately. No signup, no uploads, 100% private browser-based tool.",
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
