import Downloader from '@/components/tools/Downloader';
import { Youtube } from 'lucide-react';

export const metadata = {
  title: 'YouTube Video Downloader | Download MP4 & MP3',
  description: 'Download YouTube videos in 1080p, 4K, MP4, and MP3 formats for free. Best online YouTube Downloader with no watermarks.',
  keywords: 'youtube downloader, youtube video downloader, y2mate alternative, save youtube video, youtube to mp3, 4k video downloader',
  openGraph: {
    title: 'YouTube Downloader | Free Online Video Saver',
    description: 'Save YouTube videos to your device instantly. High quality MP4 and MP3 supported.',
  },
  alternates: {
    canonical: 'https://sopkit.github.io/tools/youtube-downloader',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SopKit YouTube Downloader",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "A free tool to download YouTube videos and audio in high quality.",
  "featureList": ["1080p Support", "MP3 Extraction", "No Watermark"]
};

export default function Page() {
  return (
    <div className="container-safe py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 animate-gradient-text tracking-tight">
          YouTube Downloader
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download unlimited YouTube videos in MP4 and MP3 formats. 
          Simply paste the link and hit download.
        </p>
      </div>

      <Downloader 
        platformName="YouTube"
        icon={<Youtube className="w-5 h-5" />}
        placeholder="Paste YouTube Link (e.g. https://youtu.be/...)"
        colorClasses="from-red-600 to-rose-600"
        buttonColor="bg-red-600 hover:bg-red-700"
      />

      <div className="prose dark:prose-invert max-w-none glass-card p-8 rounded-2xl mx-auto mt-12 w-full max-w-3xl">
        <h2>How to Download YouTube Videos?</h2>
        <ol>
          <li>Copy the URL of the YouTube video you want to download.</li>
          <li>Paste the URL into the input box above.</li>
          <li>Click the &quot;Download&quot; button.</li>
          <li>Choose your preferred format (MP4 or MP3) and quality.</li>
        </ol>
        <p>
          Our tool supports all devices including iPhone, Android, Mac, and Windows PC. 
          No software installation is required.
        </p>
      </div>
    </div>
  );
}
