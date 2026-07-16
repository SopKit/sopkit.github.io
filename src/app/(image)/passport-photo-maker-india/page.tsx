import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PassportPhotoMaker from "@/components/tools/exam/PassportPhotoMaker";
import { generateToolMetadata } from "@/lib/seo";


export const metadata = generateToolMetadata({
	name: "Passport Photo Maker India",
	description: "Private Passport Photo Maker India: privately generate images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/passport-photo-maker-india",
	category: "image",
});

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
