import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "Free Website Cost Calculator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Website Cost Calculator online. Optimize search presence with no signup. 100% free.",
	keywords: "website cost calculator, free online tool, no signup, website cost calculator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/website-cost-calculator",
	},
	openGraph: {
		title: "Free Website Cost Calculator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Website Cost Calculator online. Optimize search presence with no signup. 100% free.",
		url: "https://sopkit.github.io/website-cost-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Website Cost Calculator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Website Cost Calculator online. Optimize search presence with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/website-cost-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WebTools defaultTab="cost" />
		</ToolLayout>
	);
}
