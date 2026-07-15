import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Server Status Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Server Status Checker online. Fast, secure browser-based utility with no registration. No signup required.",
	keywords: "server status checker, free online tool, no signup, server status checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/server-status-checker",
	},
	openGraph: {
		title: "Free Server Status Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Server Status Checker online. Fast, secure browser-based utility with no registration. No signup required.",
		url: "https://sopkit.github.io/server-status-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Server Status Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Server Status Checker online. Fast, secure browser-based utility with no registration. No signup required.",
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
