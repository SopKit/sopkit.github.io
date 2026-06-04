import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextCompareTool from "@/components/tools/text/TextCompareTool";

export const metadata = {
	title: "Convert SRT to VTT Online Free - No Signup | SopKit",
	description: "Convert subtitle files from SRT to VTT format instantly. Our free online tool ensures compatibility with web-based video players and modern streaming platforms. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/convert-srt-to-vtt",
	},
	openGraph: {
		title: "Convert SRT to VTT Online Free - No Signup",
		description: "Convert subtitle files from SRT to VTT format instantly. Our free online tool ensures compatibility with web-based video players and modern streaming platforms.",
		url: "https://sopkit.github.io/convert-srt-to-vtt",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Convert SRT to VTT Online Free - Fast & Secure",
		description: "Convert subtitle files from SRT to VTT format instantly. Our free online tool ensures compatibility with web-based video players and modern streaming platforms.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/convert-srt-to-vtt");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<TextCompareTool />
		</ToolLayout>
	);
}
