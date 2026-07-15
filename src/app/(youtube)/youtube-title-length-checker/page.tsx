import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeTitleLengthCheckerTool from "@/components/tools/youtube/YouTubeTitleLengthCheckerTool";

export const metadata = {
	title: "Free YouTube Title Length Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Title Length Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "youtube title length checker, free online tool, no signup, youtube title length checker online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-title-length-checker",
	},
	openGraph: {
		title: "Free YouTube Title Length Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Title Length Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/youtube-title-length-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Title Length Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Title Length Checker online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-title-length-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeTitleLengthCheckerTool />
		</ToolLayout>
	);
}
