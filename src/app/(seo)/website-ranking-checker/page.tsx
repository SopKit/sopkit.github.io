import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Website Ranking Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Website Ranking Checker online. Optimize search presence with no signup. 100% free.",
	keywords: "website ranking checker, free online tool, no signup, website ranking checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/website-ranking-checker",
	},
	openGraph: {
		title: "Free Website Ranking Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Website Ranking Checker online. Optimize search presence with no signup. 100% free.",
		url: "https://sopkit.github.io/website-ranking-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Website Ranking Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Website Ranking Checker online. Optimize search presence with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/website-ranking-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="website-ranking-checker" />
		</ToolLayout>
	);
}
