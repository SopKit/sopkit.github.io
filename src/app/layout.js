import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SopKit",
  description: "Free and open-source online tools",
  image: "/logo.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SopKit - Your Web Development Toolkit</title>
        <meta
          name="description"
          content="SopKit offers a wide range of free online tools for web developers, including JSON Prettify, HTML Minify, Random Data generators, and more."
        />
        <meta
          name="keywords"
          content="SopKit, web development tools, JSON Prettify, HTML Minify, Random Data, SEO"
        />
        <meta name="author" content="SopKit" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sopkit.github.io" />
        <meta
          property="og:title"
          content="SopKit - Your Web Development Toolkit"
        />
        <meta
          property="og:description"
          content="SopKit offers a wide range of free online tools for web developers, including JSON Prettify, HTML Minify, Random Data generators, and more."
        />
        <meta property="og:image" content="/og.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sopkit.github.io" />
        <meta
          property="twitter:title"
          content="SopKit - Your Web Development Toolkit"
        />
        <meta
          property="twitter:description"
          content="SopKit offers a wide range of free online tools for web developers, including JSON Prettify, HTML Minify, Random Data generators, and more."
        />
        <meta property="twitter:image" content="/og.png" />
        {/* Canonical link */}
        <link rel="canonical" href="https://sopkit.github.io" />
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="3CiFL7IWasvi7F2xq-CMr-R5G76Fnrwaw_-v4DgB6us"
        />
        {/* Bing Site Verification */}
        <meta name="msvalidate.01" content />
        {/* Google Analytics */}
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1828915420581549"
     crossOrigin="anonymous"></script>
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
