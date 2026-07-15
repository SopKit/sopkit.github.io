import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Page Size Checker Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Page Size Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "page size checker, free online tool, no signup, page size checker online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/page-size-checker",
	},
	openGraph: {
		title: "Free Page Size Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Page Size Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/page-size-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Page Size Checker Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Page Size Checker online. Fast, secure browser-based utility with no registration. No registration needed.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/page-size-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="page-size-checker" />
		</ToolLayout>
	);
}
