import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "HTML Metadata Extractor",
  description: "Inspect HTML title, description, canonical, robots, Open Graph, Twitter cards, favicon, language, theme color, and heading content in a structured list.",
  route: "/html-meta-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/html-meta-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
