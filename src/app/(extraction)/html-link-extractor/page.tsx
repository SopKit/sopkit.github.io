import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "HTML Link Extractor",
  description: "Parse raw HTML and extract anchor URLs, visible text, rel attributes, target values, and optionally resolved relative links using a base URL.",
  route: "/html-link-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/html-link-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
