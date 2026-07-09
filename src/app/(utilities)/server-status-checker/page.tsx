import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Server Status Checker Online Free - No Signup | SopKit",
	description: "Free server status checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/server-status-checker/",
	},
	openGraph: {
		title: "Server Status Checker Online Free - No Signup",
		description: "Free server status checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		url: "https://sopkit.github.io/server-status-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Server Status Checker Online Free - Fast & Secure",
		description: "Free server status checker tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based ",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/server-status-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="server-status-checker" />
		</ToolLayout>
	);
}
