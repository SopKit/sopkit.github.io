import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free CPM Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free CPM Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "cpm calculator, free online tool, no signup, cpm calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/cpm-calculator",
	},
	openGraph: {
		title: "Free CPM Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free CPM Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/cpm-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free CPM Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free CPM Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/cpm-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="cpm-calculator" />
		</ToolLayout>
	);
}
