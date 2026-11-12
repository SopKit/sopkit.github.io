import type { Metadata } from "next";
import { buildCanonicalUrl } from "@/seo/canonical";

export const metadata: Metadata = {
  title: "Extraction Tools — Text, HTML & JSON Extractors | SopKit",
  description: "Free extraction tools for URLs, emails, domains, IPs, HTML metadata, links, images, JSONPath, regex, and CSV columns. Browser-based and private.",
  openGraph: { title:"Free Extraction Tools | SopKit", description:"Extract URLs, emails, domains, HTML data, JSON values, regex matches, and CSV columns locally in your browser.", url:buildCanonicalUrl("/extraction-tools"), siteName:"SopKit", type:"website" },
  twitter: { card:"summary_large_image", site:"@sopkit", title:"Free Extraction Tools | SopKit", description:"Browser-based tools for extracting structured data from text, HTML, JSON, regex, and CSV. Extract URLs, emails, domains, and links locally." },
  robots: { index:true, follow:true },
};
export default function ExtractionLayout({children}:{children:React.ReactNode}){return <div className="min-h-screen bg-background">{children}</div>}
