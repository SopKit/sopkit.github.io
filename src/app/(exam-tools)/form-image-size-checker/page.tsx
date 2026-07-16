import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import FormImageSizeChecker from "@/components/tools/exam/FormImageSizeChecker";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Form Image Size Checker",
	description: "Private Form Image Size Checker: privately validate exam documents entirely in your browser. 100% client-side sandbox — no server uploads, no AI training, no data collection. Unlike tools that sell your data, SopKit processes everything locally. Free, instant, and secure.",
	route: "/form-image-size-checker",
	category: "exam-tools",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/form-image-size-checker");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<FormImageSizeChecker />
		</ToolLayout>
	);
}
