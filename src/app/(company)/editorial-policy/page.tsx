import Link from "next/link";
import { SITE_CONFIG, SITE_URL } from "@/constants/config";
import ToolLayout from "@/components/tools/shared/ToolLayout";

export const metadata = {
  title: "Editorial Policy — How SopKit Creates and Maintains Content",
  description: "Learn how SopKit creates, reviews, updates, and corrects tool documentation and technical guides.",
  alternates: { canonical: `${SITE_URL}/editorial-policy/` },
  robots: { index: true, follow: true },
};

export default function EditorialPolicyPage() {
  const tool = {
    id: "editorial-policy",
    name: "Editorial Policy",
    description: "How SopKit creates, reviews, updates, and corrects tool documentation and technical guides.",
    route: "/editorial-policy",
    category: "company",
  };

  return (
    <ToolLayout breadcrumbs={[]} tool={tool} relatedTools={[]}>
      <article className="mx-auto max-w-4xl space-y-10 py-6">
        <section className="rounded-2xl border border-border/50 bg-card/50 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Content standards</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">How SopKit publishes useful information</h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            SopKit publishes documentation for browser tools, technical workflows, calculators, and practical how-to guides.
            The goal is to explain what a tool does, how it works, what it requires, and where its limits are rather than
            publish pages only to target search queries.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Content creation</h2>
          <p className="leading-7 text-muted-foreground">
            Tool pages are based on the actual tool registry and the functionality exposed by the product. Guides are written
            around a concrete user task and should include relevant steps, examples, limitations, and related workflows.
            Search visibility is a secondary goal; usefulness comes first.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Accuracy and review</h2>
          <p className="leading-7 text-muted-foreground">
            Technical details are checked against the current product implementation when a page is changed. Requirements
            that can change over time, such as third-party service limits, application-form rules, or browser behavior, should
            be verified against the relevant official source before acting on them.
          </p>
          <p className="leading-7 text-muted-foreground">
            When a correction is identified, SopKit updates the affected page rather than silently preserving an outdated claim.
            Publication and modification dates are used to make the lifecycle of guides visible to readers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Privacy and tool disclosures</h2>
          <p className="leading-7 text-muted-foreground">
            SopKit distinguishes local browser processing from workflows that use network or external services. Tool pages
            should not promise that information stays local when the implementation requires an external request.
            Advertising and analytics are optional services controlled through the site's privacy choices.
          </p>
          <p className="leading-7 text-muted-foreground">
            See the <Link href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link> for
            the detailed data-flow description.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Corrections and feedback</h2>
          <p className="leading-7 text-muted-foreground">
            Readers can report incorrect, outdated, or misleading information through the
            <Link href="/contact" className="ml-1 text-primary underline underline-offset-2">Contact page</Link>
            or the project's GitHub repository. Include the page URL and the specific statement that needs review.
          </p>
        </section>

        <footer className="border-t border-border/30 pt-6 text-xs text-muted-foreground">
          Policy maintained by {SITE_CONFIG.companyOrOwnerName}. Last updated {SITE_CONFIG.lastUpdatedDate}.
        </footer>
      </article>
    </ToolLayout>
  );
}
