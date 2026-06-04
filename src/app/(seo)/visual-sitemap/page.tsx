import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Visual Sitemap Generator Online Free - No Signup | SopKit",
	description: "Visualize your website's sitemap structure instantly. Enter your XML sitemap URL to generate a dynamic tree view of your site hierarchy. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/visual-sitemap",
	},
	openGraph: {
		title: "Visual Sitemap Generator Online Free - No Signup",
		description: "Visualize your website's sitemap structure instantly. Enter your XML sitemap URL to generate a dynamic tree view of your site hierarchy. No signup, no uploads, ",
		url: "https://sopkit.github.io/visual-sitemap",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Visual Sitemap Generator Online Free - Fast & Secure",
		description: "Visualize your website's sitemap structure instantly. Enter your XML sitemap URL to generate a dynamic tree view of your site hierarchy. No signup, no uploads, ",
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
		<ToolLayout tool={tool}>
			<BuiltInSafeHttp toolId="visual-sitemap" />
		</ToolLayout>
	);
}
