import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Bulk Keyword Rank Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Bulk Keyword Rank Checker online. Optimize search presence with no signup.",
	keywords: "bulk keyword rank checker, free online tool, no signup, bulk keyword rank checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/bulk-keyword-rank-checker",
	},
	openGraph: {
		title: "Free Bulk Keyword Rank Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Bulk Keyword Rank Checker online. Optimize search presence with no signup.",
		url: "https://sopkit.github.io/bulk-keyword-rank-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Bulk Keyword Rank Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Bulk Keyword Rank Checker online. Optimize search presence with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bulk-keyword-rank-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="bulk-keyword-rank-checker" />
		</ToolLayout>
	);
}
