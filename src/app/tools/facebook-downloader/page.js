import Downloader from '@/components/tools/Downloader';
import { Facebook } from 'lucide-react';

export const metadata = {
  title: 'Facebook Video Downloader | Download FB Reels & Videos',
  description: 'Download Facebook videos and Reels in 1080p HD. Free online FB Downloader. No login required.',
  keywords: 'facebook downloader, fb video downloader, facebook reel downloader, fb video saver, savefrom fb',
  openGraph: {
    title: 'Facebook Video Downloader | HD FB Saver',
    description: 'Download public Facebook videos and reels in high definition.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/facebook-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Facebook Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download public videos and reels from Facebook.",
  "featureList": ["Reel Support", "1080p Support", "Public Video Support"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 animate-gradient-text tracking-tight">
          Facebook Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download Facebook Videos and Reels in HD. 
          Simply paste the post URL.
        </p>
      </div>

      <Downloader 
        platformName="Facebook"
        icon={<Facebook className="w-5 h-5" />}
        placeholder="Paste Facebook Video/Reel Link..."
        colorClasses="from-blue-600 to-blue-800"
        buttonColor="bg-blue-600 hover:bg-blue-700"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>About Facebook Downloader</h2>
        <p>
          This tool allows you to save videos from Facebook to your device. 
          It supports standard video posts, Reels, and Watch videos. 
          Note that we can only download <strong>public</strong> videos.
        </p>
      </div>
    </div>
  );
}
