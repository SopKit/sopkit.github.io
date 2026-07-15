import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";

export const metadata = {
	title: "Free String Length Calculator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free String Length Calculator online. Fast and private browser utility with no signup. 100% free.",
	keywords: "string length calculator, free online tool, no signup, string length calculator online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/string-length-calculator",
	},
	openGraph: {
		title: "Free String Length Calculator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free String Length Calculator online. Fast and private browser utility with no signup. 100% free.",
		url: "https://sopkit.github.io/string-length-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free String Length Calculator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free String Length Calculator online. Fast and private browser utility with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/string-length-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
