import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { getAllTools, Tool } from "@/lib/tools";
import { SITE_URL, TOOL_COUNT_STRING, GITHUB_REPO_URL } from "@/constants/config";
import "./globals.css";
import Script from "next/script";
import { Inter, Newsreader } from "next/font/google";
// NOTE: Do NOT use next/dynamic inside this Server Component.
// In Next 16, next/dynamic within an RSC throws an uncaught
// BAILOUT_TO_CLIENT_SIDE_RENDERING during prerender, which empties the
// entire page HTML for crawlers (site-wide SEO regression). Use direct
// imports for any component rendered by the root layout.
import { Suspense } from "react";
import { PWARegistration } from "@/components/shared/PWARegistration";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import { GA4RouteTracker } from "@/components/shared/GA4RouteTracker";
import { WebVitalsReporter } from "@/components/shared/WebVitalsReporter";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

import { ClientStackAuthProvider } from "@/components/shared/ClientStackAuthProvider";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	preload: true,
	variable: "--font-inter",
	weight: ["400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
	subsets: ["latin"],
	display: "swap",
	preload: true,
	variable: "--font-editorial",
	style: ["normal", "italic"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};
const DEFAULT_DESCRIPTION = `Professional online toolkit with ${TOOL_COUNT_STRING} free tools for image compression, PDF editing, video conversion, SEO analysis, developer utilities, text processing, and more. No registration required. Privacy-focused, fast, and secure browser-based processing.`;

const siteVerification = {
	...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
		: {}),
	...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
		? { yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
		: {}),
	...(process.env.NEXT_PUBLIC_YAHOO_VERIFICATION
		? { yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION }
		: {}),
	...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
		? {
				other: {
					"msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION],
				},
			}
		: {}),
};

