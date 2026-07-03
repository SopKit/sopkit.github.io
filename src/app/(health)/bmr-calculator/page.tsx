import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "BMR Calculator (Basal Metabolic Rate) Online Free | SopKit",
	description: "Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/bmr-calculator",
	},
	openGraph: {
		title: "BMR Calculator (Basal Metabolic Rate) Online Free - No Signup | SopKit",
		description: "Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/bmr-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "BMR Calculator (Basal Metabolic Rate) Online Free - Fast & Secure",
		description: "Calculate your Basal Metabolic Rate (BMR) to understand how many calories your body burns at rest. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/bmr-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
