import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PassportPhotoMaker from "@/components/tools/exam/PassportPhotoMaker";


export const metadata = {
	title: "Free Passport Photo Maker India Online - No Signup | SopKit",
	description: "Edit, convert, and compress images with our free Passport Photo Maker India online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
	keywords: "passport photo maker india, free online tool, no signup, passport photo maker india online, image, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/passport-photo-maker-india",
	},
	openGraph: {
		title: "Free Passport Photo Maker India Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Passport Photo Maker India online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
		url: "https://sopkit.github.io/passport-photo-maker-india",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Passport Photo Maker India Online - No Signup | SopKit",
		description: "Edit, convert, and compress images with our free Passport Photo Maker India online. Crop, resize, and optimize photos in your browser with no signup. 100% free.",
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
