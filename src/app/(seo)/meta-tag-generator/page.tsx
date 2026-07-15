import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import MetaTagGenerator from "@/components/tools/built-ins/MetaTagGenerator";

export const metadata = {
	title: "Free Meta Tag Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Meta Tag Generator online. Optimize search presence with no signup. Try it free now.",
	keywords: "meta tag generator, free online tool, no signup, meta tag generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/meta-tag-generator",
	},
	openGraph: {
		title: "Free Meta Tag Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Meta Tag Generator online. Optimize search presence with no signup. Try it free now.",
		url: "https://sopkit.github.io/meta-tag-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Meta Tag Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Meta Tag Generator online. Optimize search presence with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/meta-tag-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<MetaTagGenerator />
		</ToolLayout>
	);
}
