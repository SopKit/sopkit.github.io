import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";


export const metadata = {
	title: "Free Resume ATS Score Checker Online - No Signup | SopKit",
	description: "Format, clean, sort, and analyze text files instantly with our free Resume ATS Score Checker online. Fast and private browser utility with no signup. 100% free.",
	keywords: "resume ats score checker, free online tool, no signup, resume ats score checker online, text, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/resume-ats-score-checker",
	},
	openGraph: {
		title: "Free Resume ATS Score Checker Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Resume ATS Score Checker online. Fast and private browser utility with no signup. 100% free.",
		url: "https://sopkit.github.io/resume-ats-score-checker",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Resume ATS Score Checker Online - No Signup | SopKit",
		description: "Format, clean, sort, and analyze text files instantly with our free Resume ATS Score Checker online. Fast and private browser utility with no signup. 100% free.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/resume-ats-score-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ResumeATSChecker />
		</ToolLayout>
	);
}
