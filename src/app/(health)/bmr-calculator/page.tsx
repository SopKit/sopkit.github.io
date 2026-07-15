import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free BMR Calculator (Basal Metabolic Rate) Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free BMR Calculator (Basal Metabolic Rate) online. Fast, secure browser-based utility with no registration.",
	keywords: "bmr calculator (basal metabolic rate), free online tool, no signup, bmr calculator (basal metabolic rate) online, health, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/bmr-calculator",
	},
	openGraph: {
		title: "Free BMR Calculator (Basal Metabolic Rate) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free BMR Calculator (Basal Metabolic Rate) online. Fast, secure browser-based utility with no registration.",
		url: "https://sopkit.github.io/bmr-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free BMR Calculator (Basal Metabolic Rate) Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free BMR Calculator (Basal Metabolic Rate) online. Fast, secure browser-based utility with no registration.",
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
