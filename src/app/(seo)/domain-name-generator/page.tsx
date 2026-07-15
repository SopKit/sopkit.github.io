import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import WebTools from "@/components/tools/impl/WebTools";

export const metadata = {
	title: "Free Domain Name Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Domain Name Generator online. Optimize search presence with no signup. Easy to use.",
	keywords: "domain name generator, free online tool, no signup, domain name generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/domain-name-generator",
	},
	openGraph: {
		title: "Free Domain Name Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Domain Name Generator online. Optimize search presence with no signup. Easy to use.",
		url: "https://sopkit.github.io/domain-name-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Domain Name Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Domain Name Generator online. Optimize search presence with no signup. Easy to use.",
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
