import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HtaccessGenerator from "@/components/tools/built-ins/HtaccessGenerator";

export const metadata = {
	title: "Htaccess Redirect Generator Online Free - No Signup | SopKit",
	description: "Free htaccess redirect generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/htaccess-redirect-generator/",
	},
	openGraph: {
		title: "Htaccess Redirect Generator Online Free - No Signup",
		description: "Free htaccess redirect generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-",
		url: "https://sopkit.github.io/htaccess-redirect-generator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Htaccess Redirect Generator Online Free - Fast & Secure",
		description: "Free htaccess redirect generator tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/htaccess-redirect-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HtaccessGenerator />
		</ToolLayout>
	);
}
