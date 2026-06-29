import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import UTMBuilderTool from "@/components/tools/utilities/UTMBuilderTool";

export const metadata = {
	title: "UTM Builder Online Free - No Signup | SopKit",
	description: "Easily build campaign URLs with UTM parameters for Google Analytics tracking. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/utm-builder/",
	},
	openGraph: {
		title: "UTM Builder Online Free - No Signup",
		description: "Easily build campaign URLs with UTM parameters for Google Analytics tracking. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/utm-builder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "UTM Builder Online Free - Fast & Secure",
		description: "Easily build campaign URLs with UTM parameters for Google Analytics tracking. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/utm-builder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<UTMBuilderTool />
		</ToolLayout>
	);
}
