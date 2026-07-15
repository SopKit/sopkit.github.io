import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";


export const metadata = {
	title: "Free Resume Keyword Matcher Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Resume Keyword Matcher online. Fast and private browser utility with no signup. Easy to use.",
	keywords: "resume keyword matcher, free online tool, no signup, resume keyword matcher online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/resume-keyword-matcher",
	},
	openGraph: {
		title: "Free Resume Keyword Matcher Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Resume Keyword Matcher online. Fast and private browser utility with no signup. Easy to use.",
		url: "https://sopkit.github.io/resume-keyword-matcher",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Resume Keyword Matcher Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Resume Keyword Matcher online. Fast and private browser utility with no signup. Easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/resume-keyword-matcher");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResumeATSChecker />
		</ToolLayout>
	);
}
