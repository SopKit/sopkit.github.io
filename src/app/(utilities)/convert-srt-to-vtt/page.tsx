import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import TextCompareTool from "@/components/tools/text/TextCompareTool";

export const metadata = {
	title: "Free Convert SRT to VTT Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Convert SRT to VTT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "convert srt to vtt, free online tool, no signup, convert srt to vtt online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/convert-srt-to-vtt",
	},
	openGraph: {
		title: "Free Convert SRT to VTT Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Convert SRT to VTT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/convert-srt-to-vtt",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Convert SRT to VTT Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Convert SRT to VTT online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<TextCompareTool />
		</ToolLayout>
	);
}
