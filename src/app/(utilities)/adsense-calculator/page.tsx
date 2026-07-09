import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Adsense Calculator Online Free - No Signup | SopKit",
	description: "Free adsense calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/adsense-calculator/",
	},
	openGraph: {
		title: "Adsense Calculator Online Free - No Signup",
		description: "Free adsense calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/adsense-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Adsense Calculator Online Free - Fast & Secure",
		description: "Free adsense calculator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/adsense-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="adsense-calculator" />
		</ToolLayout>
	);
}
