import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ScreenResolutionTool from "@/components/tools/built-ins/ScreenResolutionTool";

export const metadata = {
	title: "Free Screen Resolution Simulator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Screen Resolution Simulator online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "screen resolution simulator, free online tool, no signup, screen resolution simulator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/screen-resolution-simulator",
	},
	openGraph: {
		title: "Free Screen Resolution Simulator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Screen Resolution Simulator online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/screen-resolution-simulator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Screen Resolution Simulator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Screen Resolution Simulator online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/screen-resolution-simulator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ScreenResolutionTool />
		</ToolLayout>
	);
}
