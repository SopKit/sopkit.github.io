import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Bulk Keyword Rank Checker Online Free - No Signup | SopKit",
	description: "Check Google rankings for multiple keywords instantly with our free bulk keyword rank checker. Track keyword positions, monitor competitors, and get accurate SERP data. No signup required. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/bulk-keyword-rank-checker",
	},
	openGraph: {
		title: "Bulk Keyword Rank Checker Online Free - No Signup",
		description: "Check Google rankings for multiple keywords instantly with our free bulk keyword rank checker. Track keyword positions, monitor competitors, and get accurate SE",
		url: "https://sopkit.github.io/bulk-keyword-rank-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Bulk Keyword Rank Checker Online Free - Fast & Secure",
		description: "Check Google rankings for multiple keywords instantly with our free bulk keyword rank checker. Track keyword positions, monitor competitors, and get accurate SE",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/bulk-keyword-rank-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<BuiltInSafeHttp toolId="bulk-keyword-rank-checker" />
		</ToolLayout>
	);
}
