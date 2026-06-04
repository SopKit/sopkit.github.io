import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import PassportPhotoMaker from "@/components/tools/exam/PassportPhotoMaker";

export default function ToolPage() {
	const tool = getToolByRoute("/passport-photo-maker-india");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<PassportPhotoMaker />
		</ToolLayout>
	);
}
