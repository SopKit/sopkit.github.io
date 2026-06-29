import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";


export const metadata = {
	title: "Resume Keyword Matcher Online Free | SopKit",
	description: "Match your resume with a job description and find missing skills, keywords, tools, and role-specific terms to beat the ATS. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/resume-keyword-matcher/",
	},
	openGraph: {
		title: "Resume Keyword Matcher Online Free - No Signup | SopKit",
		description: "Match your resume with a job description and find missing skills, keywords, tools, and role-specific terms to beat the ATS. No signup, no uploads, 100% private ",
		url: "https://sopkit.github.io/resume-keyword-matcher",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Resume Keyword Matcher Online Free - Fast & Secure",
		description: "Match your resume with a job description and find missing skills, keywords, tools, and role-specific terms to beat the ATS. No signup, no uploads, 100% private ",
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
