import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = {
	title: "Student Calculators - Attendance, SGPA, CGPA and Marks | SopKit",
	description: "Free student calculators for 75% attendance, how many classes you can miss, SGPA, CGPA, CGPA to percentage, and required final marks.",
	alternates: { canonical: "https://sopkit.space/student-calculators/" },
};

export default function StudentCalculatorsHub() {
	return (
		<HubPage
			title="Student Calculators"
			description="Practical calculators for attendance shortage, grade planning, CGPA conversion, and final exam marks. Useful for college and engineering students."
			route="/student-calculators"
			tools={getAllTools().filter(t => ["gpa-to-4-scale-converter","cgpa-to-percentage-calculator","cgpa-calculator","sgpa-calculator","percentage-calculator","marks-needed-calculator","attendance-shortage-calculator","75-attendance-calculator"].includes(t.id))}
			badge="Student Calculators"
			guideTitle="How to Plan Your Semester"
			guidePoints={[
				"Check your current attendance first — most Indian universities require 75% to sit for end-semester exams.",
				"Use the shortage calculator to find exactly how many more classes you can miss without falling below the cutoff.",
				"Convert SGPA to CGPA after each semester to track whether you are on course for your target placement cutoff.",
				"Before finals, run the marks-needed calculator so every study hour goes to the subject that moves your grade most.",
			]}
			faqs={[
				{ question: "How much attendance is required in college?", answer: "Most Indian universities and autonomous colleges require a minimum of 75% attendance in each subject to be eligible for semester exams. Some allow condonation down to 65% on medical grounds with a fee." },
				{ question: "How do I calculate how many classes I can bunk?", answer: "Enter classes held so far and classes attended into the 75% attendance calculator. It tells you exactly how many more you can miss while staying above the cutoff, assuming different totals for the rest of the semester." },
				{ question: "How is CGPA calculated from SGPA?", answer: "CGPA is the credit-weighted average of all your semester SGPAs. Multiply each SGPA by that semester's total credits, add them up, and divide by total credits across semesters." },
				{ question: "How do I convert CGPA to percentage?", answer: "Most universities use CGPA × 9.5 (CBSE-style) or a custom multiplier like × 10. Select your university's formula in the converter — recruiters usually ask for the equivalent percentage on application forms." },
			]}
		/>
	);
}
