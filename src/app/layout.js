import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_compo/Header";
import Footer from "./_compo/Footer";

const inter = Inter({ subsets: ["latin"] });

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
  }
};

let script = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-E9Q2600LW2');
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SopKit - Professional Web Development Tools & Utilities</title>
        <meta
          name="description"
          content="Discover SopKit's powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities."
        />
        <meta
          name="keywords"
          content="SopKit, web development tools, developer utilities, open source tools, coding tools, web tools, programming utilities, free developer tools"
        />
        <meta name="author" content="SopKit" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sopkit.github.io" />
        <meta
          property="og:title"
          content="SopKit - Professional Web Development Tools & Utilities"
        />
        <meta
          property="og:description"
          content="Discover SopKit's powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities."
        />
        <meta property="og:image" content="/og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sopkit" />
        <meta property="twitter:url" content="https://sopkit.github.io" />
        <meta
          property="twitter:title"
          content="SopKit - Professional Web Development Tools & Utilities"
        />
        <meta
          property="twitter:description"
          content="Discover SopKit's powerful suite of free, open-source web development tools. Boost your productivity with our modern, efficient, and user-friendly development utilities."
        />
        <meta property="twitter:image" content="/og.png" />

        {/* Canonical link */}
        <link rel="canonical" href="https://sopkit.github.io" />

        {/* Favicon */}
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E9Q2600LW2"
        ></script>
        <script dangerouslySetInnerHTML={{ __html: script }}></script>

        {/* Google Adsense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className={inter.className}>
        <Header />
        <main className="mt-20">
          <div className="container mx-auto">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
