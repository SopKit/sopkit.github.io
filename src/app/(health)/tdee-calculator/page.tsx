import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free TDEE Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free TDEE Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
	keywords: "tdee calculator, free online tool, no signup, tdee calculator online, health, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/tdee-calculator",
	},
	openGraph: {
		title: "Free TDEE Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free TDEE Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
		url: "https://sopkit.github.io/tdee-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free TDEE Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free TDEE Calculator online. Fast, secure browser-based utility with no registration. No registration needed.",
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
