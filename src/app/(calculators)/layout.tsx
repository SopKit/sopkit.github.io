import { buildCanonicalUrl } from "@/seo/canonical";
export const metadata = {
	title: "Free Online Calculators — Finance & Math Tools | SopKit",
	description:
		"Free online calculators for finance, health, math, and daily life. BMI calculator, loan calculator, percentage calculator, and more. No signup, instant results.",
	openGraph: {
		title: "Free Online Calculators — Finance & Math Tools | SopKit",
		description:
			"Free online calculators for finance, health, math, and daily life. BMI calculator, loan calculator, percentage calculator, and more. No signup, instant results.",
		url: buildCanonicalUrl("/calculators"),
		siteName: "SopKit",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Free Online Calculators Collection",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		site: "@sopkit",
		title: "Free Online Calculators — Finance & Math Tools | SopKit",
		description:
			"Free online calculators for finance, health, math, and daily life. BMI calculator, loan calculator, percentage calculator, and more. No signup, instant results.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function CalculatorsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
			<main className="flex-1">{children}</main>
		</div>
	);
}
