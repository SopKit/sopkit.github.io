import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PassportPhotoMaker from "@/components/tools/exam/PassportPhotoMaker";


export const metadata = {
	title: "Passport Photo Maker India Online Free | SopKit",
	description: "Create passport-size photos for Indian forms with crop, background, size, and print layout options online for free. No signup, no uploads, 100% private browser-based tool.",
	alternates: {
		canonical: "https://sopkit.github.io/passport-photo-maker-india/",
	},
	openGraph: {
		title: "Passport Photo Maker India Online Free - No Signup | SopKit",
		description: "Create passport-size photos for Indian forms with crop, background, size, and print layout options online for free. No signup, no uploads, 100% private browser-",
		url: "https://sopkit.github.io/passport-photo-maker-india/",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Passport Photo Maker India Online Free - Fast & Secure",
		description: "Create passport-size photos for Indian forms with crop, background, size, and print layout options online for free. No signup, no uploads, 100% private browser-",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default function ToolPage() {
	const tool = getToolByRoute("/passport-photo-maker-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PassportPhotoMaker />
		</ToolLayout>
	);
}
