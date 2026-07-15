import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextCompareTool from "@/components/tools/text/TextCompareTool";

export const metadata = {
	title: "Free Convert VTT to SRT Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Convert VTT to SRT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "convert vtt to srt, free online tool, no signup, convert vtt to srt online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/convert-vtt-to-srt",
	},
	openGraph: {
		title: "Free Convert VTT to SRT Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Convert VTT to SRT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/convert-vtt-to-srt",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Convert VTT to SRT Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Convert VTT to SRT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextCompareTool />
		</ToolLayout>
	);
}
