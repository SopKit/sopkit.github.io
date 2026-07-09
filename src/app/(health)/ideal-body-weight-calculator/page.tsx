import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Ideal Body Weight Calculator Online Free | SopKit",
	description: "Determine your healthy weight range based on your height, age, and gender using standard formulas. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/ideal-body-weight-calculator",
	},
	openGraph: {
		title: "Ideal Body Weight Calculator Online Free - No Signup | SopKit",
		description: "Determine your healthy weight range based on your height, age, and gender using standard formulas. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/ideal-body-weight-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Ideal Body Weight Calculator Online Free - Fast & Secure",
		description: "Determine your healthy weight range based on your height, age, and gender using standard formulas. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/ideal-body-weight-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
