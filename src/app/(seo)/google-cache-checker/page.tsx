import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Google Cache Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Google Cache Checker online. Optimize search presence with no signup. Free & secure.",
	keywords: "google cache checker, free online tool, no signup, google cache checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/google-cache-checker",
	},
	openGraph: {
		title: "Free Google Cache Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Google Cache Checker online. Optimize search presence with no signup. Free & secure.",
		url: "https://sopkit.github.io/google-cache-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Google Cache Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Google Cache Checker online. Optimize search presence with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/google-cache-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="google-cache-checker" />
		</ToolLayout>
	);
}
