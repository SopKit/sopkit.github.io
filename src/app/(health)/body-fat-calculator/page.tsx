import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Body Fat Percentage Calculator Online Free | SopKit",
	description: "Estimate your body fat percentage using US Navy or BMI methods for a clearer picture of your fitness. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/body-fat-calculator",
	},
	openGraph: {
		title: "Body Fat Percentage Calculator Online Free - No Signup | SopKit",
		description: "Estimate your body fat percentage using US Navy or BMI methods for a clearer picture of your fitness. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/body-fat-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Body Fat Percentage Calculator Online Free - Fast & Secure",
		description: "Estimate your body fat percentage using US Navy or BMI methods for a clearer picture of your fitness. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/body-fat-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
