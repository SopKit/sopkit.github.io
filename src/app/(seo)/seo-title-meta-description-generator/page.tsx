import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "SEO Title & Meta Description Generator Free Online - No Signup | SopKit",
	description: "Free SEO Title & Meta Description Generator online. Generate SEO-friendly page titles and meta descriptions for blogs, tools, and landing pages to improve search CTR.",
	alternates: {
		canonical: "https://sopkit.github.io/seo-title-meta-description-generator",
	},
	openGraph: {
		title: "SEO Title & Meta Description Generator Online Free - No Signup",
		description: "Free SEO Title & Meta Description Generator online. Generate SEO-friendly page titles and meta descriptions for blogs, tools, and landing pages.",
		url: "https://sopkit.github.io/seo-title-meta-description-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SEO Title & Meta Description Generator Online Free - Fast & Secure",
		description: "Free SEO Title & Meta Description Generator online. Generate SEO-friendly page titles and meta descriptions for blogs, tools, and landing pages.",
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
		<ToolLayout tool={tool}>
			<WebTools defaultTab="seo" />
		</ToolLayout>
	);
}
