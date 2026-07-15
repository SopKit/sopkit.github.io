import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Visual Sitemap Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Visual Sitemap Generator online. Optimize search presence with no signup. 100% free.",
	keywords: "visual sitemap generator, free online tool, no signup, visual sitemap generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/visual-sitemap",
	},
	openGraph: {
		title: "Free Visual Sitemap Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Visual Sitemap Generator online. Optimize search presence with no signup. 100% free.",
		url: "https://sopkit.github.io/visual-sitemap",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Visual Sitemap Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Visual Sitemap Generator online. Optimize search presence with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/visual-sitemap");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="visual-sitemap" />
		</ToolLayout>
	);
}
