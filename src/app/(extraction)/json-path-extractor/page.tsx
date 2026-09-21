import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "JSONPath Extractor",
  description: "Query nested JSON with property selectors, array indexes, wildcards, recursive descent, unions, slices, and simple comparison filters. Copy matching values and paths.",
  route: "/json-path-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/json-path-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
