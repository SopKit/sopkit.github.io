import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import YouTubeMoneyCalculatorTool from "@/components/tools/youtube/YouTubeMoneyCalculatorTool";

export const metadata = {
	title: "Free YouTube Money Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free YouTube Money Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "youtube money calculator, free online tool, no signup, youtube money calculator online, youtube, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/youtube-money-calculator",
	},
	openGraph: {
		title: "Free YouTube Money Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Money Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/youtube-money-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free YouTube Money Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free YouTube Money Calculator online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/youtube-money-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<YouTubeMoneyCalculatorTool />
		</ToolLayout>
	);
}
