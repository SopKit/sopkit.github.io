import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free HTTP Status Code Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free HTTP Status Code Checker online. Fast, secure browser-based utility with no registration. Try it free now.",
	keywords: "http status code checker, free online tool, no signup, http status code checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/http-status-code-checker",
	},
	openGraph: {
		title: "Free HTTP Status Code Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free HTTP Status Code Checker online. Fast, secure browser-based utility with no registration. Try it free now.",
		url: "https://sopkit.github.io/http-status-code-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free HTTP Status Code Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free HTTP Status Code Checker online. Fast, secure browser-based utility with no registration. Try it free now.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/http-status-code-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="http-status-code-checker" />
		</ToolLayout>
	);
}
