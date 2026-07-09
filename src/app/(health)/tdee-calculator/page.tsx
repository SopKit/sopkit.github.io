import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "TDEE Calculator Online Free | SopKit",
	description: "Calculate your Total Daily Energy Expenditure (TDEE) based on your activity level and fitness goals. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/tdee-calculator",
	},
	openGraph: {
		title: "TDEE Calculator Online Free - No Signup | SopKit",
		description: "Calculate your Total Daily Energy Expenditure (TDEE) based on your activity level and fitness goals. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/tdee-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "TDEE Calculator Online Free - Fast & Secure",
		description: "Calculate your Total Daily Energy Expenditure (TDEE) based on your activity level and fitness goals. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/tdee-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
