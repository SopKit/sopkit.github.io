import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "Regex Extractor",
  description: "Run custom regular expressions against text, inspect capture groups and character positions, use common extraction presets, and export structured matches.",
  route: "/regex-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/regex-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
