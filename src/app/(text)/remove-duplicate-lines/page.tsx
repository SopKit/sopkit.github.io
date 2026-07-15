import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";


export const metadata = {
	title: "Free Remove Duplicate Lines Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Remove Duplicate Lines online. Fast and private browser utility with no signup. Easy to use.",
	keywords: "remove duplicate lines, free online tool, no signup, remove duplicate lines online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/remove-duplicate-lines",
	},
	openGraph: {
		title: "Free Remove Duplicate Lines Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Remove Duplicate Lines online. Fast and private browser utility with no signup. Easy to use.",
		url: "https://sopkit.github.io/remove-duplicate-lines",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Remove Duplicate Lines Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Remove Duplicate Lines online. Fast and private browser utility with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/remove-duplicate-lines");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IntentToolDispatcher toolId={tool.id} />
		</ToolLayout>
	);
}
