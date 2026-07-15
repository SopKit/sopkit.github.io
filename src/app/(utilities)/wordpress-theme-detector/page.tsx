import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free WordPress Theme Detector Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free WordPress Theme Detector online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "wordpress theme detector, free online tool, no signup, wordpress theme detector online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/wordpress-theme-detector",
	},
	openGraph: {
		title: "Free WordPress Theme Detector Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free WordPress Theme Detector online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/wordpress-theme-detector",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free WordPress Theme Detector Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free WordPress Theme Detector online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/wordpress-theme-detector");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="wordpress-theme-detector" />
		</ToolLayout>
	);
}
