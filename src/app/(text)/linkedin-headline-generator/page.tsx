import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "Free LinkedIn Headline Generator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free LinkedIn Headline Generator online. Fast and private browser utility with no signup.",
	keywords: "linkedin headline generator, free online tool, no signup, linkedin headline generator online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/linkedin-headline-generator",
	},
	openGraph: {
		title: "Free LinkedIn Headline Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free LinkedIn Headline Generator online. Fast and private browser utility with no signup.",
		url: "https://sopkit.github.io/linkedin-headline-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free LinkedIn Headline Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free LinkedIn Headline Generator online. Fast and private browser utility with no signup.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/linkedin-headline-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="linkedin-headline" />
		</ToolLayout>
	);
}
