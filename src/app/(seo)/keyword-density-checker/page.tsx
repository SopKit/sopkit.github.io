import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import KeywordTool from "@/components/tools/seo/KeywordTool";

export const metadata = {
	title: "Free Keyword Density Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Keyword Density Checker online. Optimize search presence with no signup. 100% free.",
	keywords: "keyword density checker, free online tool, no signup, keyword density checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/keyword-density-checker",
	},
	openGraph: {
		title: "Free Keyword Density Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Keyword Density Checker online. Optimize search presence with no signup. 100% free.",
		url: "https://sopkit.github.io/keyword-density-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Keyword Density Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Keyword Density Checker online. Optimize search presence with no signup. 100% free.",
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
