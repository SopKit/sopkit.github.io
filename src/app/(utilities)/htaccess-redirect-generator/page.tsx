import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import HtaccessGenerator from "@/components/tools/built-ins/HtaccessGenerator";

export const metadata = {
	title: "Free Htaccess Redirect Generator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Htaccess Redirect Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "htaccess redirect generator, free online tool, no signup, htaccess redirect generator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/htaccess-redirect-generator",
	},
	openGraph: {
		title: "Free Htaccess Redirect Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Htaccess Redirect Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/htaccess-redirect-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Htaccess Redirect Generator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Htaccess Redirect Generator online. Fast, secure browser-based utility with no registration. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/htaccess-redirect-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<HtaccessGenerator />
		</ToolLayout>
	);
}
