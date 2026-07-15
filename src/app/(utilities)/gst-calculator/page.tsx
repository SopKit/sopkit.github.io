import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free GST Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free GST Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "gst calculator, free online tool, no signup, gst calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/gst-calculator",
	},
	openGraph: {
		title: "Free GST Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free GST Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/gst-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free GST Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free GST Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/gst-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="gst-calculator" />
		</ToolLayout>
	);
}
