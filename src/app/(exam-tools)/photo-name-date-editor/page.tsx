import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PhotoNameDateEditor from "@/components/tools/exam/PhotoNameDateEditor";

export const metadata = {
	title: "Free Photo Name Date Editor Online - No Signup | SopKit",
	description: "Resize and compress files with our free Photo Name Date Editor online. Safe and private browser utility for government exam portal applications. Free & secure.",
	keywords: "photo-name-date-editor, Photo Name Date Editor, photo with name and date, name date photo maker, SopKit",
	alternates: {
		canonical: "https://sopkit.github.io/photo-name-date-editor",
	},
	openGraph: {
		title: "Free Photo Name Date Editor Online - No Signup | SopKit",
		description: "Resize and compress files with our free Photo Name Date Editor online. Safe and private browser utility for government exam portal applications. Free & secure.",
		url: "https://sopkit.github.io/photo-name-date-editor",
		siteName: "SopKit",
		images: [{ url: "/og-image.jpg" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Free Photo Name Date Editor Online - No Signup | SopKit",
		description: "Resize and compress files with our free Photo Name Date Editor online. Safe and private browser utility for government exam portal applications. Free & secure.",
		images: ["/og-image.jpg"],
	},
	robots: { index: true, follow: true },
};

export default async function ToolPage() {
	const tool = getToolByRoute("/photo-name-date-editor");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<PhotoNameDateEditor />
		</ToolLayout>
	);
}
