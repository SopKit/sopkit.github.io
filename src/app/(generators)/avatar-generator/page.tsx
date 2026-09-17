import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import AvatarGenerator from "@/components/tools/generators/AvatarGenerator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "Avatar Generator",
	description: "Generate custom SVG and vector avatars for user profiles, forums, and developer placeholders. Choose styles, colors, and features with instant download.",
	route: "/avatar-generator",
	category: "generators",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/avatar-generator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<AvatarGenerator />
		</ToolLayout>
	);
}
