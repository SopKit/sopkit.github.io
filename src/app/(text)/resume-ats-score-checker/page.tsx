import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ResumeATSChecker from "@/components/tools/impl/ResumeATSChecker";


export const metadata = {
	title: "Resume ATS Score Checker Online Free | SopKit",
	description: "Check your resume ATS score, keyword match, formatting issues, missing skills, and job-fit suggestions instantly. Free resume checker for students and professionals. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/resume-ats-score-checker/",
	},
	openGraph: {
		title: "Resume ATS Score Checker Online Free - No Signup | SopKit",
		description: "Check your resume ATS score, keyword match, formatting issues, missing skills, and job-fit suggestions instantly. Free resume checker for students and professio",
		url: "https://sopkit.github.io/resume-ats-score-checker/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Resume ATS Score Checker Online Free - Fast & Secure",
		description: "Check your resume ATS score, keyword match, formatting issues, missing skills, and job-fit suggestions instantly. Free resume checker for students and professio",
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
