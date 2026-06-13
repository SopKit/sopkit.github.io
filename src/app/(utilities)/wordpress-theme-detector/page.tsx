import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "WordPress Theme Detector Online Free - No Signup | SopKit",
	description: "Free wordpress theme detector tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/wordpress-theme-detector",
	},
	openGraph: {
		title: "WordPress Theme Detector Online Free - No Signup",
		description: "Free wordpress theme detector tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
		url: "https://sopkit.github.io/wordpress-theme-detector",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "WordPress Theme Detector Online Free - Fast & Secure",
		description: "Free wordpress theme detector tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-bas",
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
