import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import JobMessageGenerator from "@/components/tools/impl/JobMessageGenerator";


export const metadata = {
	title: "Free Cover Letter Generator Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Cover Letter Generator online. Fast and private browser utility with no signup. Easy to use.",
	keywords: "cover letter generator, free online tool, no signup, cover letter generator online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/cover-letter-generator",
	},
	openGraph: {
		title: "Free Cover Letter Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Cover Letter Generator online. Fast and private browser utility with no signup. Easy to use.",
		url: "https://sopkit.github.io/cover-letter-generator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Cover Letter Generator Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Cover Letter Generator online. Fast and private browser utility with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/cover-letter-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<JobMessageGenerator defaultTab="cover-letter" />
		</ToolLayout>
	);
}
