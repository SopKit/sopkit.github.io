import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "Free Internship Application Message Generator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Internship Application Message Generator online. Fast and private browser utility with no...",
	keywords: "internship application message generator, free online tool, no signup, internship application message generator online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/internship-message-generator",
	},
	openGraph: {
		title: "Free Internship Application Message Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Internship Application Message Generator online. Fast and private browser utility with no...",
		url: "https://sopkit.github.io/internship-message-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Internship Application Message Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Internship Application Message Generator online. Fast and private browser utility with no...",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/internship-message-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="internship-message" />
		</ToolLayout>
	);
}
