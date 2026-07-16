import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
	title: "Student Calculators - Attendance, SGPA, CGPA and Marks | SopKit",
	description: "Free student calculators for 75% attendance, how many classes you can miss, SGPA, CGPA, CGPA to percentage, and required final marks.",
	alternates: { canonical: "https://sopkit.github.io/student-calculators/" },
};

export default function StudentCalculatorsHub() {
	return (
		<HubPage
			title="Student Calculators"
			description="Practical calculators for attendance shortage, grade planning, CGPA conversion, and final exam marks. Useful for college and engineering students."
			route="/student-calculators"
			tools={getAllTools().filter(t => ["gpa-to-4-scale-converter","cgpa-to-percentage-calculator","cgpa-calculator","sgpa-calculator","percentage-calculator","marks-needed-calculator","attendance-shortage-calculator","75-attendance-calculator"].includes(t.id))}
			badge="Student Calculators"
		/>
	);
}
