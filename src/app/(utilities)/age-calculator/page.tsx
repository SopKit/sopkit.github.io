import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import BuiltInCalculators from "@/components/tools/built-ins/BuiltInCalculators";

export const metadata = {
	title: "Free Age Calculator Online - No Signup | SopKit",
	description: "Solve everyday digital tasks instantly using our free Age Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
	keywords: "age calculator, free online tool, no signup, age calculator online, utilities, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/age-calculator",
	},
	openGraph: {
		title: "Free Age Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Age Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		url: "https://sopkit.github.io/age-calculator",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Age Calculator Online - No Signup | SopKit",
		description: "Solve everyday digital tasks instantly using our free Age Calculator online. Fast, secure browser-based utility with no registration. 100% free and easy to use.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/age-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<BuiltInCalculators kind="age-calculator" />
		</ToolLayout>
	);
}
