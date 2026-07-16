import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import ExifReaderTool from "@/components/tools/image/ExifReaderTool";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "EXIF Reader",
	description: "Private EXIF Reader: privately extract images entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/exif-reader",
	category: "image",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/exif-reader");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<ExifReaderTool />
		</ToolLayout>
	);
}
