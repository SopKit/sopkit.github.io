import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Body Fat Percentage Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Body Fat Percentage Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
	keywords: "body fat percentage calculator, free online tool, no signup, body fat percentage calculator online, health, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/body-fat-calculator",
	},
	openGraph: {
		title: "Free Body Fat Percentage Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Body Fat Percentage Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
		url: "https://sopkit.github.io/body-fat-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Body Fat Percentage Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Body Fat Percentage Calculator online. Fast, secure browser-based utility with no registration. 100% free.",
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
