import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Ideal Body Weight Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Ideal Body Weight Calculator online. Fast, secure browser-based utility with no registration. Easy to use.",
	keywords: "ideal body weight calculator, free online tool, no signup, ideal body weight calculator online, health, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/ideal-body-weight-calculator",
	},
	openGraph: {
		title: "Free Ideal Body Weight Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Ideal Body Weight Calculator online. Fast, secure browser-based utility with no registration. Easy to use.",
		url: "https://sopkit.github.io/ideal-body-weight-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Ideal Body Weight Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Ideal Body Weight Calculator online. Fast, secure browser-based utility with no registration. Easy to use.",
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
