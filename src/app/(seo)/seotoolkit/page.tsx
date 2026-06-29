import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import SeoToolkit from "@/components/tools/utilities/QrGeneratorPremium";

export const metadata = {
	title: "SEO Toolkit Online Free - No Signup | SopKit",
	description: "All-in-one SEO audit and analysis tool. 27+ checks. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/seotoolkit/",
	},
	openGraph: {
		title: "SEO Toolkit Online Free - No Signup",
		description: "All-in-one SEO audit and analysis tool. 27+ checks. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/seotoolkit",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SEO Toolkit Online Free - Fast & Secure",
		description: "All-in-one SEO audit and analysis tool. 27+ checks. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/seotoolkit");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<SeoToolkit />
		</ToolLayout>
	);
}
