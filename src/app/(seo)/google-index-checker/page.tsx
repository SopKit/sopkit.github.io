import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Google Index Checker Online Free - No Signup | SopKit",
	description: "Free google index checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/google-index-checker",
	},
	openGraph: {
		title: "Google Index Checker Online Free - No Signup",
		description: "Free google index checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		url: "https://sopkit.github.io/google-index-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Google Index Checker Online Free - Fast & Secure",
		description: "Free google index checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based t",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/google-index-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="google-index-checker" />
		</ToolLayout>
	);
}
