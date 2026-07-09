import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Average Calculator Online Free - No Signup | SopKit",
	description: "Calculate the mean, median, mode, and range of any dataset instantly. Our free online Average Calculator helps you analyze statistics and numeric data in seconds. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/average-calculator/",
	},
	openGraph: {
		title: "Average Calculator Online Free - No Signup",
		description: "Calculate the mean, median, mode, and range of any dataset instantly. Our free online Average Calculator helps you analyze statistics and numeric data in second",
		url: "https://sopkit.github.io/average-calculator/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Average Calculator Online Free - Fast & Secure",
		description: "Calculate the mean, median, mode, and range of any dataset instantly. Our free online Average Calculator helps you analyze statistics and numeric data in second",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/average-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="average-calculator" />
		</ToolLayout>
	);
}
