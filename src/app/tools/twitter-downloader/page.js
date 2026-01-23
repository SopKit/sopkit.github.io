import Downloader from '@/components/tools/Downloader';
import { Twitter } from 'lucide-react';

export const metadata = {
  title: 'Twitter Video Downloader | Save X Videos & GIFs',
  description: 'Download videos and GIFs from Twitter (X). Free online X Video Downloader in HD. Save tweets to MP4 instantly.',
  keywords: 'twitter video downloader, x video downloader, save twitter video, download tweet video, twitter mp4, x media saver',
  openGraph: {
    title: 'Twitter/X Downloader | Save Videos & GIFs',
    description: 'Download videos from X (formerly Twitter) in high definition.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/twitter-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit Twitter Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A tool to download videos and GIFs from Twitter/X.",
  "featureList": ["Twitter Video Support", "GIF Support", "X Platform Compatible"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500 animate-gradient-text tracking-tight">
          Twitter / X Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download videos and GIFs from X (Twitter) easily. 
          Just copy the tweet link and paste it here.
        </p>
      </div>

      <Downloader 
        platformName="Twitter"
        icon={<Twitter className="w-5 h-5" />}
        placeholder="Paste Tweet Link..."
        colorClasses="from-sky-400 to-blue-500"
        buttonColor="bg-black hover:bg-zinc-800"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>About X Downloader</h2>
        <p>
          Since Twitter rebranded to X, many downloaders stopped working. 
          Our tool supports the new X.com domain as well as legacy twitter.com links.
        </p>
      </div>
    </div>
  );
}
