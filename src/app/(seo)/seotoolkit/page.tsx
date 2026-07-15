import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SeoToolkit from "@/components/tools/seo/SeoToolkit";

export const metadata = {
	title: "Free SEO Toolkit Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Toolkit online. Optimize search presence with no signup. No registration needed.",
	keywords: "seo toolkit, free online tool, no signup, seo toolkit online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/seotoolkit",
	},
	openGraph: {
		title: "Free SEO Toolkit Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Toolkit online. Optimize search presence with no signup. No registration needed.",
		url: "https://sopkit.github.io/seotoolkit",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free SEO Toolkit Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free SEO Toolkit online. Optimize search presence with no signup. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/seotoolkit");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SeoToolkit />
		</ToolLayout>
	);
}