export const metadata: Metadata = {
	title: {
		default: "Free Online Tools - No Signup | SopKit",
		template: "%s",
	},
	description: `Professional online toolkit with ${TOOL_COUNT_STRING} free tools for image compression, PDF editing, video conversion, SEO analysis, developer utilities, text processing, and more. Free to use with no signup required.`,
	authors: [{ name: "SopKit Team", url: SITE_URL }],
	creator: "SopKit",
	publisher: "SopKit",
	category: "Technology",
	classification: "Online Tools and Utilities",
	applicationName: "SopKit",
	referrer: "origin-when-cross-origin",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL(SITE_URL),
	alternates: {
		canonical: `${SITE_URL}/`,
		types: {
			"application/rss+xml": [{ url: "/feed.xml", title: "SopKit RSS Feed" }],
		},
	},
	openGraph: {
		title: `SopKit — ${TOOL_COUNT_STRING} Free Online Tools`,
		description: "Free online tools for image, PDF, video, audio, SEO, and developer workflows. Fast browser-sandboxed utilities with transparent processing.",
		url: `${SITE_URL}/`,
		siteName: "SopKit",
		images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SopKit — 600+ Free Online Tools" }],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: `SopKit — ${TOOL_COUNT_STRING} Free Online Tools`,
		description: "Free online tools for image, PDF, video, audio, SEO, and developer workflows. Fast browser-sandboxed utilities with transparent processing.",
		images: [`${SITE_URL}/og-image.png`],
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
		},
	},
	...(Object.keys(siteVerification).length > 0
		? { verification: siteVerification }
		: {}),
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "32x32" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [
			{
				url: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
			{
				url: "/icons/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
		other: [
			{
				rel: "mask-icon",
				url: "/icons/safari-pinned-tab.svg",
				color: "#2563eb",
			},
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "SopKit",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	let tools: Tool[] = [];
	try {
		tools = getAllTools();
	} catch (error) {
		console.error("Failed to load tools registry:", error);
	}
	const categoriesMap = new Map();

	for (const tool of tools) {
		const catKey = tool.categoryKey || tool.category;
		if (catKey && !categoriesMap.has(catKey)) {
			const canonicalCategoryHubs: Record<string, string> = {
				image: "/image-tools",
				pdf: "/pdf-tools",
				video: "/video-tools",
				audio: "/audio-tools",
				seo: "/seo-tools",
				text: "/text-tools",
				developer: "/developer-tools",
				utilities: "/other-tools",
				generators: "/generators",
				calculators: "/calculators",
			};
			categoriesMap.set(catKey, {
				label: tool.categoryName || catKey,
				href: canonicalCategoryHubs[catKey] || "/search",
			});
		}
	}
	const categories = Array.from(categoriesMap.values());

	return (
		<html lang="en" suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
			<head>
				<meta charSet="utf-8" />
				<Script src="/coi-serviceworker.min.js" strategy="afterInteractive" />

				{/* Preconnect only to the most critical third-party origin */}
				<link
					rel="preconnect"
					href="https://www.googletagmanager.com"
					crossOrigin="anonymous"
				/>
				<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
				<link rel="dns-prefetch" href="https://www.clarity.ms" />

				<meta httpEquiv="Content-Language" content="en" />

				{/* Enhanced SEO Meta Tags */}
				<meta name="application-name" content="SopKit" />
				<meta name="apple-mobile-web-app-title" content="SopKit" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#2563eb" />
				<meta name="msapplication-tap-highlight" content="no" />

				{/* Robots handled by Next.js metadata API */}
				<meta
					name="google-adsense-account"
					content="ca-pub-1828915420581549"
				></meta>

				{/* Search Box */}
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="SopKit Search"
					href="/opensearch.xml"
				/>
				<link
					rel="alternate"
					type="text/plain"
					title="SopKit LLM Index"
					href="/llms.txt"
				/>

				{/* Alternate */}
				<link
					rel="alternate"
					type="application/rss+xml"
					title="SopKit RSS Feed"
					href="/feed.xml"
				/>

			{/* Global JSON-LD Structured Data: WebSite + Organization */}
			<Script
				id="jsonld-website"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "SopKit",
						url: `${SITE_URL}/`,
						description: `${TOOL_COUNT_STRING} free online tools for image, PDF, video, audio, SEO, and developer workflows. Fast browser-sandboxed utilities with transparent data processing.`,
						potentialAction: {
							"@type": "SearchAction",
							target: {
								"@type": "EntryPoint",
								urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
							},
							"query-input": "required name=search_term_string",
						},
					}),
				}}
			/>
			<Script
				id="jsonld-organization"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "SopKit",
						url: `${SITE_URL}/`,
						logo: `${SITE_URL}/logo.png`,
						sameAs: [
							GITHUB_REPO_URL,
						],
						description: `Privacy-first free online toolkit with ${TOOL_COUNT_STRING} browser-based tools.`,
					}),
				}}
			/>

				<Script
					src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
					strategy="lazyOnload"
				/>
				<Script id="google-analytics" strategy="lazyOnload">
					{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            `}
				</Script>
				{process.env.NEXT_PUBLIC_ENABLE_ADS === "true" && (
					<Script
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
						strategy="lazyOnload"
						crossOrigin="anonymous"
					/>
				)}
				{/* Clarity Tracking Code */}
				<Script
					id="clarity-tracking"
					strategy="lazyOnload"
					dangerouslySetInnerHTML={{
						__html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "uh6y61lx9p");
            `,
					}}
				/>
			</head>
			<body className={`font-sans antialiased min-h-screen bg-background text-foreground ${inter.className}`}>
				<ClientStackAuthProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<Header />
						{children}
						<Footer />
						<Toaster />
						<PWARegistration />
						<OfflineIndicator />
						<Suspense fallback={null}>
							<GA4RouteTracker />
						</Suspense>
						<WebVitalsReporter />
					</ThemeProvider>
				</ClientStackAuthProvider>

				<Script
					src="https://assets.onedollarstats.com/stonks.js"
					strategy="lazyOnload"
				/>
			</body>
		</html>
	);
}
