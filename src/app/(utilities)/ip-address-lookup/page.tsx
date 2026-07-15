import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IPLocationFinderTool from "@/components/tools/utilities/IPLocationFinderTool";

export const metadata = {
	title: "Free IP Address Lookup Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free IP Address Lookup online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "ip address lookup, free online tool, no signup, ip address lookup online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ip-address-lookup",
	},
	openGraph: {
		title: "Free IP Address Lookup Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free IP Address Lookup online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/ip-address-lookup",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free IP Address Lookup Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free IP Address Lookup online. Fast, secure browser-based utility with no registration. No registration needed.",
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
