import type { Metadata } from "next";
import { SITE_URL } from "@/constants/config";
import { generateCollectionPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Extraction Tools — Free Text, HTML, JSON & Data Extractors | SopKit",
  description: "Free extraction tools for URLs, emails, domains, IPs, HTML metadata, links, images, JSONPath, regex, and CSV columns. Browser-based and private.",
  keywords: ["extraction tools","data extraction tools","url extractor","email extractor","html extractor","jsonpath extractor","regex extractor","csv column extractor","extract data online"],
  alternates: { canonical: SITE_URL + "/extraction-tools" },
  openGraph: { title:"Free Extraction Tools | SopKit", description:"Extract URLs, emails, domains, HTML data, JSON values, regex matches, and CSV columns locally in your browser.", url:SITE_URL+"/extraction-tools", siteName:"SopKit", type:"website" },
  twitter: { card:"summary_large_image", title:"Free Extraction Tools | SopKit", description:"Browser-based tools for extracting structured data from text, HTML, JSON, regex, and CSV." },
  robots: { index:true, follow:true },
};
const schema=generateCollectionPageSchema("extraction",{name:"Extraction Tools",description:"Free browser-based tools for extracting structured data from text, HTML, JSON, regex, and CSV."});
export default function ExtractionLayout({children}:{children:React.ReactNode}){return <div className="min-h-screen bg-background"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>{children}</div>}
