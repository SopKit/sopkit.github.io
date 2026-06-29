import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KeywordTool from "@/components/tools/seo/KeywordTool";

export const metadata = {
	title: "Keyword Density Checker Online Free - No Signup | SopKit",
	description: "Free keyword density checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/keyword-density-checker/",
	},
	openGraph: {
		title: "Keyword Density Checker Online Free - No Signup",
		description: "Free keyword density checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-base",
		url: "https://sopkit.github.io/keyword-density-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Keyword Density Checker Online Free - Fast & Secure",
		description: "Free keyword density checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-base",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/keyword-density-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<KeywordTool />
		</ToolLayout>
	);
}
