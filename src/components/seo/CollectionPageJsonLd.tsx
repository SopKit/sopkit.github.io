import { generateCollectionPageSchema } from "@/lib/seo";

type Props = {
	/** Route-group key understood by generateCollectionPageSchema ("image", "pdf", ...). */
	groupKey: string;
	name?: string;
	description?: string;
};

/**
 * Emits the CollectionPage JSON-LD for ONE category hub page.
 *
 * Render this only from the hub page itself (e.g. /image-tools), never from
 * a route-group layout: a layout wraps every tool page in the group, so a
 * CollectionPage there was injected into every child tool page, where it
 * described a page the crawler was not on.
 */
export default function CollectionPageJsonLd({ groupKey, name, description }: Props) {
	const schema = generateCollectionPageSchema(groupKey, { name, description });
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(schema).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
