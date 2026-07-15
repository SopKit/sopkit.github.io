import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Open Graph Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Checker online. Optimize search presence with no signup. Try it free now.",
	keywords: "open graph checker, free online tool, no signup, open graph checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/open-graph-checker",
	},
	openGraph: {
		title: "Free Open Graph Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Checker online. Optimize search presence with no signup. Try it free now.",
		url: "https://sopkit.github.io/open-graph-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Open Graph Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Checker online. Optimize search presence with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/open-graph-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="open-graph-checker" />
		</ToolLayout>
	);
}
