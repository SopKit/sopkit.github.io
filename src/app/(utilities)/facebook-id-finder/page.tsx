import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Facebook ID Finder Online Free - No Signup | SopKit",
	description: "Free facebook id finder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/facebook-id-finder",
	},
	openGraph: {
		title: "Facebook ID Finder Online Free - No Signup",
		description: "Free facebook id finder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		url: "https://sopkit.github.io/facebook-id-finder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Facebook ID Finder Online Free - Fast & Secure",
		description: "Free facebook id finder tool to process your data instantly with privacy-friendly browser-based workflows. No signup, no uploads, 100% private browser-based too",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/facebook-id-finder");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="facebook-id-finder" />
		</ToolLayout>
	);
}
