import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_compo/Header";
import Footer from "./_compo/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  metadataBase: new URL('https://sopkit.github.io'),
  title: {
    default: 'SopKit - Professional Web Development Tools & Utilities',
    template: '%s | SopKit - Professional Web Development Tools'
  },
  description: 'Discover SopKit\'s powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities including JSON formatters, converters, validators, and more.',
  keywords: [
    'SopKit', 'web development tools', 'developer utilities', 'open source tools', 
    'coding tools', 'web tools', 'programming utilities', 'free developer tools',
    'JSON formatter', 'HTML to JSX', 'markdown converter', 'encoding tools',
    'online tools', 'developer productivity', 'web utilities', 'code tools'
  ],
  authors: [{ name: 'SopKit Team' }],
  creator: 'SopKit',
  publisher: 'SopKit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sopkit.github.io',
    title: 'SopKit - Professional Web Development Tools & Utilities',
    description: 'Discover SopKit\'s powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities.',
    siteName: 'SopKit',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SopKit - Professional Web Development Tools',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sopkit',
    creator: '@sopkit',
    title: 'SopKit - Professional Web Development Tools & Utilities',
    description: 'Discover SopKit\'s powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SopKit",
  "description": "A comprehensive suite of free and open-source web development tools to enhance productivity and streamline workflows.",
  "url": "https://sopkit.github.io",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "SopKit",
    "url": "https://sopkit.github.io"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "10000"
  },
  "featureList": [
    "JSON Formatter and Validator",
    "HTML to JSX Converter", 
    "Markdown to HTML Converter",
    "Encoding and Decoding Tools",
    "Web Development Utilities",
    "Code Formatters and Minifiers"
  ]
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SopKit",
  "url": "https://sopkit.github.io",
  "logo": "https://sopkit.github.io/logo.png",
  "sameAs": [
    "https://github.com/sopkit",
    "https://twitter.com/sopkit"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "sh20raj@gmail.com",
    "contactType": "Customer Service"
  }
};

let script = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-E9Q2600LW2', {
    page_title: document.title,
    page_location: window.location.href
  });
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E9Q2600LW2"
        />
        <script dangerouslySetInnerHTML={{ __html: script }} />

        {/* Google Adsense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
          crossOrigin="anonymous"
        />
      </head>

      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="mt-20" role="main">
          <div className="container mx-auto">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
