import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "Domain Name Generator Online Free - No Signup | SopKit",
	description: "Free online Domain Name Generator. Generate short, brandable domain name ideas for your startup, SaaS, or blog instantly for free. 100% free, no signup required, and privacy-focused processing in your browser.",
	alternates: {
		canonical: "https://sopkit.github.io/domain-name-generator/",
	},
	openGraph: {
		title: "Domain Name Generator Online Free - No Signup",
		description: "Free online Domain Name Generator. Generate short, brandable domain name ideas for your startup, SaaS, or blog instantly for free. 100% free, no signup required, and privacy-focused.",
		url: "https://sopkit.github.io/domain-name-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Domain Name Generator Online Free - Fast & Secure",
		description: "Free online Domain Name Generator. Generate short, brandable domain name ideas for your startup, SaaS, or blog instantly for free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/domain-name-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<WebTools defaultTab="domain" />
		</ToolLayout>
	);
}
