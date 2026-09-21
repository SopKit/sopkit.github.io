import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import IntentToolDispatcher from "@/components/tools/shared/IntentToolDispatcher";
import { getToolByRoute } from "@/lib/tools";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
  name: "IP Address Extractor",
  description: "Extract IPv4 and IPv6 addresses from server logs, headers, diagnostics, and text. Classify matches and export a compact network inventory locally.",
  route: "/ip-address-extractor",
  category: "extraction",
});

export default function ToolPage() {
  const tool = getToolByRoute("/ip-address-extractor");
  if (!tool) return notFound();
  return <ToolLayout breadcrumbs={[]} tool={tool}><IntentToolDispatcher toolId={tool.id} /></ToolLayout>;
}
