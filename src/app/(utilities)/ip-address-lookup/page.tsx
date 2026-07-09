import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IPLocationFinderTool from "@/components/tools/utilities/IPLocationFinderTool";

export const metadata = {
	title: "IP Address Lookup Online Free - No Signup | SopKit",
	description: "Free ip address lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ip-address-lookup/",
	},
	openGraph: {
		title: "IP Address Lookup Online Free - No Signup",
		description: "Free ip address lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool",
		url: "https://sopkit.github.io/ip-address-lookup/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "IP Address Lookup Online Free - Fast & Secure",
		description: "Free ip address lookup tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/ip-address-lookup");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IPLocationFinderTool />
		</ToolLayout>
	);
}
