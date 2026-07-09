import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Gratuity Calculator (India) Online Free | SopKit",
	description: "Estimate your gratuity amount based on your last drawn salary and years of service in India. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/gratuity-calculator",
	},
	openGraph: {
		title: "Gratuity Calculator (India) Online Free - No Signup | SopKit",
		description: "Estimate your gratuity amount based on your last drawn salary and years of service in India. No signup, no uploads, 100% private browser-based tool.",
		url: "https://sopkit.github.io/gratuity-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Gratuity Calculator (India) Online Free - Fast & Secure",
		description: "Estimate your gratuity amount based on your last drawn salary and years of service in India. No signup, no uploads, 100% private browser-based tool.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/gratuity-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
