import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "Free SEO Title & Meta Description Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Title & Meta Description Generator online. Optimize search presence with no s...",
	keywords: "seo title & meta description generator, free online tool, no signup, seo title & meta description generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/seo-title-meta-description-generator",
	},
	openGraph: {
		title: "Free SEO Title & Meta Description Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Title & Meta Description Generator online. Optimize search presence with no s...",
		url: "https://sopkit.github.io/seo-title-meta-description-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SEO Title & Meta Description Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Title & Meta Description Generator online. Optimize search presence with no s...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/seo-title-meta-description-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WebTools defaultTab="seo" />
		</ToolLayout>
	);
}
