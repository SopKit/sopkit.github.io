import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import LegalTemplateGenerator from "@/components/tools/built-ins/LegalTemplateGenerator";

export const metadata = {
	title: "Disclaimer Generator Online Free - No Signup | SopKit",
	description: "Create professional disclaimers for your website or app instantly. Our free online generator helps you protect your business and comply with legal requirements. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/disclaimer-generator/",
	},
	openGraph: {
		title: "Disclaimer Generator Online Free - No Signup",
		description: "Create professional disclaimers for your website or app instantly. Our free online generator helps you protect your business and comply with legal requirements.",
		url: "https://sopkit.github.io/disclaimer-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Disclaimer Generator Online Free - Fast & Secure",
		description: "Create professional disclaimers for your website or app instantly. Our free online generator helps you protect your business and comply with legal requirements.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/disclaimer-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<LegalTemplateGenerator />
		</ToolLayout>
	);
}
