import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Hosting Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Hosting Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "hosting checker, free online tool, no signup, hosting checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/hosting-checker",
	},
	openGraph: {
		title: "Free Hosting Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Hosting Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/hosting-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Hosting Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Hosting Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/hosting-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="hosting-checker" />
		</ToolLayout>
	);
}
