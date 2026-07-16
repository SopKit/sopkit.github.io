import type { Metadata } from "next";
import HubPage from "@/components/seo/HubPage";

export const metadata: Metadata = {
	title: "Local Business Tools - Free QR Codes, SEO & Invoicing | SopKit",
	description: "Free online tools for local shops and restaurants. Generate restaurant QR menus, WiFi QR codes, customer invoices, and local business SEO tags.",
	alternates: { canonical: "https://sopkit.github.io/local-business-tools/" },
};

export default function LocalBusinessToolsHub() {
	return (
		<HubPage
			title="Local Business Tools"
			description="Optimize offline operations and local search engine visibility with free QR tools, business calculators, and invoice generators."
			route="/local-business-tools"
		tools={getAllTools().filter(t => ["qr-code-generator","qr-code-generator-business","whatsapp-link-generator","google-business-profile-description-generator","restaurant-menu-description-generator","invoice-generator-india","rent-receipt-generator","simple-invoice-generator"].includes(t.id))}
			mainCategorySlugs={["generators"]}
			guideTitle="Growing Your Local Business"
			guidePoints={[
				"Create WiFi and UPI payment QR codes to simplify client checkout and customer connectivity.",
				"Use visual invoice generators to quickly generate PDF receipts and estimates.",
				"All calculations and configurations are 100% private, processed directly on your store's device.",
			]}
			faqs={[
				{ question: "How do customers connect to my WiFi using QR?", answer: "Customers simply scan the printed WiFi QR code with their smartphone camera to connect to your network instantly." },
				{ question: "Are UPI payment QR codes secure?", answer: "Yes. They are generated based on your UPI ID locally. The payments go directly to your bank account without fees." },
				{ question: "Do you store merchant details?", answer: "No, SopKit does not store any business parameters, invoice records, or client details." },
			]}
		/>
	);
}
