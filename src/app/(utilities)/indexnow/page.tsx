import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free IndexNow Submitter Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free IndexNow Submitter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "indexnow submitter, free online tool, no signup, indexnow submitter online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/indexnow",
	},
	openGraph: {
		title: "Free IndexNow Submitter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free IndexNow Submitter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/indexnow",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free IndexNow Submitter Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free IndexNow Submitter online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/indexnow");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInSafeHttp toolId="indexnow-submitter" />
		</ToolLayout>
	);
}
