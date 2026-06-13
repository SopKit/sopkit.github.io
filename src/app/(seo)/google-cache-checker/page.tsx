import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Google Cache Checker Online Free - No Signup | SopKit",
	description: "Free google cache checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/google-cache-checker",
	},
	openGraph: {
		title: "Google Cache Checker Online Free - No Signup",
		description: "Free google cache checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/google-cache-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Google Cache Checker Online Free - Fast & Secure",
		description: "Free google cache checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/google-cache-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="google-cache-checker" />
		</ToolLayout>
	);
}
