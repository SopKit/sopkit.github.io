import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DomainToIPTool from "@/components/tools/built-ins/DomainToIPTool";

export const metadata = {
	title: "Domain to IP Converter Online Free - No Signup | SopKit",
	description: "Find the IP address of any website instantly. Our free online tool helps you identify server locations and troubleshoot network connectivity issues. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/domain-to-ip-converter/",
	},
	openGraph: {
		title: "Domain to IP Converter Online Free - No Signup",
		description: "Find the IP address of any website instantly. Our free online tool helps you identify server locations and troubleshoot network connectivity issues. No signup, ",
		url: "https://sopkit.github.io/domain-to-ip-converter/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Domain to IP Converter Online Free - Fast & Secure",
		description: "Find the IP address of any website instantly. Our free online tool helps you identify server locations and troubleshoot network connectivity issues. No signup, ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/domain-to-ip-converter");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DomainToIPTool />
		</ToolLayout>
	);
}
