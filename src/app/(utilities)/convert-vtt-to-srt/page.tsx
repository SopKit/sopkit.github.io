import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextCompareTool from "@/components/tools/text/TextCompareTool";

export const metadata = {
	title: "Convert VTT to SRT Online Free - No Signup | SopKit",
	description: "Convert subtitle files from VTT to SRT format instantly. Our free online tool makes it easy to use web captions with traditional desktop video players. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/convert-vtt-to-srt",
	},
	openGraph: {
		title: "Convert VTT to SRT Online Free - No Signup",
		description: "Convert subtitle files from VTT to SRT format instantly. Our free online tool makes it easy to use web captions with traditional desktop video players. No signu",
		url: "https://sopkit.github.io/convert-vtt-to-srt",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Convert VTT to SRT Online Free - Fast & Secure",
		description: "Convert subtitle files from VTT to SRT format instantly. Our free online tool makes it easy to use web captions with traditional desktop video players. No signu",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/convert-vtt-to-srt");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<TextCompareTool />
		</ToolLayout>
	);
}
