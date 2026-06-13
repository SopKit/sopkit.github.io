import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "Website Cost Calculator Online Free - No Signup | SopKit",
	description: "Free Website Cost Calculator online. Estimate how much a website may cost based on pages, design quality, and features like ecommerce instantly for free.",
	alternates: {
		canonical: "https://sopkit.github.io/website-cost-calculator",
	},
	openGraph: {
		title: "Website Cost Calculator Online Free - No Signup",
		description: "Free Website Cost Calculator online. Estimate how much a website may cost based on pages, design quality, and features like ecommerce instantly for free.",
		url: "https://sopkit.github.io/website-cost-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Website Cost Calculator Online Free - Fast & Secure",
		description: "Free Website Cost Calculator online. Estimate how much a website may cost based on pages, design quality, and features like ecommerce instantly for free.",
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
