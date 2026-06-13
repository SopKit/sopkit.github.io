import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "CPM Calculator Online Free - No Signup | SopKit",
	description: "Calculate Cost Per Mille (CPM) for your advertising campaigns instantly. Our free online tool helps marketers and creators understand their ad spend and reach efficiency. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/cpm-calculator",
	},
	openGraph: {
		title: "CPM Calculator Online Free - No Signup",
		description: "Calculate Cost Per Mille (CPM) for your advertising campaigns instantly. Our free online tool helps marketers and creators understand their ad spend and reach e",
		url: "https://sopkit.github.io/cpm-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "CPM Calculator Online Free - Fast & Secure",
		description: "Calculate Cost Per Mille (CPM) for your advertising campaigns instantly. Our free online tool helps marketers and creators understand their ad spend and reach e",
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
