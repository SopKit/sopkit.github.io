import { notFound } from "next/navigation";
import ToolLayout from "@/components/tools/shared/ToolLayout";
import { getToolByRoute } from "@/lib/tools";
import IpSubnetCalculator from "@/components/tools/developer/IpSubnetCalculator";
import { generateToolMetadata } from "@/lib/seo";

export const metadata = generateToolMetadata({
	name: "IP Subnet Calculator",
	description: "Calculate IPv4 subnet masks, CIDR network ranges, usable host IPs, broadcast addresses, and wildcard masks instantly with 100% local browser execution.",
	route: "/ip-subnet-calculator",
	category: "developer",
});

export default async function ToolPage() {
	const tool = getToolByRoute("/ip-subnet-calculator");

	if (!tool) {
		return notFound();
	}

	return (
		<ToolLayout breadcrumbs={[]} tool={tool}>
			<IpSubnetCalculator />
		</ToolLayout>
	);
}
