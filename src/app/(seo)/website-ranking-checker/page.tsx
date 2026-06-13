import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Website Ranking Checker Online Free - No Signup | SopKit",
	description: "Free website ranking checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/website-ranking-checker",
	},
	openGraph: {
		title: "Website Ranking Checker Online Free - No Signup",
		description: "Free website ranking checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-base",
		url: "https://sopkit.github.io/website-ranking-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Website Ranking Checker Online Free - Fast & Secure",
		description: "Free website ranking checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-base",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/website-ranking-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="website-ranking-checker" />
		</ToolLayout>
	);
}
