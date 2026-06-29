import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import DnsLookupTool from "@/components/tools/built-ins/DnsLookupTool";

export const metadata = {
	title: "DNS Records Checker Online Free - No Signup | SopKit",
	description: "Retrieve all DNS records (A, MX, TXT, CNAME) for any domain instantly. Our free online tool helps you troubleshoot website hosting and email configuration issues. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/dns-records-checker/",
	},
	openGraph: {
		title: "DNS Records Checker Online Free - No Signup",
		description: "Retrieve all DNS records (A, MX, TXT, CNAME) for any domain instantly. Our free online tool helps you troubleshoot website hosting and email configuration issue",
		url: "https://sopkit.github.io/dns-records-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "DNS Records Checker Online Free - Fast & Secure",
		description: "Retrieve all DNS records (A, MX, TXT, CNAME) for any domain instantly. Our free online tool helps you troubleshoot website hosting and email configuration issue",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/dns-records-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<DnsLookupTool />
		</ToolLayout>
	);
}
