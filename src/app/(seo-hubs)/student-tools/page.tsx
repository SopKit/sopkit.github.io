import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
	title: "Student Tools - Attendance, Grades and Study Utilities | SopKit",
	description: "Free student tools for attendance planning, SGPA, CGPA, CGPA to percentage, required marks, and exam image uploads.",
	alternates: { canonical: "https://sopkit.github.io/student-tools/" },
};

export default function StudentToolsHub() {
	return (
		<HubPage
			title="Student Tools"
			description="A focused student utility hub for attendance planning, grade calculations, and form-upload tasks that students repeatedly search for during semesters and admissions."
			route="/student-tools"
		tools={getAllTools().filter(t => ["json-formatter","json-to-typescript","json-to-csv-converter","markdown-to-html","text-compare","case-converter","word-counter","slug-generator"].includes(t.id))}			guideTitle="Student Tool Roadmap"
			guidePoints={[
				"Use attendance calculators before shortage notices become urgent.",
				"Use SGPA and CGPA calculators for planning, not official transcript replacement.",
				"Use exam image tools when admission or exam portals reject photos by KB size.",
				"Link from broad student pages into exact-use pages such as 75 Attendance Calculator and Compress Image to 20KB.",
			]}
			faqs={[
				{ question: "Which student tools should I use first?", answer: "Start with the 75 Attendance Calculator, SGPA Calculator, CGPA Calculator, and exact exam image tools for form uploads." },
				{ question: "Are the calculators official?", answer: "No. They are planning tools. Use your college or exam body's official formula for final submissions." },
				{ question: "Why include exam image tools in student tools?", answer: "Students often need both academic calculators and upload-ready photos/signatures during exam and admission windows." },
			]}
		/>
	);
}
