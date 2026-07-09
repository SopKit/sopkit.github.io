import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Domain Age Checker Online Free - No Signup | SopKit",
	description: "Find the exact age of any domain name instantly. Our free online tool helps with SEO research, domain appraisal, and competitive analysis. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/domain-age-checker/",
	},
	openGraph: {
		title: "Domain Age Checker Online Free - No Signup",
		description: "Find the exact age of any domain name instantly. Our free online tool helps with SEO research, domain appraisal, and competitive analysis. No signup, no uploads",
		url: "https://sopkit.github.io/domain-age-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Domain Age Checker Online Free - Fast & Secure",
		description: "Find the exact age of any domain name instantly. Our free online tool helps with SEO research, domain appraisal, and competitive analysis. No signup, no uploads",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-age-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="domain-age-checker" />
		</ToolLayout>
	);
}
