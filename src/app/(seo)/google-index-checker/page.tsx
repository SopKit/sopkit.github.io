import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Google Index Checker Online - No Signup | SopKit",
	description: "Audit websites, analyze search rankings, and generate schemas with our free Google Index Checker online. Optimize search presence with no signup. Free & secure.",
	keywords: "google index checker, free online tool, no signup, google index checker online, seo, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/google-index-checker",
	},
	openGraph: {
		title: "Free Google Index Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Google Index Checker online. Optimize search presence with no signup. Free & secure.",
		url: "https://sopkit.github.io/google-index-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Google Index Checker Online - No Signup | SopKit",
		description: "Audit websites, analyze search rankings, and generate schemas with our free Google Index Checker online. Optimize search presence with no signup. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/google-index-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="google-index-checker" />
		</ToolLayout>
	);
}
