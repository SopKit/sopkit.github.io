import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "Domain Extractor",
  description: "Extract hostnames from URLs and email addresses, remove common www prefixes, deduplicate domains, sort them, and export a clean domain inventory.",
  route: "/domain-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/domain-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
