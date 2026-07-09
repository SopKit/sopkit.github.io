import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Complete SEO Audit Tool Online Free - No Signup | SopKit",
	description: "Comprehensive SEO audit tool that analyzes technical SEO, on-page optimization, content quality, and provides actionable recommendations. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/seo-audit-tool/",
	},
	openGraph: {
		title: "Complete SEO Audit Tool Online Free - No Signup",
		description: "Comprehensive SEO audit tool that analyzes technical SEO, on-page optimization, content quality, and provides actionable recommendations. No signup, no uploads,",
		url: "https://sopkit.github.io/seo-audit-tool/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Complete SEO Audit Tool Online Free - Fast & Secure",
		description: "Comprehensive SEO audit tool that analyzes technical SEO, on-page optimization, content quality, and provides actionable recommendations. No signup, no uploads,",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/seo-audit-tool");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="seo-audit-tool" />
		</ToolLayout>
	);
}
