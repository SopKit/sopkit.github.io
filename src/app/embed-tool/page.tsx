import EmbedToolClient, { type EmbedToolRecord } from "./EmbedToolClient";
import { getSearchToolRecords } from "@/lib/tools";

// Server page: resolves the slim id/route list once at build time and hands
// it to the client body, which never imports the registry JSON.
export default function EmbedToolPage() {
	const tools: EmbedToolRecord[] = getSearchToolRecords().map(({ id, route }) => ({ id, route }));
	return <EmbedToolClient tools={tools} />;
}
