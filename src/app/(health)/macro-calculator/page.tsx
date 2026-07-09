import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Macro Calculator Online Free | SopKit",
	description: "Calculate your ideal macronutrient ratio (protein, carbs, fats) for weight loss, gain, or maintenance. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/macro-calculator/",
	},
	openGraph: {
		title: "Macro Calculator Online Free - No Signup | SopKit",
		description: "Calculate your ideal macronutrient ratio (protein, carbs, fats) for weight loss, gain, or maintenance. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/macro-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Macro Calculator Online Free - Fast & Secure",
		description: "Calculate your ideal macronutrient ratio (protein, carbs, fats) for weight loss, gain, or maintenance. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/macro-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
