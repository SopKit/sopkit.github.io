import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInSafeHttp from "@/components/tools/built-ins/BuiltInSafeHttp";

export const metadata = {
	title: "Free Facebook ID Finder Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Facebook ID Finder online. Fast, secure browser-based utility with no registration. 100% free and secure.",
	keywords: "facebook id finder, free online tool, no signup, facebook id finder online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/facebook-id-finder",
	},
	openGraph: {
		title: "Free Facebook ID Finder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Facebook ID Finder online. Fast, secure browser-based utility with no registration. 100% free and secure.",
		url: "https://sopkit.github.io/facebook-id-finder",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Facebook ID Finder Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Facebook ID Finder online. Fast, secure browser-based utility with no registration. 100% free and secure.",
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
