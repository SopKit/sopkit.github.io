import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExamPhotoResizer from "@/components/tools/exam/ExamPhotoResizer";

export default function ToolPage() {
	const tool = getToolByRoute("/upsc-photo-resizer-350x350");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout tool={tool}>
			<ExamPhotoResizer examName="UPSC" presetWidth={350} presetHeight={350} />
		</ToolLayout>
	);
}
