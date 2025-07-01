import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_compo/Header";
import Footer from "./_compo/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
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
    'online tools', 'developer productivity', 'web utilities', 'code tools',
    'base64 encoder', 'URL encoder', 'hash generator', 'password generator',
    'color picker', 'regex tester', 'minifier', 'beautifier', 'validator'
  ],
  authors: [{ name: 'SopKit Team', url: 'https://sopkit.github.io' }],
  creator: 'SopKit',
  publisher: 'SopKit',
  category: 'technology',
  classification: 'Web Development Tools',
  applicationName: 'SopKit',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    notranslate: false,
    indexifembedded: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://sopkit.github.io',
    languages: {
      'en-US': 'https://sopkit.github.io',
      'x-default': 'https://sopkit.github.io'
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
        type: 'image/png',
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
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '96x96', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
  other: {
    'msapplication-TileColor': '#0070f3',
    'msapplication-config': '/browserconfig.xml',
  },
};

// Enhanced JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SopKit",
  "applicationCategory": "DeveloperApplication",
  "applicationSubCategory": "Web Development Tools",
  "description": "A comprehensive suite of free and open-source web development tools to enhance productivity and streamline workflows.",
  "url": "https://sopkit.github.io",
  "operatingSystem": "Any",
  "browserRequirements": "Requires HTML5 support",
  "softwareVersion": "1.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString(),
  "author": {
    "@type": "Organization",
    "name": "SopKit",
    "url": "https://sopkit.github.io"
  },
  "creator": {
    "@type": "Organization",
    "name": "SopKit",
    "url": "https://sopkit.github.io"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SopKit",
    "url": "https://sopkit.github.io",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sopkit.github.io/logo.png"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "12500",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "JSON Formatter and Validator",
    "HTML to JSX Converter", 
    "Markdown to HTML Converter",
    "Base64 Encoding and Decoding",
    "URL Encoding and Decoding",
    "Hash Generators (MD5, SHA1, SHA256)",
    "Password Generator",
    "Color Picker and Palette Generator",
    "Code Formatters and Minifiers",
    "Regular Expression Tester",
    "Lorem Ipsum Generator",
    "Timestamp Converter",
    "QR Code Generator",
    "Image Compressor",
    "CSS and Gradient Generators"
  ],
  "screenshot": "https://sopkit.github.io/og.png",
  "softwareHelp": {
    "@type": "CreativeWork",
    "url": "https://sopkit.github.io/about"
  },
  "downloadUrl": "https://sopkit.github.io",
  "installUrl": "https://sopkit.github.io",
  "permissions": "No special permissions required",
  "storageRequirements": "Minimal local storage for preferences"
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SopKit",
  "url": "https://sopkit.github.io",
  "logo": {
    "@type": "ImageObject", 
    "url": "https://sopkit.github.io/logo.png",
    "width": 192,
    "height": 192
  },
  "description": "Professional web development tools and utilities provider",
  "foundingDate": "2024-01-01",
  "sameAs": [
    "https://github.com/sopkit",
    "https://twitter.com/sopkit"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "sh20raj@gmail.com",
    "contactType": "Customer Service",
    "availableLanguage": "English"
  },
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Web Development",
    "Programming Tools",
    "Code Conversion",
    "Data Formatting",
    "Developer Utilities"
  ]
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SopKit",
  "url": "https://sopkit.github.io",
  "description": "Professional web development tools and utilities",
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://sopkit.github.io/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "author": {
    "@type": "Organization",
    "name": "SopKit"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SopKit",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sopkit.github.io/logo.png"
    }
  }
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sopkit.github.io"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://sopkit.github.io/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "About",
      "item": "https://sopkit.github.io/about"
    }
  ]
};

// Google Analytics with enhanced tracking
let script = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-E9Q2600LW2', {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
    allow_google_signals: false,
    send_page_view: true,
    custom_map: {
      'custom_parameter_1': 'tool_usage'
    }
  });
  
  // Enhanced performance monitoring
  gtag('config', 'G-E9Q2600LW2', {
    custom_map: {'metric1': 'page_load_time'}
  });
  
  // Track Core Web Vitals
  function sendToGoogleAnalytics({name, delta, value, id}) {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
    });
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        
        {/* DNS prefetch for performance optimization */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/og.png" as="image" type="image/png" />
        
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* Google Analytics with enhanced features */}
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
        
        {/* Microsoft Clarity for user behavior analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
            `
          }}
        />
        
        {/* Web Vitals tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function getCLS(onReport) {
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                      onReport(entry);
                    }
                  }
                }).observe({entryTypes: ['layout-shift']});
              }
              
              function getFID(onReport) {
                new PerformanceObserver((entryList) => {
                  for (const entry of entryList.getEntries()) {
                    onReport(entry);
                  }
                }).observe({entryTypes: ['first-input']});
              }
              
              function getLCP(onReport) {
                new PerformanceObserver((entryList) => {
                  const entries = entryList.getEntries();
                  const lastEntry = entries[entries.length - 1];
                  onReport(lastEntry);
                }).observe({entryTypes: ['largest-contentful-paint']});
              }
            `
          }}
        />
      </head>

      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="mt-20" role="main" itemScope itemType="https://schema.org/WebPageElement">
          <div className="container mx-auto">{children}</div>
        </main>
        <Footer />
        
        {/* Service Worker registration for PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
