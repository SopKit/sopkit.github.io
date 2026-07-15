import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Backlink Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Backlink Checker online. Optimize search presence with no signup. Try it free now.",
	keywords: "backlink checker, free online tool, no signup, backlink checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/backlink-checker",
	},
	openGraph: {
		title: "Free Backlink Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Backlink Checker online. Optimize search presence with no signup. Try it free now.",
		url: "https://sopkit.github.io/backlink-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Backlink Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Backlink Checker online. Optimize search presence with no signup. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/backlink-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="backlink-checker" />
		</ToolLayout>
	);
}
