import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Header from "./_compo/Header";
import Footer from "./_compo/Footer";

export const metadata = {
  metadataBase: new URL('https://sopkit.github.io'),
  title: {
    default: 'SopKit - Professional Web Development Tools & Utilities',
    template: '%s | SopKit'
  },
  description: 'Boost your productivity with specific, high-performance web development tools. Free, open-source, and privacy-focused.',
  keywords: [
    'SopKit', 'web tools', 'developer utilities', 'json formatter', 'markdown converter',
    'base64 encoder', 'url encoder', 'color picker', 'regex tester'
  ],
  authors: [{ name: 'SopKit Team', url: 'https://sopkit.github.io' }],
  creator: 'SopKit',
  publisher: 'SopKit',
  manifest: '/manifest.json',
  verification: {
    other: {
      "msvalidate.01": "17C08D63200B0D5D18F08C23B8B8F3C5"
    }
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
    emails: ['sh20raj@gmail.com'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sopkit',
    creator: '@sopkit',
    title: 'SopKit - Professional Web Development Tools & Utilities',
    description: 'Discover SopKit\'s powerful suite of free, open-source web development tools.',
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
  category: 'Technology',
  classification: 'Web Development Tools',
};

export const viewport = {
  themeColor: '#5b21b6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>

      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <div className="fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black"></div>
        <div className="fixed inset-0 -z-10 h-full w-full bg-[url('/grid.svg')] opacity-20 bg-repeat mask-image-gradient"></div>
        
        <Header />
        <main className="relative flex min-h-screen flex-col pt-20">
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <Footer />
        
        {/* Analytics Scripts */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E9Q2600LW2"
        />
        <script
          dangerouslySetInnerHTML={{
             __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E9Q2600LW2', {
                page_title: document.title,
                page_location: window.location.href,
                anonymize_ip: true,
                send_page_view: true
              });
             `
          }}
        />
      </body>
    </html>
  );
}
