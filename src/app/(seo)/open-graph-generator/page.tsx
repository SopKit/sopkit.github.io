import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import OpenGraphGenerator from "@/components/tools/built-ins/OpenGraphGenerator";

export const metadata = {
	title: "Free Open Graph Generator Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Generator online. Optimize search presence with no signup. Free & secure.",
	keywords: "open graph generator, free online tool, no signup, open graph generator online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/open-graph-generator",
	},
	openGraph: {
		title: "Free Open Graph Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Generator online. Optimize search presence with no signup. Free & secure.",
		url: "https://sopkit.github.io/open-graph-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Open Graph Generator Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Open Graph Generator online. Optimize search presence with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/open-graph-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<OpenGraphGenerator />
		</ToolLayout>
	);
}
