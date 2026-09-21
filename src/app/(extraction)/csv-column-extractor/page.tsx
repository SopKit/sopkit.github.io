import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "CSV Column Extractor",
  description: "Load CSV locally, preview headers, choose only the columns you need, remove duplicate rows, sort records, and export clean CSV data.",
  route: "/csv-column-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/csv-column-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
